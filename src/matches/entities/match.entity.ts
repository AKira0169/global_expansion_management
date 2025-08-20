import { Project } from 'src/projects/entities/project.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
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
  score: Number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
