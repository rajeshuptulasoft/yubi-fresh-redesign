import axiosInstance, { apiGet, apiPost, apiPut, apiDelete } from './axios';

// ============ ORDERS API ============
export const ordersAPI = {
  // Get all orders (admin)
  getAllOrders: (params = {}) => apiGet('/orders', { params }),
  
  // Get order by ID
  getOrderById: (orderId) => apiGet(`/orders/${orderId}`),
  
  // Create new order
  createOrder: (orderData) => apiPost('/orders', orderData),
  
  // Update order status
  updateOrderStatus: (orderId, status) => apiPut(`/orders/${orderId}`, { status }),
  
  // Delete order
  deleteOrder: (orderId) => apiDelete(`/orders/${orderId}`),
  
  // Get user's orders
  getUserOrders: (userId) => apiGet(`/orders/user/${userId}`),
};

// ============ PRODUCTS API ============
export const productsAPI = {
  // Get all products
  getAllProducts: (params = {}) => apiGet('/products', { params }),
  
  // Get product by ID
  getProductById: (productId) => apiGet(`/products/${productId}`),
  
  // Create product (admin)
  createProduct: (productData) => apiPost('/products', productData),
  
  // Update product (admin)
  updateProduct: (productId, productData) => apiPut(`/products/${productId}`, productData),
  
  // Delete product (admin)
  deleteProduct: (productId) => apiDelete(`/products/${productId}`),
  
  // Get products by category
  getProductsByCategory: (category, params = {}) => apiGet(`/products/category/${category}`, { params }),
};

// ============ USERS API ============
export const usersAPI = {
  // Get all users (admin)
  getAllUsers: (params = {}) => apiGet('/users', { params }),
  
  // Get user profile
  getUserProfile: (userId) => apiGet(`/users/${userId}`),
  
  // Update user profile
  updateUserProfile: (userId, userData) => apiPut(`/users/${userId}`, userData),
  
  // Delete user (admin)
  deleteUser: (userId) => apiDelete(`/users/${userId}`),
};

// ============ DELIVERY PARTNERS API ============
export const deliveryAPI = {
  // Get all delivery partners (admin)
  getAllPartners: (params = {}) => apiGet('/delivery-partners', { params }),
  
  // Get partner by ID
  getPartnerById: (partnerId) => apiGet(`/delivery-partners/${partnerId}`),
  
  // Update partner status
  updatePartnerStatus: (partnerId, status) => apiPut(`/delivery-partners/${partnerId}`, { status }),
  
  // Get partner's deliveries
  getPartnerDeliveries: (partnerId) => apiGet(`/delivery-partners/${partnerId}/deliveries`),
  
  // Assign delivery to partner
  assignDelivery: (partnerId, orderId) => apiPost(`/delivery-partners/${partnerId}/assign`, { orderId }),
};

// ============ AUTHENTICATION API ============
export const authAPI = {
  // User login
  userLogin: (email, password) => apiPost('/food/login', { email, password }),
  
  // Login
  login: (email, password) => apiPost('/auth/login', { email, password }),
  
  // Admin login
  adminLogin: (email, password) => apiPost('/auth/admin/login', { email, password }),
  
  // Delivery partner login
  deliveryLogin: (email, password) => apiPost('/auth/delivery/login', { email, password }),
  
  // Register
  register: (userData) => apiPost('/auth/register', userData),
  
  // Logout
  logout: () => apiPost('/auth/logout', {}),
  
  // Refresh token
  refreshToken: () => apiPost('/auth/refresh', {}),
};

// ============ CATEGORIES API ============
export const categoriesAPI = {
  // Get all categories
  getAllCategories: () => apiGet('/categories'),
  
  // Get category by ID
  getCategoryById: (categoryId) => apiGet(`/categories/${categoryId}`),
  
  // Create category (admin)
  createCategory: (categoryData) => apiPost('/categories', categoryData),
  
  // Update category (admin)
  updateCategory: (categoryId, categoryData) => apiPut(`/categories/${categoryId}`, categoryData),
  
  // Delete category (admin)
  deleteCategory: (categoryId) => apiDelete(`/categories/${categoryId}`),
};

// ============ PAYMENT API ============
export const paymentAPI = {
  // Initialize payment
  initializePayment: (amount, method) => apiPost('/payments/init', { amount, method }),
  
  // Verify payment
  verifyPayment: (transactionId, signature) => apiPost('/payments/verify', { transactionId, signature }),
  
  // Get payment history
  getPaymentHistory: (userId) => apiGet(`/payments/history/${userId}`),
};

// ============ BLOGS API ============
export const blogsAPI = {
  // Get all blogs
  getAllBlogs: (params = {}) => apiGet('/blogs', { params }),
  
  // Get blog by ID
  getBlogById: (blogId) => apiGet(`/blogs/${blogId}`),
  
  // Create blog (admin)
  createBlog: (blogData) => apiPost('/blogs', blogData),
  
  // Update blog (admin)
  updateBlog: (blogId, blogData) => apiPut(`/blogs/${blogId}`, blogData),
  
  // Delete blog (admin)
  deleteBlog: (blogId) => apiDelete(`/blogs/${blogId}`),
};

// ============ CONTACT API ============
export const contactAPI = {
  // Submit contact form
  submitContactForm: (contactData) => apiPost('/contact', contactData),
};
