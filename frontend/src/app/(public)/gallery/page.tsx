import type { Metadata } from 'next';
import GalleryPageClient from './GalleryPageClient';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Moments, snapshots, and behind-the-scenes.',
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
