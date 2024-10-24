import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Property } from '../../property/entities/property.entity';
import { FloorPlan } from '../../property/entities/floor-plan.entity';
import { Agent } from '../../agent/entities/agent.entity';
import { Project } from 'src/project/entities/project.entity';

@Entity('storage_files')
export class StorageFile extends BaseEntity {
  @Column({ nullable: false })
  fileName: string;

  // type will be header or feature or floor_plan for image file now
  @Column({ nullable: false, type: 'varchar', length: 50 })
  type: string;

  @Column({ nullable: true, type: 'varchar', length: 20 })
  size: string;

  @Column({ nullable: true })
  public_id: string;

  @Column({ nullable: true })
  project_id: number;

  @Column({ nullable: true })
  image_url: string;

  @ManyToOne(() => Property, (property) => property.propertyImages, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  property: Property;

  @ManyToOne(() => FloorPlan, (floorPlan) => floorPlan.floorPlanImages, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  floorPlan: FloorPlan;

  @OneToOne(() => Agent, (agent) => agent.agentImage, {
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  agent: Agent;
  
  @ManyToOne(() => Project, (project) => project.projectImages, { // Link with Project entity
    createForeignKeyConstraints: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project: Project;  // Each StorageFile will be linked to a Project
  
}
