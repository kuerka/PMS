import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('id', ['id'], { unique: true })
@Entity('users', { schema: 'pms' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'username', length: 50 })
  username: string;

  @Column('varchar', { name: 'password', length: 50 })
  password: string;

  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  name: string | null;

  @Column('varchar', { name: 'phone', nullable: true, length: 255 })
  phone: string | null;

  @Column('varchar', { name: 'department_id', nullable: true, length: 255 })
  departmentId: string | null;

  @Column('int', {
    name: 'limits',
    nullable: true,
    comment:
      '0：全部可编辑可查看\n1：全部可查看，部分可编辑（项目完成进度，是否出发收款条件\n）\n2：只可查看，不可编辑',
  })
  limits: number | null;
}
