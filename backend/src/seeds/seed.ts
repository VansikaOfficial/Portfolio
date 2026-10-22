import 'reflect-metadata';
import bcrypt from 'bcrypt';
import { AppDataSource } from '@config/data-source';
import { env } from '@config/env';
import logger from '@config/logger';

import { User, UserRole } from '@entities/User';
import { About } from '@entities/About';
import { Skill, SkillCategory } from '@entities/Skill';
import { Project, ProjectStatus } from '@entities/Project';
import { Education } from '@entities/Education';
import { Experience } from '@entities/Experience';
import { Certificate } from '@entities/Certificate';
import { SocialLink } from '@entities/SocialLink';
import { Setting } from '@entities/Setting';
import { Resume } from '@entities/Resume';

const run = async () => {
  await AppDataSource.initialize();
  logger.info('📦 Connected to database. Seeding...');

  // ── Admin user (only one) ────────────────────────────────
  const userRepo = AppDataSource.getRepository(User);
  const existingAdmin = await userRepo.findOne({ where: { email: env.ADMIN_EMAIL } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
    await userRepo.save(
      userRepo.create({
        name: env.ADMIN_NAME,
        email: env.ADMIN_EMAIL,
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
      })
    );
    logger.info(`✅ Admin user created: ${env.ADMIN_EMAIL}`);
  } else {
    logger.info('ℹ️  Admin user already exists, skipping.');
  }

  // ── About (singleton) ─────────────────────────────────────
  const aboutRepo = AppDataSource.getRepository(About);
  const existingAbout = await aboutRepo.findOne({ where: {} });
  if (!existingAbout) {
    await aboutRepo.save(
      aboutRepo.create({
        fullName: env.ADMIN_NAME,
        tagline: 'Turning data into decisions.',
        roles: ['Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'AI Engineer'],
        biography:
          'Passionate about extracting insights from data and building intelligent systems that solve real-world problems. Experienced across the full data lifecycle — from cleaning and analysis to deploying machine learning models in production.',
        careerObjective:
          'To leverage my skills in data science and machine learning to build impactful, scalable solutions and contribute to data-driven decision-making.',
        location: 'Remote / Worldwide',
        email: env.ADMIN_EMAIL,
        phone: '+1 000 000 0000',
        availableForWork: true,
        currentStatus: 'Open to opportunities',
        languages: ['English', 'Hindi'],
        interests: ['Machine Learning', 'Data Visualization', 'Open Source', 'Chess'],
      })
    );
    logger.info('✅ About section seeded');
  } else {
    logger.info('ℹ️  About section already exists, skipping.');
  }

  // ── Settings (singleton) ──────────────────────────────────
  const settingRepo = AppDataSource.getRepository(Setting);
  const existingSetting = await settingRepo.findOne({ where: {} });
  if (!existingSetting) {
    await settingRepo.save(
      settingRepo.create({
        siteTitle: `${env.ADMIN_NAME} | Portfolio`,
        siteDescription: 'Data Analyst | Data Scientist | Machine Learning Engineer | AI Engineer',
        defaultTheme: 'system',
        primaryColor: '#6366F1',
        metaTitle: `${env.ADMIN_NAME} | Portfolio`,
        metaDescription: 'Professional portfolio showcasing projects, skills, and experience.',
        metaKeywords: ['portfolio', 'data analyst', 'data scientist', 'machine learning', 'ai engineer'],
        maintenanceMode: false,
      })
    );
    logger.info('✅ Settings seeded');
  } else {
    logger.info('ℹ️  Settings already exist, skipping.');
  }

  // ── Resume (singleton placeholder) ────────────────────────
  const resumeRepo = AppDataSource.getRepository(Resume);
  const existingResume = await resumeRepo.findOne({ where: {} });
  if (!existingResume) {
    await resumeRepo.save(resumeRepo.create());
    logger.info('✅ Resume placeholder seeded');
  }

  // ── Social links ───────────────────────────────────────────
  const socialRepo = AppDataSource.getRepository(SocialLink);
  const socialCount = await socialRepo.count();
  if (socialCount === 0) {
    const links: Partial<SocialLink>[] = [
      { platform: 'github', url: 'https://github.com/', icon: 'FaGithub', displayOrder: 1 },
      { platform: 'linkedin', url: 'https://linkedin.com/', icon: 'FaLinkedin', displayOrder: 2 },
      { platform: 'twitter', url: 'https://twitter.com/', icon: 'FaTwitter', displayOrder: 3 },
      { platform: 'kaggle', url: 'https://kaggle.com/', icon: 'SiKaggle', displayOrder: 4 },
    ];
    await socialRepo.save(links.map((l) => socialRepo.create(l)));
    logger.info('✅ Social links seeded');
  } else {
    logger.info('ℹ️  Social links already exist, skipping.');
  }

  // ── Sample skills ──────────────────────────────────────────
  const skillRepo = AppDataSource.getRepository(Skill);
  const skillCount = await skillRepo.count();
  if (skillCount === 0) {
    const skills: Partial<Skill>[] = [
      { name: 'Python', percentage: 95, level: 'Expert', category: SkillCategory.PROGRAMMING, icon: 'SiPython', color: '#3776AB', displayOrder: 1 },
      { name: 'SQL', percentage: 90, level: 'Expert', category: SkillCategory.DATABASES, icon: 'SiPostgresql', color: '#4169E1', displayOrder: 2 },
      { name: 'TensorFlow', percentage: 85, level: 'Advanced', category: SkillCategory.DEEP_LEARNING, icon: 'SiTensorflow', color: '#FF6F00', displayOrder: 3 },
      { name: 'Scikit-learn', percentage: 88, level: 'Advanced', category: SkillCategory.MACHINE_LEARNING, icon: 'SiScikitlearn', color: '#F7931E', displayOrder: 4 },
      { name: 'Power BI', percentage: 80, level: 'Advanced', category: SkillCategory.VISUALIZATION, icon: 'SiPowerbi', color: '#F2C811', displayOrder: 5 },
      { name: 'AWS', percentage: 75, level: 'Intermediate', category: SkillCategory.CLOUD, icon: 'SiAmazonaws', color: '#FF9900', displayOrder: 6 },
      { name: 'Docker', percentage: 70, level: 'Intermediate', category: SkillCategory.TOOLS, icon: 'SiDocker', color: '#2496ED', displayOrder: 7 },
      { name: 'React', percentage: 78, level: 'Advanced', category: SkillCategory.FRAMEWORKS, icon: 'SiReact', color: '#61DAFB', displayOrder: 8 },
      { name: 'Communication', percentage: 90, level: 'Expert', category: SkillCategory.SOFT_SKILLS, icon: 'FaComments', color: '#10B981', displayOrder: 9 },
    ];
    await skillRepo.save(skills.map((s) => skillRepo.create(s)));
    logger.info('✅ Sample skills seeded');
  } else {
    logger.info('ℹ️  Skills already exist, skipping.');
  }

  // ── Sample projects ─────────────────────────────────────────
  const projectRepo = AppDataSource.getRepository(Project);
  const projectCount = await projectRepo.count();
  if (projectCount === 0) {
    const projects: Partial<Project>[] = [
      {
        title: 'Customer Churn Prediction',
        slug: 'customer-churn-prediction',
        description: 'An end-to-end ML pipeline predicting customer churn using ensemble models.',
        longDescription:
          'Built a complete machine learning pipeline covering data cleaning, feature engineering, model training with XGBoost and Random Forest, hyperparameter tuning, and deployment via a Flask API. Achieved 92% accuracy on the held-out test set.',
        techStack: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'Flask'],
        githubLink: 'https://github.com/',
        liveDemoLink: '',
        status: ProjectStatus.COMPLETED,
        featured: true,
        displayOrder: 1,
      },
      {
        title: 'Real-Time Sales Dashboard',
        slug: 'real-time-sales-dashboard',
        description: 'Interactive Power BI dashboard visualizing sales KPIs across regions.',
        longDescription:
          'Designed and deployed an interactive dashboard for a retail dataset, featuring drill-down analysis, region-wise performance tracking, and automated daily refreshes from a PostgreSQL data warehouse.',
        techStack: ['Power BI', 'SQL', 'Python', 'ETL'],
        githubLink: 'https://github.com/',
        liveDemoLink: '',
        status: ProjectStatus.COMPLETED,
        featured: true,
        displayOrder: 2,
      },
      {
        title: 'Image Classification with CNN',
        slug: 'image-classification-cnn',
        description: 'Deep learning model classifying images across 10 categories using CNNs.',
        longDescription:
          'Trained a convolutional neural network from scratch using TensorFlow/Keras on an image dataset, applying data augmentation and transfer learning (ResNet50) to boost validation accuracy to 94%.',
        techStack: ['TensorFlow', 'Keras', 'Python', 'OpenCV'],
        githubLink: 'https://github.com/',
        liveDemoLink: '',
        status: ProjectStatus.COMPLETED,
        featured: false,
        displayOrder: 3,
      },
    ];
    await projectRepo.save(projects.map((p) => projectRepo.create(p)));
    logger.info('✅ Sample projects seeded');
  } else {
    logger.info('ℹ️  Projects already exist, skipping.');
  }

  // ── Sample education ────────────────────────────────────────
  const educationRepo = AppDataSource.getRepository(Education);
  const educationCount = await educationRepo.count();
  if (educationCount === 0) {
    const education: Partial<Education>[] = [
      {
        institution: 'State University',
        degree: 'B.Tech in Computer Science',
        fieldOfStudy: 'Computer Science & Engineering',
        cgpa: '8.7',
        startYear: '2021',
        endYear: '2025',
        description: 'Focused on data structures, algorithms, machine learning, and databases.',
        displayOrder: 1,
      },
      {
        institution: 'Central High School',
        degree: 'Higher Secondary (PCM)',
        percentage: '92%',
        startYear: '2019',
        endYear: '2021',
        displayOrder: 2,
      },
    ];
    await educationRepo.save(education.map((e) => educationRepo.create(e)));
    logger.info('✅ Sample education seeded');
  } else {
    logger.info('ℹ️  Education already exists, skipping.');
  }

  // ── Sample experience ────────────────────────────────────────
  const experienceRepo = AppDataSource.getRepository(Experience);
  const experienceCount = await experienceRepo.count();
  if (experienceCount === 0) {
    const experience: Partial<Experience>[] = [
      {
        company: 'DataWorks Analytics',
        role: 'Data Analyst',
        startDate: '2025-06-01',
        endDate: null,
        isCurrent: true,
        location: 'Remote',
        responsibilities: [
          'Built automated ETL pipelines processing 1M+ records daily',
          'Designed dashboards used by 5+ business teams',
          'Partnered with stakeholders to define key business metrics',
        ],
        skillsUsed: ['Python', 'SQL', 'Power BI', 'Airflow'],
        displayOrder: 1,
      },
    ];
    await experienceRepo.save(experience.map((e) => experienceRepo.create(e)));
    logger.info('✅ Sample experience seeded');
  } else {
    logger.info('ℹ️  Experience already exists, skipping.');
  }

  // ── Sample certificates ──────────────────────────────────────
  // Note: certificates require an image; seeded with a placeholder path.
  // Replace via the admin dashboard after first login.
  const certificateRepo = AppDataSource.getRepository(Certificate);
  const certificateCount = await certificateRepo.count();
  if (certificateCount === 0) {
    const certificates: Partial<Certificate>[] = [
      {
        title: 'Machine Learning Specialization',
        issuer: 'DeepLearning.AI',
        image: '/uploads/placeholder-certificate.svg',
        displayOrder: 1,
      },
      {
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        image: '/uploads/placeholder-certificate.svg',
        displayOrder: 2,
      },
    ];
    await certificateRepo.save(certificates.map((c) => certificateRepo.create(c)));
    logger.info('✅ Sample certificates seeded (replace placeholder images via admin dashboard)');
  } else {
    logger.info('ℹ️  Certificates already exist, skipping.');
  }

  logger.info('🎉 Seeding complete!');
  await AppDataSource.destroy();
  process.exit(0);
};

run().catch(async (err) => {
  logger.error(`❌ Seeding failed: ${err.message}`, { stack: err.stack });
  try {
    await AppDataSource.destroy();
  } catch {
    /* noop */
  }
  process.exit(1);
});
