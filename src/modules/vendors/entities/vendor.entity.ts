import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Match } from 'src/modules/matches/entities/match.entity';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToMany(() => Match, (match) => match.vendor)
  matches: Match[];
  @Column()
  name: string;
  @Column({ type: 'simple-array' })
  countries_supported: string[];

  @Column({ type: 'simple-array' })
  services_offered: string[];

  @Column({ type: 'double' })
  rating: number;

  @Column({ type: 'double' })
  response_sla_hours: number;
}
