import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150, default: 'My Portfolio' })
  siteTitle!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  siteDescription!: string | null;

  @Column({ type: 'varchar', nullable: true })
  favicon!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'system' })
  defaultTheme!: string; // 'light' | 'dark' | 'system'

  @Column({ type: 'varchar', length: 20, nullable: true })
  primaryColor!: string | null;

  // SEO
  @Column({ type: 'varchar', length: 200, nullable: true })
  metaTitle!: string | null;

  @Column({ type: 'varchar', length: 300, nullable: true })
  metaDescription!: string | null;

  @Column({ type: 'simple-array', default: '' })
  metaKeywords!: string[];

  @Column({ type: 'varchar', nullable: true })
  ogImage!: string | null;

  @Column({ type: 'varchar', nullable: true })
  googleAnalyticsId!: string | null;

  @Column({ type: 'boolean', default: false })
  maintenanceMode!: boolean;

  @UpdateDateColumn()
  updatedAt!: Date;
}
