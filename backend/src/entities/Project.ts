import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ProjectStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'varchar', length: 250, unique: true })
  slug!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text', nullable: true })
  longDescription!: string | null;

  @Column({ type: 'simple-array', default: '' })
  techStack!: string[];

  @Column({ type: 'varchar', nullable: true })
  githubLink!: string | null;

  @Column({ type: 'varchar', nullable: true })
  liveDemoLink!: string | null;

  @Column({ type: 'varchar', nullable: true })
  thumbnail!: string | null;

  @Column({ type: 'simple-array', default: '' })
  images!: string[];

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.COMPLETED })
  status!: ProjectStatus;

  @Column({ type: 'boolean', default: false })
  featured!: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
