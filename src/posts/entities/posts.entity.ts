import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  text: string;

  @Column({ nullable: false })
  picture: string;

  @Column({ nullable: false })
  dateOfCreation: Date;

  @Column({ nullable: true })
  dateOfUpdate: Date;

  @Column('text', { array: true, nullable: true })
  category: string[];

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

}
