import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { ProjectStatus } from '../enums/ProjectStatus';
import { Match } from 'src/matches/entities/match.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ name: 'userId' })
  readonly userId: string;

  @OneToMany(() => Match, (match) => match.project)
  matches: Match[];

  @Column()
  name: string;

  @Column()
  country: string;

  @Column({ type: 'simple-array', nullable: true })
  services_needed: string[];

  @Column({ type: 'double' })
  budget: number;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PENDING,
  })
  status: ProjectStatus;
}
