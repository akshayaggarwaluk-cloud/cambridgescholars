import { ReactNode } from "react";
import { Navigate, Routes, Route, useLocation, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import ProtectedRoute from "./ProtectedRoute";

import Index from "@/pages/Index";
import Books from "@/pages/Books";
import BookDetails from "@/pages/BookDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import CheckoutResult from "@/pages/CheckoutResult";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Auth from "@/pages/Auth";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

import ExternalProfile from "@/pages/ExternalProfile";
import PayOrder from "@/pages/PayOrder";
import PublishBook from "@/pages/PublishBook";
import PublishABook from "@/pages/PublishABook";
import Wishlist from "@/pages/Wishlist";
import FAQ from "@/pages/FAQ";
import HowToPublish from "@/pages/HowToPublish";
import SubmitProposal from "@/pages/SubmitProposal";
import Typesetting from "@/pages/Typesetting";
import TypesettingUpload from "@/pages/TypesettingUpload";
import Resources from "@/pages/Resources";
import ResourceDetail from "@/pages/resources/ResourceDetail";
import EndorsementSubmission from "@/pages/EndorsementSubmission";
import News from "@/pages/News";
import NewsArticle from "@/pages/NewsArticle";
import NotFound from "@/pages/NotFound";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookiesPolicy from "@/pages/CookiesPolicy";
import TermsAndConditions from "@/pages/TermsAndConditions";
import AccessibilityPolicy from "@/pages/AccessibilityPolicy";
import RefundAndReturns from "@/pages/RefundAndReturns";
import AuthorExperiences from "@/pages/AuthorExperiences";
import AuthorPromises from "@/pages/AuthorPromises";
import ApiAudit from "@/pages/ApiAudit";
import Forthcoming from "@/pages/Forthcoming";
import SeriesList from "@/pages/SeriesList";
import SeriesDetail from "@/pages/SeriesDetail";
import Ebooks from "@/pages/Ebooks";

import AdminGate from "@/components/admin/AdminGate";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminHeroSlides from "@/pages/admin/AdminHeroSlides";
import AdminNews from "@/pages/admin/AdminNews";
import AdminAdmins from "@/pages/admin/AdminAdmins";
import AdminFeaturedBooks from "@/pages/admin/AdminFeaturedBooks";
import AdminAuthorReviews from "@/pages/admin/AdminAuthorReviews";
import AdminFaqs from "@/pages/admin/AdminFaqs";
import AdminResources from "@/pages/admin/AdminResources";
import AdminComingSoon from "@/pages/admin/AdminComingSoon";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminOrderDetail from "@/pages/admin/AdminOrderDetail";
import AdminCoupons from "@/pages/admin/AdminCoupons";
import AdminProposals from "@/pages/admin/AdminProposals";
import AdminProposalDetail from "@/pages/admin/AdminProposalDetail";
import AdminContactMessages from "@/pages/admin/AdminContactMessages";
import AdminContactMessageDetail from "@/pages/admin/AdminContactMessageDetail";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminUserDetail from "@/pages/admin/AdminUserDetail";

function RedirectBookToProduct() {
  const { id } = useParams();
  return <Navigate to={`/product/${id}`} replace />;
}

function RedirectPostPublication() {
  return <Navigate to="/post-publication" replace />;
}

function OrdersRedirect() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const newOrderId = params.get("new") || params.get("order_id") || params.get("orderId");
  const target = newOrderId
    ? `/profile?tab=orders&new=${encodeURIComponent(newOrderId)}`
    : "/profile?tab=orders";

  return <Navigate to={target} replace />;
}

