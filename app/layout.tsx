import type { Metadata } from 'next'
import './globals.css'
import { ClientLayout } from '@/components/layout/ClientLayout'

export const metadata: Metadata = {
  title: 'GS Sports Pune — Custom Football Kits & Sportswear',
  description: 'Premium custom football kits, jerseys, tracksuits and sportswear. Sublimation printing, name & number customization. Based in Pune.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}