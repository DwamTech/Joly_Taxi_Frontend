import { Metadata } from 'next';
import Navbar from '@/components/landing/Navbar/Navbar';
import Hero from '@/components/landing/Hero/Hero';
import Features from '@/components/landing/Features/Features';
import Vehicles from '@/components/landing/Vehicles/Vehicles';
import HowItWorks from '@/components/landing/HowItWorks/HowItWorks';
import Footer from '@/components/landing/Footer/Footer';

// Metadata for SEO optimization (Server Component feature)
export const metadata: Metadata = {
  title: 'مشوار مصر - تطبيق النقل الذكي',
  description: 'تطبيق النقل الذكي الذي يتيح لك التفاوض على سعر رحلتك. اختر سيارتك، حدد وجهتك، وانطلق بأمان وبأفضل الأسعار.',
  keywords: ['مشوار مصر', 'تطبيق نقل', 'تاكسي', 'توصيل', 'مصر'],
  openGraph: {
    title: 'مشوار مصر - تطبيق النقل الذكي',
    description: 'تطبيق النقل الذكي الذي يتيح لك التفاوض على سعر رحلتك',
    type: 'website',
  },
};

/**
 * Landing Page Component
 * 
 * This is a Server Component that serves as the root route (/) of the application.
 * It integrates all landing page components (Navbar, Hero, Features, Vehicles, HowItWorks, Footer).
 * 
 * Performance optimizations:
 * - Server Component by default (no 'use client' directive)
 * - Child components use client-side features where needed (animations, interactivity)
 * - Next.js automatically handles code splitting for client components
 * - Images are optimized using Next.js Image component
 * 
 * Requirements: 1.2, 8.5, 8.7
 */
export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Vehicles />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