function OrdersWildcardRedirect() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pathOrderId = location.pathname.match(/^\/orders\/([^/]+)/)?.[1];
  const newOrderId = params.get("new") || params.get("order_id") || params.get("orderId") || pathOrderId;
  const target = newOrderId
    ? `/profile?tab=orders&new=${encodeURIComponent(newOrderId)}`
    : "/profile?tab=orders";

  return <Navigate to={target} replace />;
}

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/product" element={<PageTransition><Books /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><BookDetails /></PageTransition>} />
        {/* Backwards-compat redirects from old /books URLs */}
        <Route path="/books" element={<Navigate to="/product" replace />} />
        <Route path="/books/:id" element={<RedirectBookToProduct />} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><ProtectedRoute><Checkout /></ProtectedRoute></PageTransition>} />
        <Route path="/checkout/result" element={<PageTransition><CheckoutResult /></PageTransition>} />
        <Route path="/about-us" element={<PageTransition><About /></PageTransition>} />
        <Route path="/about" element={<Navigate to="/about-us" replace />} />
        <Route path="/contact-us" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
        
        <Route path="/profile" element={<PageTransition><ProtectedRoute><ExternalProfile /></ProtectedRoute></PageTransition>} />
        <Route path="/orders/:id/pay" element={<PageTransition><ProtectedRoute><PayOrder /></ProtectedRoute></PageTransition>} />
        <Route path="/orders" element={<OrdersRedirect />} />
        <Route path="/orders/*" element={<OrdersWildcardRedirect />} />
        <Route path="/publish" element={<PageTransition><PublishBook /></PageTransition>} />
        <Route path="/publish-a-book" element={<PageTransition><PublishABook /></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/how-to-publish" element={<PageTransition><HowToPublish /></PageTransition>} />
        <Route path="/book-proposal-form" element={<PageTransition><SubmitProposal /></PageTransition>} />
        <Route path="/typesetting" element={<PageTransition><Typesetting /></PageTransition>} />
        <Route path="/pages/typesetting" element={<PageTransition><Typesetting /></PageTransition>} />
        <Route path="/typesetting-upload" element={<PageTransition><TypesettingUpload /></PageTransition>} />
        <Route path="/pages/typesetting-upload" element={<PageTransition><TypesettingUpload /></PageTransition>} />
        <Route path="/submit-proposal" element={<Navigate to="/book-proposal-form" replace />} />
        <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
        <Route path="/resources/post-publication" element={<RedirectPostPublication />} />
        <Route path="/post-publication" element={<PageTransition><ResourceDetail /></PageTransition>} />
        <Route path="/resources/proposal-and-publishing-forms" element={<Navigate to="/proposal-stage" replace />} />
        <Route path="/proposal-stage" element={<PageTransition><ResourceDetail /></PageTransition>} />
        <Route path="/resources/preparing-your-manuscript" element={<Navigate to="/manuscript-preparation" replace />} />
        <Route path="/manuscript-preparation" element={<PageTransition><ResourceDetail /></PageTransition>} />
        <Route path="/resources/:slug" element={<PageTransition><ResourceDetail /></PageTransition>} />
        <Route path="/reviewer-form" element={<PageTransition><EndorsementSubmission /></PageTransition>} />
        <Route path="/endorsement-submission" element={<Navigate to="/reviewer-form" replace />} />
        <Route path="/news" element={<PageTransition><News /></PageTransition>} />
        <Route path="/news/:slug" element={<PageTransition><NewsArticle /></PageTransition>} />
        <Route path="/pages/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/privacy" element={<Navigate to="/pages/privacy" replace />} />
        <Route path="/cookies" element={<PageTransition><CookiesPolicy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsAndConditions /></PageTransition>} />
        <Route path="/accessibility" element={<PageTransition><AccessibilityPolicy /></PageTransition>} />
        <Route path="/returns" element={<PageTransition><RefundAndReturns /></PageTransition>} />
        <Route path="/author-experiences" element={<PageTransition><AuthorExperiences /></PageTransition>} />
        <Route path="/our-author-promises" element={<PageTransition><AuthorPromises /></PageTransition>} />
        <Route path="/api-audit" element={<PageTransition><ApiAudit /></PageTransition>} />
        <Route path="/forthcoming" element={<PageTransition><Forthcoming /></PageTransition>} />
        <Route path="/series" element={<PageTransition><SeriesList /></PageTransition>} />
        <Route path="/series/:slug" element={<PageTransition><SeriesDetail /></PageTransition>} />
        <Route path="/ebooks" element={<PageTransition><ProtectedRoute><Ebooks /></ProtectedRoute></PageTransition>} />

        {/* CMS Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminGate><AdminLayout /></AdminGate>}>
          <Route index element={<AdminDashboard />} />
          <Route path="hero-slides" element={<AdminHeroSlides />} />
          <Route path="featured-books" element={<AdminFeaturedBooks />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="author-reviews" element={<AdminAuthorReviews />} />
          <Route path="faqs" element={<AdminFaqs />} />
          <Route path="resources" element={<AdminResources />} />
          <Route path="footer-documents" element={<AdminComingSoon title="Footer Documents" description="Backend ready (table + edge function actions). UI coming next." />} />
          <Route path="contact-submissions" element={<AdminContactMessages />} />
          <Route path="contact-submissions/:id" element={<AdminContactMessageDetail />} />
          <Route path="proposal-submissions" element={<AdminProposals />} />
          <Route path="proposal-submissions/:id" element={<AdminProposalDetail />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetail />} />
          <Route path="admins" element={<AdminAdmins />} />
        </Route>

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
