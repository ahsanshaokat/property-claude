import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { ProjectType } from '../enum/project-type.enum';
import { StorageFile } from '../../storage-file/entities/storage-file.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ProjectType,
  })
  projectType: ProjectType;

  @Column({ type: 'float', nullable: true })
  totalArea?: number;

  @Column({ type: 'int', nullable: true })
  totalUnits?: number;

  @ManyToOne(() => Company, (company) => company.projects, { eager: true })
  company: Company;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  completionDate?: Date;

  @Column({ type: 'float', nullable: true })
  budget?: number;

  @Column({ type: 'float', nullable: true })
  estimatedRevenue?: number;

  @OneToMany(() => StorageFile, (storageFile) => storageFile.project, {  // One project can have multiple images
    cascade: true,
  })
  projectImages: StorageFile[];  // Array of images
}
