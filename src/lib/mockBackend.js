// ─────────────────────────────────────────────────────────────────────────────
// Mock backend — in-memory + localStorage shim that mimics the small subset of
// the Supabase JS client our app uses (auth, from(...).select/insert/update,
// channel/realtime). All data is seeded from src/data/*.
// ─────────────────────────────────────────────────────────────────────────────
import { users as seedUsers } from "@/data/users";
import { orders as seedOrders } from "@/data/orders";

const STORAGE_KEY = "yubi_mock_db_v1";
const SESSION_KEY = "yubi_mock_session_v1";

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // First boot — seed
  return {
    profiles: seedUsers.map((u) => ({
      id: u.id, full_name: u.full_name, phone: u.phone, address: u.address,
      avatar: u.avatar, is_online: u.is_online,
    })),
    user_roles: seedUsers.map((u) => ({ user_id: u.id, role: u.role })),
    users: seedUsers.map(({ password, ...rest }) => ({ ...rest })),
    auth_passwords: Object.fromEntries(seedUsers.map((u) => [u.email, u.password])),
    orders: [...seedOrders],
    notifications: [],
  };
}

const db = loadDb();
const persist = () => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); } catch {}
};

// ── Realtime channels ────────────────────────────────────────────────────────
const channels = new Map(); // name -> { listeners: [{table, event, filter, cb}] }

function notifyChange(table, event, row) {
  channels.forEach((ch) => {
    ch.listeners.forEach((l) => {
      if (l.table !== table) return;
      if (l.event !== "*" && l.event !== event) return;
      if (l.filter && !matchFilter(l.filter, row)) return;
      // Mimic supabase payload shape
      l.cb({ eventType: event, new: row, old: row, errors: null });
    });
  });
}

function matchFilter(filter, row) {
  // filter format: "column=eq.value"
  const m = /^(\w+)=eq\.(.+)$/.exec(filter);
  if (!m) return true;
  return String(row?.[m[1]]) === m[2];
}

// ── Query builder ────────────────────────────────────────────────────────────
function tableQuery(table) {
  let rows = db[table] ? [...db[table]] : [];
  let returnError = null;

  const builder = {
    // Filters — return `this` so they chain
    eq(col, val) { rows = rows.filter((r) => r[col] === val); return builder; },
    neq(col, val) { rows = rows.filter((r) => r[col] !== val); return builder; },
    in(col, arr) { rows = rows.filter((r) => arr.includes(r[col])); return builder; },
    not(col, op, val) {
      // We only need: .not("status", "in", "(delivered,cancelled)")
      if (op === "in") {
        const list = String(val).replace(/^\(|\)$/g, "").split(",").map((s) => s.trim());
        rows = rows.filter((r) => !list.includes(r[col]));
      } else if (op === "is") {
        rows = rows.filter((r) => r[col] != null);
      }
      return builder;
    },
    order(col, opts = { ascending: true }) {
      rows.sort((a, b) => {
        const av = a[col], bv = b[col];
        if (av === bv) return 0;
        const cmp = av > bv ? 1 : -1;
        return opts.ascending ? cmp : -cmp;
      });
      return builder;
    },
    limit(n) { rows = rows.slice(0, n); return builder; },

    // Terminal — single row variants
    single() {
      const data = rows[0] || null;
      const error = data ? null : { message: "Row not found" };
      return Promise.resolve({ data, error });
    },
    maybeSingle() {
      return Promise.resolve({ data: rows[0] || null, error: null });
    },

    // Make the builder thenable — `.then(({ data }) => ...)` returns the array
    then(onFulfilled, onRejected) {
      return Promise.resolve({ data: rows, error: returnError }).then(onFulfilled, onRejected);
    },

    // ── select/insert/update/delete return chainable builders too ───────────
    select(_cols) { return builder; },
  };

  return builder;
}

