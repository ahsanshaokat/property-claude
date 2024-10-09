// import { Column, Entity, OneToMany } from 'typeorm';
// import { BaseEntity } from '@/common/entity/base.entity';
// import { UserRoles } from './user-roles.entity';

// @Entity('roles')
// export class Role extends BaseEntity {
//   @Column({ nullable: false })
//   name: string;

//   @OneToMany(() => UserRoles, (roleUsers) => roleUsers.role, {
//     cascade: true,
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE',
//   })
//   roleUsers!: UserRoles[];
// }
