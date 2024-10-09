// import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
// import { BaseEntity } from '@/common/entity/base.entity';
// import { User } from './user.entity';
// import { Role } from './role.entity';

// @Entity('user_roles')
// export class UserRoles extends BaseEntity {
//   @Column()
//   userId!: number;

//   @Column()
//   roleId!: number;

//   @ManyToOne(() => User, (user) => user.userRoles)
//   @JoinColumn()
//   user: User;

//   @ManyToOne(() => Role, (role) => role.roleUsers)
//   @JoinColumn()
//   role: Role;
// }
