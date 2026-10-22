import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';

import { User } from '../entities/User';
import { About } from '../entities/About';
import { Skill } from '../entities/Skill';
import { Project } from '../entities/Project';
import { Education } from '../entities/Education';
import { Experience } from '../entities/Experience';
import { Internship } from '../entities/Internship';
import { Certificate } from '../entities/Certificate';
import { Gallery } from '../entities/Gallery';
import { Message } from '../entities/Message';
import { Blog } from '../entities/Blog';
import { Testimonial } from '../entities/Testimonial';
import { Setting } from '../entities/Setting';
import { SocialLink } from '../entities/SocialLink';
import { Resume } from '../entities/Resume';

const entities = [
  User,
  About,
  Skill,
  Project,
  Education,
  Experience,
  Internship,
  Certificate,
  Gallery,
  Message,
  Blog,
  Testimonial,
  Setting,
  SocialLink,
  Resume,
];

const useConnectionString = Boolean(env.DATABASE_URL);

export const AppDataSource = new DataSource(
  useConnectionString
    ? {
        type: 'postgres',
        url: env.DATABASE_URL,
        ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
        synchronize: false,
        logging: env.NODE_ENV === 'development' ? ['error', 'warn'] : false,
        entities,
        migrations: [__dirname + '/../migrations/*.{ts,js}'],
        migrationsTableName: 'migrations',
      }
    : {
        type: 'postgres',
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        ssl: env.DB_SSL ? { rejectUnauthorized: false } : false,
        synchronize: false,
        logging: env.NODE_ENV === 'development' ? ['error', 'warn'] : false,
        entities,
        migrations: [__dirname + '/../migrations/*.{ts,js}'],
        migrationsTableName: 'migrations',
      }
);
