import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique('UNIQUE_EMAIL', ['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  roleId: number;

  @ManyToOne(() => Role, { eager: true })
  role: Role;
}
