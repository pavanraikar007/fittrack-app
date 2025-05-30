// components/layout/Footer.tsx
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    // Adjusted classes to match general theme (bg-gray-50 from body, text-gray-600 for footer text)
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto"> {/* Or use bg-gray-50 if preferred */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-500">&copy; {currentYear} FitTrack. All rights reserved.</p>
        <p className="text-xs text-gray-400 mt-1">
          Your Fitness App
        </p>
      </div>
    </footer>
  );
};

export default Footer; 