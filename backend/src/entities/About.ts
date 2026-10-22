import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('about')
export class About {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Hero / identity
  @Column({ type: 'varchar', length: 150, default: '' })
  fullName!: string;

  @Column({ type: 'varchar', length: 200, default: '' })
  tagline!: string;

  @Column({ type: 'simple-array', default: '' })
  roles!: string[]; // e.g. ["Data Analyst", "Data Scientist", "ML Engineer", "AI Engineer"] - typing animation

  @Column({ type: 'text', default: '' })
  biography!: string;

  @Column({ type: 'text', default: '' })
  careerObjective!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  location!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone!: string | null;

  @Column({ type: 'boolean', default: true })
  availableForWork!: boolean;

  @Column({ type: 'varchar', length: 100, default: 'Open to opportunities' })
  currentStatus!: string;

  @Column({ type: 'simple-array', default: '' })
  languages!: string[];

  @Column({ type: 'simple-array', default: '' })
  interests!: string[];

  @Column({ type: 'varchar', nullable: true })
  profilePhoto!: string | null;

  @Column({ type: 'varchar', nullable: true })
  bannerImage!: string | null;

  @UpdateDateColumn()
  updatedAt!: Date;
}
