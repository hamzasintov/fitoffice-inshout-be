import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import bycrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password: string;

  @Column()
  role: number;

  @Column({ nullable: true, type: 'text' })
  resetPasswordToken: string | null;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  hashPassword() {
    this.password = bycrypt.hashSync(this.password, 0);
  }

  checkIfPasswordMatches(unencryptedPassword: string): boolean {
    return bycrypt.compareSync(unencryptedPassword, this.password);
  }
}
