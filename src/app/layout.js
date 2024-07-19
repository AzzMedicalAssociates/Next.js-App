import "./globals.css";
import { StoreProvider } from "@/Redux/StoreProvider";
import { Roboto } from "next/font/google";
import Footer from "@/components/footer";
import Header from "@/components/header";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title:
    "Primary Care Providers in New Jersey and Taxas | Specialized Care Providers",
  description:
    "AZZ Medical Associates has a team of highly skilled and experienced primary care providers, with 6+ clinic locations in NJ and Texas, USA.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <StoreProvider>
          <Header />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
