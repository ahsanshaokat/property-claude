import { BeforeInsert, Column, Entity, Index, OneToOne } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../common/entity/base.entity';
import { Agent } from '../../agent/entities/agent.entity';
// import { UserRoles } from './user-roles.entity';
import { passwordHash } from '../../common/util/db.utils';

@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: false, length: 100 })
  firstName: string;

  @Column({ nullable: false, length: 100 })
  lastName: string;

  @Column({ nullable: false, length: 100 })
  @Index('users_unique_name', { unique: true })
  username: string;

  @Column({ nullable: false, length: 255 })
  @Index('users_unique_email', { unique: true })
  email: string;

  @Column({ nullable: false, length: 100 })
  phone: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true, default: 'user' })
  role: string;

  // @OneToMany(() => UserRoles, (userRoles) => userRoles.user, {
  //   cascade: true,
  // })
  // userRoles: UserRoles[];

  @OneToOne(() => Agent, (agent) => agent.user, {
    createForeignKeyConstraints: false,
  })
  agent: Agent;

  @BeforeInsert()
  async hashPassword() {
    this.password = passwordHash(this.password);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
