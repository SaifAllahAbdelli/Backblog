import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('roles')
@Unique('UNIQUE_ROLE', ['role'])
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: string;
}
