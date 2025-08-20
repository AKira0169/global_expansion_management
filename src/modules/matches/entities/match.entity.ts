import { Project } from 'src/modules/projects/entities/project.entity';
import { Vendor } from 'src/modules/vendors/entities/vendor.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['projectId', 'vendorId'])
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (project) => project.matches)
  project: Project;
  @Column({ name: 'projectId' })
  readonly projectId: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.matches)
  vendor: Vendor;
  @Column({ name: 'vendorId' })
  readonly vendorId: string;

  @Column({ type: 'double' })
  score: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
