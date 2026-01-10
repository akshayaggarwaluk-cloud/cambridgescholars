import { ReactNode } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";

import Index from "@/pages/Index";
import Books from "@/pages/Books";
import BookDetails from "@/pages/BookDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import PublishBook from "@/pages/PublishBook";
import PublishABook from "@/pages/PublishABook";
import Wishlist from "@/pages/Wishlist";
import FAQ from "@/pages/FAQ";
import HowToPublish from "@/pages/HowToPublish";
import SubmitProposal from "@/pages/SubmitProposal";
import Resources from "@/pages/Resources";
import ProposalAndPublishingForms from "@/pages/resources/ProposalAndPublishingForms";
import PreparingYourManuscript from "@/pages/resources/PreparingYourManuscript";
import PreparingYourBookCover from "@/pages/resources/PreparingYourBookCover";
import PostPublication from "@/pages/resources/PostPublication";
import EndorsementSubmission from "@/pages/EndorsementSubmission";
import News from "@/pages/News";
import NewsArticle from "@/pages/NewsArticle";
import NotFound from "@/pages/NotFound";

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/books" element={<PageTransition><Books /></PageTransition>} />
        <Route path="/books/:id" element={<PageTransition><BookDetails /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/orders" element={<PageTransition><Orders /></PageTransition>} />
        <Route path="/publish" element={<PageTransition><PublishBook /></PageTransition>} />
        <Route path="/publish-a-book" element={<PageTransition><PublishABook /></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/how-to-publish" element={<PageTransition><HowToPublish /></PageTransition>} />
        <Route path="/submit-proposal" element={<PageTransition><SubmitProposal /></PageTransition>} />
        <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
        <Route path="/resources/proposal-and-publishing-forms" element={<PageTransition><ProposalAndPublishingForms /></PageTransition>} />
        <Route path="/resources/preparing-your-manuscript" element={<PageTransition><PreparingYourManuscript /></PageTransition>} />
        <Route path="/resources/preparing-your-book-cover" element={<PageTransition><PreparingYourBookCover /></PageTransition>} />
        <Route path="/resources/post-publication" element={<PageTransition><PostPublication /></PageTransition>} />
        <Route path="/endorsement-submission" element={<PageTransition><EndorsementSubmission /></PageTransition>} />
        <Route path="/news" element={<PageTransition><News /></PageTransition>} />
        <Route path="/news/:slug" element={<PageTransition><NewsArticle /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}