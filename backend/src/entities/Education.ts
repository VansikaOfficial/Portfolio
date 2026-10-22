import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('education')
export class Education {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  institution!: string; // College / School name

  @Column({ type: 'varchar', length: 100 })
  degree!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fieldOfStudy!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cgpa!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  percentage!: string | null;

  @Column({ type: 'varchar', length: 50 })
  startYear!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  endYear!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
