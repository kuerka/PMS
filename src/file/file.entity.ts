import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('t_file')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  filepath: string;

  @Column()
  filesize: number;
}
