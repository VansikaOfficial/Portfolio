import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('resume')
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  filePath!: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  originalName!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  version!: string | null;

  @UpdateDateColumn()
  updatedAt!: Date;
}
