import { ReactNode } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import ProtectedRoute from "./ProtectedRoute";

import Index from "@/pages/Index";
import Books from "@/pages/Books";
import BookDetails from "@/pages/BookDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Checkout3dsReturn from "@/pages/Checkout3dsReturn";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Auth from "@/pages/Auth";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

import ExternalProfile from "@/pages/ExternalProfile";
import Orders from "@/pages/Orders";
import PublishBook from "@/pages/PublishBook";
import PublishABook from "@/pages/PublishABook";
import Wishlist from "@/pages/Wishlist";
import FAQ from "@/pages/FAQ";
import HowToPublish from "@/pages/HowToPublish";
import SubmitProposal from "@/pages/SubmitProposal";
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
import AdminCoupons from "@/pages/admin/AdminCoupons";

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/books" element={<PageTransition><Books /></PageTransition>} />
        <Route path="/books/:id" element={<PageTransition><BookDetails /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><ProtectedRoute><Checkout /></ProtectedRoute></PageTransition>} />
        <Route path="/checkout/3ds-return" element={<PageTransition><ProtectedRoute><Checkout3dsReturn /></ProtectedRoute></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
        
        <Route path="/profile" element={<PageTransition><ProtectedRoute><ExternalProfile /></ProtectedRoute></PageTransition>} />
        <Route path="/orders" element={<PageTransition><ProtectedRoute><Orders /></ProtectedRoute></PageTransition>} />
        <Route path="/publish" element={<PageTransition><PublishBook /></PageTransition>} />
        <Route path="/publish-a-book" element={<PageTransition><PublishABook /></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><ProtectedRoute><Wishlist /></ProtectedRoute></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/how-to-publish" element={<PageTransition><HowToPublish /></PageTransition>} />
        <Route path="/submit-proposal" element={<PageTransition><SubmitProposal /></PageTransition>} />
        <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
        <Route path="/resources/:slug" element={<PageTransition><ResourceDetail /></PageTransition>} />
        <Route path="/endorsement-submission" element={<PageTransition><EndorsementSubmission /></PageTransition>} />
        <Route path="/news" element={<PageTransition><News /></PageTransition>} />
        <Route path="/news/:slug" element={<PageTransition><NewsArticle /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/cookies" element={<PageTransition><CookiesPolicy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsAndConditions /></PageTransition>} />
        <Route path="/accessibility" element={<PageTransition><AccessibilityPolicy /></PageTransition>} />
        <Route path="/returns" element={<PageTransition><RefundAndReturns /></PageTransition>} />
        <Route path="/author-experiences" element={<PageTransition><AuthorExperiences /></PageTransition>} />
        <Route path="/our-author-promises" element={<PageTransition><AuthorPromises /></PageTransition>} />
        <Route path="/api-audit" element={<PageTransition><ApiAudit /></PageTransition>} />

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
          <Route path="contact-submissions" element={<AdminComingSoon title="Contact Submissions" description="Backend ready. Inbox UI coming next." />} />
          <Route path="proposal-submissions" element={<AdminComingSoon title="Proposal Submissions" description="Backend ready. Inbox UI coming next." />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="users" element={<AdminComingSoon title="Users" description="Backend ready (Lovable Cloud auth users + CSP password-reset stub). UI coming next." />} />
          <Route path="admins" element={<AdminAdmins />} />
        </Route>

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}