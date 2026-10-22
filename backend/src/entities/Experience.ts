import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('experience')
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  company!: string;

  @Column({ type: 'varchar', length: 150 })
  role!: string;

  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'date', nullable: true })
  endDate!: string | null;

  @Column({ type: 'boolean', default: false })
  isCurrent!: boolean;

  @Column({ type: 'varchar', length: 150, nullable: true })
  location!: string | null;

  @Column({ type: 'simple-array', default: '' })
  responsibilities!: string[];

  @Column({ type: 'simple-array', default: '' })
  skillsUsed!: string[];

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
