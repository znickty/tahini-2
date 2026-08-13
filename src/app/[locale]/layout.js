import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "../globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params }) {
  const isArabic = params.locale === "ar";
  return {
    title: isArabic
      ? "بيت الطهينة - مطعم سعودي"
      : "Tahini House - Saudi Restaurant",
    description: isArabic
      ? "بيت الطهينة - أفضل المأكولات السعودية في جدة"
      : "Tahini House - Best Saudi cuisine in Jeddah",
  };
}

export default function RootLayout({ children, params }) {
  const isArabic = params.locale === "ar";

  return (
    <html lang={params.locale} dir={isArabic ? "rtl" : "ltr"}>
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header locale={params.locale} />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer locale={params.locale} />
          </div>
          <Toaster
            position={isArabic ? "top-left" : "top-right"}
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                style: {
                  background: "#22c55e",
                  color: "#fff",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#22c55e",
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: "#ef4444",
                  color: "#fff",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#ef4444",
                },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
