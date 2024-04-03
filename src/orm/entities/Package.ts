import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { PackageStatus } from './types';

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  trackingNumber: string;

  @Column()
  carrier: string;

  @Column({
    default: 'Incoming' as PackageStatus
  })
  status: string;

  @Column()
  condition: string;

  @Column()
  sender: string;

  @Column()
  recipientName: string;

  @Column()
  comment: string;

  @Column()
  urgent: Boolean;

  @Column({ default: false })
  isDeleted: Boolean;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
