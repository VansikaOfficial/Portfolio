import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  designation!: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  company!: string | null;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'varchar', nullable: true })
  avatar!: string | null;

  @Column({ type: 'int', default: 5 })
  rating!: number;

  @Column({ type: 'boolean', default: true })
  isApproved!: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
