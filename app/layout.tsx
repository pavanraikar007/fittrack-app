import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Import Poppins
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext"; // Import AuthProvider

// Configure Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Include the weights you need
});

export const metadata: Metadata = {
  title: "FitTrack - Modern Fitness App", // Updated title
  description: "Track workouts, calculate calories, and get AI coaching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply Poppins font class to the body */}
      <body className={`${poppins.className} bg-gray-50 flex flex-col min-h-screen`}>
        <AuthProvider> {/* Wrap with AuthProvider */}
          <Navbar />
          <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full"> {/* Ensure main takes full width within constraints */}
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
