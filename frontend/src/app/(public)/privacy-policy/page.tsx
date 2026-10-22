import type { Metadata } from 'next';
import { Typography, Stack } from '@mui/material';
import Section from '@/components/shared/Section';
import PageHeader from '@/components/shared/PageHeader';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How this site collects, uses, and protects your information.',
};

const sections = [
  {
    title: 'Information we collect',
    body: 'When you submit the contact form, we collect the name, email address, subject, and message you provide, along with your IP address for spam-prevention purposes. We do not use tracking cookies beyond what is required for basic site functionality.',
  },
  {
    title: 'How we use your information',
    body: 'Contact form submissions are used solely to respond to your inquiry. We do not sell, rent, or share your personal information with third parties for marketing purposes.',
  },
  {
    title: 'Data retention',
    body: 'Messages submitted through the contact form are retained until manually deleted by the site owner via the admin dashboard.',
  },
  {
    title: 'Cookies & analytics',
    body: 'If enabled, this site may use privacy-respecting analytics (e.g. Google Analytics) to understand aggregate visitor behavior. No personally identifiable information is collected through analytics.',
  },
  {
    title: 'Your rights',
    body: 'You may request that any message you submitted be deleted at any time by contacting the site owner directly via the email address listed on the Contact page.',
  },
  {
    title: 'Changes to this policy',
    body: 'This policy may be updated periodically. Continued use of the site after changes constitutes acceptance of the revised policy.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader eyebrow="> cat privacy-policy.txt" title="Privacy Policy" description="Last updated: August 2026" />
      <Section>
        <Stack spacing={4} sx={{ maxWidth: 760 }}>
          {sections.map((s) => (
            <div key={s.title}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {s.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.85 }}>
                {s.body}
              </Typography>
            </div>
          ))}
        </Stack>
      </Section>
    </>
  );
}
