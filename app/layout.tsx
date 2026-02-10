import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ClientGuards from "@/components/ClientGuards"
import { CartProvider } from "@/context/CartContext"

export const metadata = {
  title: "Piyush Bholla",
  description: "Fashion & Design",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <ClientGuards />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}