// pages/_app.js
import Navbar from "../components/Navbar";  // Import the Navbar component
import "../styles/globals.css";  // TailwindCSS or global styles

function MyApp({ Component, pageProps }) {
  return (
    <div>
      {/* Include the Navbar here so it will appear on every page */}
      <Navbar />
      {/* Your main component (e.g., Register, Login, etc.) */}
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
