import { Hero } from './Home/components/Hero';
import { TrustIndicators } from './Home/components/TrustIndicators';
import { Services } from './Home/components/Services';
import { HowItWorks } from './Home/components/HowItWorks';
import { Pricing } from './Home/components/Pricing';
import { Testimonials } from './Home/components/Testimonials';
import { CallToAction } from './Home/components/CallToAction';

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