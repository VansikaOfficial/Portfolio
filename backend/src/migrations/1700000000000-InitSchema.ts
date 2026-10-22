import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Extensions ──────────────────────────────────────────
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // ── Enums ───────────────────────────────────────────────
    await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM ('admin')`);
    await queryRunner.query(
      `CREATE TYPE "skills_category_enum" AS ENUM (
        'Programming', 'Databases', 'Machine Learning', 'Deep Learning',
        'Visualization', 'Cloud', 'Tools', 'Frameworks', 'Soft Skills'
      )`
    );
    await queryRunner.query(
      `CREATE TYPE "projects_status_enum" AS ENUM ('in_progress', 'completed', 'archived')`
    );

    // ── users ───────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(150) NOT NULL,
        "email" varchar(150) NOT NULL,
        "password" varchar NOT NULL,
        "role" "users_role_enum" NOT NULL DEFAULT 'admin',
        "refreshToken" varchar,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    // ── about (singleton) ─────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "about" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "fullName" varchar(150) NOT NULL DEFAULT '',
        "tagline" varchar(200) NOT NULL DEFAULT '',
        "roles" text NOT NULL DEFAULT '',
        "biography" text NOT NULL DEFAULT '',
        "careerObjective" text NOT NULL DEFAULT '',
        "location" varchar(150),
        "email" varchar(100),
        "phone" varchar(50),
        "availableForWork" boolean NOT NULL DEFAULT true,
        "currentStatus" varchar(100) NOT NULL DEFAULT 'Open to opportunities',
        "languages" text NOT NULL DEFAULT '',
        "interests" text NOT NULL DEFAULT '',
        "profilePhoto" varchar,
        "bannerImage" varchar,
        "updatedAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // ── skills ──────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "skills" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(100) NOT NULL,
        "percentage" integer NOT NULL DEFAULT 50,
        "level" varchar(50),
        "category" "skills_category_enum" NOT NULL DEFAULT 'Tools',
        "icon" varchar(100),
        "color" varchar(20),
        "displayOrder" integer NOT NULL DEFAULT 0,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // ── projects ────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar(200) NOT NULL,
        "slug" varchar(250) NOT NULL,
        "description" text NOT NULL,
        "longDescription" text,
        "techStack" text NOT NULL DEFAULT '',
        "githubLink" varchar,
        "liveDemoLink" varchar,
        "thumbnail" varchar,
        "images" text NOT NULL DEFAULT '',
        "status" "projects_status_enum" NOT NULL DEFAULT 'completed',
        "featured" boolean NOT NULL DEFAULT false,
        "displayOrder" integer NOT NULL DEFAULT 0,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_projects_slug" UNIQUE ("slug")
      )
    `);

    // ── education ───────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "education" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "institution" varchar(200) NOT NULL,
        "degree" varchar(100) NOT NULL,
        "fieldOfStudy" varchar(100),
        "cgpa" varchar(20),
        "percentage" varchar(20),
        "startYear" varchar(50) NOT NULL,
        "endYear" varchar(50),
        "description" text,
        "displayOrder" integer NOT NULL DEFAULT 0,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // ── experience ──────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "experience" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "company" varchar(200) NOT NULL,
        "role" varchar(150) NOT NULL,
        "startDate" date NOT NULL,
        "endDate" date,
        "isCurrent" boolean NOT NULL DEFAULT false,
        "location" varchar(150),
        "responsibilities" text NOT NULL DEFAULT '',
        "skillsUsed" text NOT NULL DEFAULT '',
        "displayOrder" integer NOT NULL DEFAULT 0,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // ── internships ─────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "internships" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "company" varchar(200) NOT NULL,
        "role" varchar(150) NOT NULL,
        "duration" varchar(100) NOT NULL,
        "description" text,
        "skillsUsed" text NOT NULL DEFAULT '',
        "certificateImage" varchar,
        "displayOrder" integer NOT NULL DEFAULT 0,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // ── certificates ────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "certificates" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar(200) NOT NULL,
        "issuer" varchar(150),
        "issueDate" date,
        "credentialUrl" varchar,
        "image" varchar NOT NULL,
        "displayOrder" integer NOT NULL DEFAULT 0,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // ── gallery ─────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "gallery" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar(200),
        "caption" varchar(250),
        "image" varchar NOT NULL,
        "displayOrder" integer NOT NULL DEFAULT 0,
        "createdAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // ── messages ────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(150) NOT NULL,
        "email" varchar(150) NOT NULL,
        "subject" varchar(200),
        "message" text NOT NULL,
        "isRead" boolean NOT NULL DEFAULT false,
        "ipAddress" varchar,
        "createdAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // ── blogs ───────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "blogs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar(250) NOT NULL,
        "slug" varchar(300) NOT NULL,
        "excerpt" text NOT NULL,
        "content" text NOT NULL,
        "coverImage" varchar,
        "tags" text NOT NULL DEFAULT '',
        "published" boolean NOT NULL DEFAULT false,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_blogs_slug" UNIQUE ("slug")
      )
    `);

    // ── testimonials ────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "testimonials" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(150) NOT NULL,
        "designation" varchar(150),
        "company" varchar(150),
        "message" text NOT NULL,
        "avatar" varchar,
        "rating" integer NOT NULL DEFAULT 5,
        "isApproved" boolean NOT NULL DEFAULT true,
        "displayOrder" integer NOT NULL DEFAULT 0,
        "createdAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // ── settings (singleton) ──────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "settings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "siteTitle" varchar(150) NOT NULL DEFAULT 'My Portfolio',
        "siteDescription" varchar(300),
        "favicon" varchar,
        "defaultTheme" varchar(20) NOT NULL DEFAULT 'system',
        "primaryColor" varchar(20),
        "metaTitle" varchar(200),
        "metaDescription" varchar(300),
        "metaKeywords" text NOT NULL DEFAULT '',
        "ogImage" varchar,
        "googleAnalyticsId" varchar,
        "maintenanceMode" boolean NOT NULL DEFAULT false,
        "updatedAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // ── social_links ────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "social_links" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "platform" varchar(50) NOT NULL,
        "url" varchar NOT NULL,
        "icon" varchar(100),
        "isVisible" boolean NOT NULL DEFAULT true,
        "displayOrder" integer NOT NULL DEFAULT 0,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // ── resume (singleton) ────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "resume" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "filePath" varchar,
        "originalName" varchar(200),
        "version" varchar(20),
        "updatedAt" timestamp NOT NULL DEFAULT now()
      )
    `);

    // ── Helpful indexes ───────────────────────────────────────
    await queryRunner.query(`CREATE INDEX "IDX_skills_category" ON "skills" ("category")`);
    await queryRunner.query(`CREATE INDEX "IDX_projects_featured" ON "projects" ("featured")`);
    await queryRunner.query(`CREATE INDEX "IDX_projects_status" ON "projects" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_messages_isRead" ON "messages" ("isRead")`);
    await queryRunner.query(`CREATE INDEX "IDX_blogs_published" ON "blogs" ("published")`);
    await queryRunner.query(`CREATE INDEX "IDX_testimonials_isApproved" ON "testimonials" ("isApproved")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "resume"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "social_links"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "settings"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "testimonials"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "blogs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "messages"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "gallery"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "certificates"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "internships"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "experience"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "education"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "projects"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "skills"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "about"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);

    await queryRunner.query(`DROP TYPE IF EXISTS "projects_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "skills_category_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum"`);
  }
}
