import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;
}
