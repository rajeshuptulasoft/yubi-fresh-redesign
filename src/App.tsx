import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";

import Splash from "@/pages/Splash";
import Home from "@/pages/user/Home";
import Menu from "@/pages/user/Menu";
import SpiceStore from "@/pages/user/SpiceStore";
import Cart from "@/pages/user/Cart";
import Checkout from "@/pages/user/Checkout";
import OrderTracking from "@/pages/user/OrderTracking";
import OrderHistory from "@/pages/user/OrderHistory";
import Profile from "@/pages/user/Profile";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import Blog from "@/pages/user/Blog";
import BlogDetail from "@/pages/user/BlogDetail";
import Agro from "@/pages/user/Agro";
import Contact from "@/pages/user/Contact";
import About from "@/pages/user/About";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminAssignDelivery from "@/pages/admin/AdminAssignDelivery";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminDeliveryPartners from "@/pages/admin/AdminDeliveryPartners";
import AdminBlog from "@/pages/admin/AdminBlog";

import DeliveryDashboard from "@/pages/delivery/DeliveryDashboard";
import ActiveDelivery from "@/pages/delivery/ActiveDelivery";
import DeliveryHistory from "@/pages/delivery/DeliveryHistory";

const queryClient = new QueryClient();

function Shell() {
  const loc = useLocation();
  const hideChrome = loc.pathname === "/auth" || loc.pathname === "/";
  return (
    <>
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/spices" element={<SpiceStore />} />
        <Route path="/agro" element={<Agro />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:blogId" element={<BlogDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/track/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute allow={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute allow={["admin"]}><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/assign/:orderId" element={<ProtectedRoute allow={["admin"]}><AdminAssignDelivery /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute allow={["admin"]}><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/delivery-partners" element={<ProtectedRoute allow={["admin"]}><AdminDeliveryPartners /></ProtectedRoute>} />
        <Route path="/admin/blog" element={<ProtectedRoute allow={["admin"]}><AdminBlog /></ProtectedRoute>} />

        <Route path="/delivery" element={<ProtectedRoute allow={["delivery_partner"]}><DeliveryDashboard /></ProtectedRoute>} />
        <Route path="/delivery/active" element={<ProtectedRoute allow={["delivery_partner"]}><ActiveDelivery /></ProtectedRoute>} />
        <Route path="/delivery/history" element={<ProtectedRoute allow={["delivery_partner"]}><DeliveryHistory /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideChrome && <Footer />}
      {!hideChrome && <ScrollToTop />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-right" theme="light" richColors />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <Shell />
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
