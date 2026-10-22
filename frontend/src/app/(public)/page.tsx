import Hero from '@/components/home/Hero';
import AboutPreview from '@/components/home/AboutPreview';
import SkillsPreview from '@/components/home/SkillsPreview';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import TestimonialsPreview from '@/components/home/TestimonialsPreview';
import ContactCTA from '@/components/home/ContactCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <SkillsPreview />
      <FeaturedProjects />
      <TestimonialsPreview />
      <ContactCTA />
    </>
  );
}
