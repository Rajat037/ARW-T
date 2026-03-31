import { Hero } from '../components/home/Hero';
import { TrustIndicators } from '../components/home/TrustIndicators';
import { Services } from '../components/home/Services';
import { HowItWorks } from '../components/home/HowItWorks';
import { Pricing } from '../components/home/Pricing';
import { Testimonials } from '../components/home/Testimonials';
import { CallToAction } from '../components/home/CallToAction';

export function Home() {
  return (
    <div className="font-sans antialiased text-gray-900 overflow-x-hidden">
      <Hero />
      <TrustIndicators />
      <Services />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CallToAction />
    </div>
  );
}