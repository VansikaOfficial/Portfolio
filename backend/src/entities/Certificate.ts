import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  title!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  issuer!: string | null;

  @Column({ type: 'date', nullable: true })
  issueDate!: string | null;

  @Column({ type: 'varchar', nullable: true })
  credentialUrl!: string | null;

  @Column({ type: 'varchar' })
  image!: string; // stored path (local or cloudinary URL)

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