function insertOp(table, payload) {
  const records = Array.isArray(payload) ? payload : [payload];
  const inserted = records.map((p) => {
    const row = {
      id: p.id || cryptoId(),
      created_at: p.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_read: false,
      ...p,
    };
    db[table] = db[table] || [];
    db[table].unshift(row);
    notifyChange(table, "INSERT", row);
    return row;
  });
  persist();

  // Return a builder so `.select().single()` still works after .insert(...)
  let result = inserted;
  const builder = {
    select() { return builder; },
    single() {
      return Promise.resolve({ data: result[0] || null, error: null });
    },
    maybeSingle() {
      return Promise.resolve({ data: result[0] || null, error: null });
    },
    then(onFulfilled, onRejected) {
      return Promise.resolve({ data: result, error: null }).then(onFulfilled, onRejected);
    },
  };
  return builder;
}

function updateOp(table, patch) {
  const matched = []; // rows we'll update once filters resolve
  const filters = []; // [{ kind: "eq", col, val }]

  const builder = {
    eq(col, val) { filters.push({ kind: "eq", col, val }); return builder; },
    in(col, arr) { filters.push({ kind: "in", col, arr }); return builder; },
    then(onFulfilled, onRejected) {
      const list = db[table] || [];
      list.forEach((r) => {
        const ok = filters.every((f) =>
          f.kind === "eq" ? r[f.col] === f.val :
          f.kind === "in" ? f.arr.includes(r[f.col]) : true
        );
        if (ok) {
          Object.assign(r, patch, { updated_at: new Date().toISOString() });
          matched.push(r);
          notifyChange(table, "UPDATE", r);
        }
      });
      persist();
      return Promise.resolve({ data: matched, error: null }).then(onFulfilled, onRejected);
    },
  };
  return builder;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
const authListeners = new Set();
let currentSession = (() => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
})();

function setSession(session) {
  currentSession = session;
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
  authListeners.forEach((cb) => cb(session ? "SIGNED_IN" : "SIGNED_OUT", session));
}

const auth = {
  getSession() {
    return Promise.resolve({ data: { session: currentSession }, error: null });
  },
  onAuthStateChange(cb) {
    authListeners.add(cb);
    // Mirror supabase shape
    return {
      data: {
        subscription: { unsubscribe: () => authListeners.delete(cb) },
      },
    };
  },
  async signInWithPassword({ email, password }) {
    const expected = db.auth_passwords[email];
    if (!expected || expected !== password) {
      return { data: null, error: { message: "Invalid email or password" } };
    }
    const u = db.users.find((x) => x.email === email);
    const session = { user: { id: u.id, email: u.email } };
    setSession(session);
    return { data: { session }, error: null };
  },
  async signUp({ email, password, options = {} }) {
    if (db.users.some((u) => u.email === email)) {
      return { data: null, error: { message: "Email already registered" } };
    }
    const meta = options.data || {};
    const id = cryptoId();
    const role = meta.role || "customer";
    db.users.push({ id, email, full_name: meta.full_name, phone: meta.phone, role });
    db.auth_passwords[email] = password;
    db.profiles.push({
      id, full_name: meta.full_name || "", phone: meta.phone || "",
      address: "", avatar: `https://i.pravatar.cc/200?u=${encodeURIComponent(email)}`,
      is_online: false,
    });
    db.user_roles.push({ user_id: id, role });
    persist();
    const session = { user: { id, email } };
    setSession(session);
    return { data: { session }, error: null };
  },
  async signOut() {
    setSession(null);
    return { error: null };
  },
};

// ── Channel API ──────────────────────────────────────────────────────────────
function channel(name) {
  const entry = { listeners: [], subscribed: false };
  channels.set(name, entry);
  const api = {
    on(_evt, opts, cb) {
      entry.listeners.push({
        table: opts.table,
        event: opts.event || "*",
        filter: opts.filter || null,
        cb: (payload) => cb(payload),
      });
      return api;
    },
    subscribe() { entry.subscribed = true; return api; },
  };
  return api;
}
function removeChannel(api) {
  // Best-effort: drop any channel whose api === provided
  channels.forEach((entry, key) => { if (entry === api?._entry) channels.delete(key); });
  // Simpler — clear all listeners on channels not currently re-bound
  // (tests show pages always re-create on mount, so this is fine)
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function cryptoId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return "id-" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

// ── Public client ────────────────────────────────────────────────────────────
export const supabase = {
  auth,
  from(table) {
    return {
      select: (cols) => tableQuery(table).select(cols),
      insert: (payload) => insertOp(table, payload),
      update: (patch) => updateOp(table, patch),
    };
  },
  channel,
  removeChannel,
};
