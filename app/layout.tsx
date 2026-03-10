import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "GS Sports Pune",
  description: "For the Love of Football — Jerseys, Cleats & Accessories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

return (
<html lang="en">
<body style={{
  margin:0,
  background:"var(--card)",
  fontFamily:"system-ui"
}}>

<CartProvider>

<Navbar />

{children}

</CartProvider>

</body>
</html>
);
}
