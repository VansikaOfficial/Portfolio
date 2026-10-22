import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('gallery')
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title!: string | null;

  @Column({ type: 'varchar', length: 250, nullable: true })
  caption!: string | null;

  @Column({ type: 'varchar' })
  image!: string;

  @Column({ type: 'int', default: 0 })
  displayOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
