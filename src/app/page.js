// Remove Navbar import from here
import AiDermatologistCards from '../components/AiDermatologistCards';
import HeroSection from '../components/HeroSection';
import SkinAnalysisUpload from '../components/SkinAnalysisUpload';
import FAQSection from '../components/FAQ';
// import FeedbackForm from '../components/feedback';
import Footer from '../components/Footer';

export default function Page() {
  return (
    <div>
      {/* No need to include Navbar here */}
      <HeroSection />
      <SkinAnalysisUpload />
      <AiDermatologistCards />
      <FAQSection />
      <Footer />
    </div>
  );
}
