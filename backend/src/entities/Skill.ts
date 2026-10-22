import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SkillCategory {
  PROGRAMMING = 'Programming',
  DATABASES = 'Databases',
  MACHINE_LEARNING = 'Machine Learning',
  DEEP_LEARNING = 'Deep Learning',
  VISUALIZATION = 'Visualization',
  CLOUD = 'Cloud',
  TOOLS = 'Tools',
  FRAMEWORKS = 'Frameworks',
  SOFT_SKILLS = 'Soft Skills',
}

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'int', default: 50 })
  percentage!: number; // 0-100

  @Column({ type: 'varchar', length: 50, nullable: true })
  level!: string | null; // e.g. Beginner / Intermediate / Advanced / Expert

  @Column({ type: 'enum', enum: SkillCategory, default: SkillCategory.TOOLS })
  category!: SkillCategory;

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon!: string | null; // react-icons name, e.g. "SiPython"

  @Column({ type: 'varchar', length: 20, nullable: true })
  color!: string | null; // hex color

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
