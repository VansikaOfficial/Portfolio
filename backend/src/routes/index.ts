import { Router } from 'express';

import authRoutes from './auth.routes';
import aboutRoutes from './about.routes';
import skillRoutes from './skill.routes';
import projectRoutes from './project.routes';
import educationRoutes from './education.routes';
import experienceRoutes from './experience.routes';
import internshipRoutes from './internship.routes';
import certificateRoutes from './certificate.routes';
import galleryRoutes from './gallery.routes';
import messageRoutes from './message.routes';
import blogRoutes from './blog.routes';
import testimonialRoutes from './testimonial.routes';
import settingRoutes from './setting.routes';
import socialLinkRoutes from './socialLink.routes';
import resumeRoutes from './resume.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Portfolio CMS API is healthy', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/about', aboutRoutes);
router.use('/skills', skillRoutes);
router.use('/projects', projectRoutes);
router.use('/education', educationRoutes);
router.use('/experience', experienceRoutes);
router.use('/internships', internshipRoutes);
router.use('/certificates', certificateRoutes);
router.use('/gallery', galleryRoutes);
router.use('/messages', messageRoutes);
router.use('/blogs', blogRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/settings', settingRoutes);
router.use('/social-links', socialLinkRoutes);
router.use('/resume', resumeRoutes);

export default router;
