import { BrowserRouter as Router, Routes, Route } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import BlogTable from "./pages/Blog/BlogTable";
import ResetPasswordPage from "./pages/AuthPages/ResetPasswordPage";
import ForgetPasswordPage from "./pages/AuthPages/ForgetPasswordPage";
import OtpPage from "./pages/AuthPages/OtpPage";
import BlogCatogery from "./pages/Blog/BlogCatogery";
import AddCatogery from "./pages/Blog/AddCatogery";
import AddBlog from "./pages/Blog/AddBlog";
import EditCategory from "./pages/Blog/EditCategory";
import EditBlog from "./pages/Blog/EditBlog";

import SeoBlog from "./pages/Blog/SeoBlog";

import AddTestimonial from "./pages/Testimonial/AddTestimonial";
import ListTestimonial from "./pages/Testimonial/Testimonial";
import EditTestimonial from "./pages/Testimonial/EditTestimonial";

import AddClientele from "./pages/Clientele/AddClientele";
import ClienteleList from "./pages/Clientele/ClienteleList";
import EditClientele from "./pages/Clientele/EditClientele";

import AddLeadershipTeam from "./pages/Team/AddLeadershipTeam";
import LeadershipTeamList from "./pages/Team/LeadershipTeamList";
import EditLeadershipTeam from "./pages/Team/EditLeadershipTeam";

import AddCoreTeam from "./pages/Team/AddCoreTeam";
import CoreTeamList from "./pages/Team/CoreTeamList";
import EditCoreTeam from "./pages/Team/EditCoreTeam";

import AddMediaCoverage from "./pages/Media/AddMediaCoverage";
import EditMediaCoverage from "./pages/Media/EditMediaCoverage";
import MediaCoverageList from "./pages/Media/MediaCoverageList";


import AddLocation from "./pages/Location/AddLocation";
import EditLocation from "./pages/Location/EditLocation";
import LocationList from "./pages/Location/LocationList";

import AddLocationMain from "./pages/Location/AddLocationMain";
import EditLocationMain from "./pages/Location/EditLocationMain";
import LocationMainList from "./pages/Location/LocationMainList";





import AddArticle from "./pages/Articles/AddArticle";
import EditArticle from "./pages/Articles/EditArticle";
import ArticleList from "./pages/Articles/ArticleList";



import Contact from "./pages/List/contact";
import Career from "./pages/List/career";

import AuthGuard from "./components/AuthGuard";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route
            element={
              <AuthGuard>
                <AppLayout />
              </AuthGuard>
            }
          >
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/add-blog-catogery" element={<AddCatogery />} />
            <Route path="/add-blog" element={<AddBlog />} />
            <Route path="/blog-catogery" element={<BlogCatogery />} />
            <Route path="/blog" element={<BlogTable />} />
            <Route path="/add-Testimonial" element={<AddTestimonial />} />

            <Route path="/list-Testimonial" element={<ListTestimonial />} />
            <Route path="/edit-testimonial/:id" element={<EditTestimonial />} />

            <Route path="/add-clientele" element={<AddClientele />} />

            <Route path="/list-clientele" element={<ClienteleList />} />
            <Route path="/edit-clientele/:id" element={<EditClientele />} />
 <Route path="/add-article" element={<AddArticle />} />

            <Route path="/list-article" element={<ArticleList />} />
            <Route path="/edit-article/:id" element={<EditArticle />} />


            <Route path="/add-leadershipteam" element={<AddLeadershipTeam />} />

            <Route
              path="/list-leadershipteam"
              element={<LeadershipTeamList />}
            />
            <Route
              path="/edit-leadership-team/:id"
              element={<EditLeadershipTeam />}
            />

            <Route path="/add-coreteam" element={<AddCoreTeam />} />

            <Route path="/list-coreteam" element={<CoreTeamList />} />
            <Route path="/edit-core-team/:id" element={<EditCoreTeam />} />

            <Route path="/add-mediacoverage" element={<AddMediaCoverage />} />

            <Route path="/list-mediacoverage" element={<MediaCoverageList />} />
            <Route
              path="/edit-media-coverage/:id"
              element={<EditMediaCoverage />}
            />

 <Route path="/add-locationmaster" element={<AddLocation />} />

            <Route path="/list-locationmaster" element={<LocationList />} />
            <Route
              path="/edit-locationmaster/:id"
              element={<EditLocation />}
            />
 <Route path="/add-location" element={<AddLocationMain />} />

            <Route path="/list-location" element={<LocationMainList />} />
            <Route
              path="/edit-location/:id"
              element={<EditLocationMain />}
            />
            <Route path="/edit-category/:id" element={<EditCategory />} />
            <Route path="/edit-blog/:id" element={<EditBlog />} />
            <Route path="/seo/:id" element={<SeoBlog />} />

            <Route path="/contact-list" element={<Contact />} />
            <Route path="/career-list" element={<Career />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/otp" element={<OtpPage />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer
        className="z-100"
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
}
