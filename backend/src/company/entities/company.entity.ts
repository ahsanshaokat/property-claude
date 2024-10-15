import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Project, (project) => project.company)
  projects: Project[];

  @ManyToOne(() => User, (user) => user.companies)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
