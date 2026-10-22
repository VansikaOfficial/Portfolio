import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('internships')
export class Internship {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  company!: string;

  @Column({ type: 'varchar', length: 150 })
  role!: string;

  @Column({ type: 'varchar', length: 100 })
  duration!: string; // e.g. "Jun 2024 - Aug 2024"

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'simple-array', default: '' })
  skillsUsed!: string[];

  @Column({ type: 'varchar', nullable: true })
  certificateImage!: string | null;

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
