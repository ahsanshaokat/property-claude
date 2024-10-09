import { BaseEntity } from '../../common/entity/base.entity';
import { Property } from '../../property/entities/property.entity';
import { StorageFile } from '../../storage-file/entities/storage-file.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('agents')
export class Agent extends BaseEntity {
  @Column({ nullable: true })
  designation: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  fb_link: string;

  @Column({ nullable: true })
  instagram_link: string;

  @Column({ nullable: true })
  twitter_link: string;

  @Column({ nullable: true })
  linkedin_link: string;

  @OneToOne(() => User, (user) => user.agent, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Property, (property) => property.agent, {
    createForeignKeyConstraints: false,
  })
  properties: Property[];

  @OneToOne(() => StorageFile, (storageFile) => storageFile.floorPlan, {
    createForeignKeyConstraints: false,
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  agentImage: StorageFile;
}
