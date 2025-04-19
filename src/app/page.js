import Footer from '../components/Footer';
import AiDermatologistCards from '../components/AiDermatologistCards';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';  // Relative path should be correct
import SkinAnalysisUpload from '../components/SkinAnalysisUpload';
import FAQSection from '../components/FAQ';
//import FeedbackForm from '../components/feedback';

export default function Page() {
  return (
    <div>
      <Navbar />
      <HeroSection/>
      <SkinAnalysisUpload/>
      <AiDermatologistCards/>
      <FAQSection/>
      <Footer/>
    </div>
  );
}
