import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 250 })
  title!: string;

  @Column({ type: 'varchar', length: 300, unique: true })
  slug!: string;

  @Column({ type: 'text' })
  excerpt!: string;

  @Column({ type: 'text' })
  content!: string; // markdown

  @Column({ type: 'varchar', nullable: true })
  coverImage!: string | null;

  @Column({ type: 'simple-array', default: '' })
  tags!: string[];

  @Column({ type: 'boolean', default: false })
  published!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
