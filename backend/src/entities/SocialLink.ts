import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('social_links')
export class SocialLink {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  platform!: string; // e.g. github, linkedin, twitter, instagram, kaggle, leetcode

  @Column({ type: 'varchar' })
  url!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  icon!: string | null;

  @Column({ type: 'boolean', default: true })
  isVisible!: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
