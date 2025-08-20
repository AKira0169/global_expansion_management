import * as bcrypt from 'bcrypt';
import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Role } from '../enums/roles.enum';
import { Project } from 'src/modules/projects/entities/project.entity';

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;
  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CLIENT,
  })
  role: Role;

  @Column({ nullable: true })
  companyName: string;
  @Column({ nullable: true })
  contactEmail: string;

  @BeforeInsert()
  @BeforeUpdate()
  lowercaseEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  }
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  validatePassword(password: string): Promise<boolean> {
    if (!password) {
      throw new Error('Password is required for validation');
    }
    if (!this.password) {
      throw new Error('Hashed password is not set on the user document');
    }
    return bcrypt.compare(password, this.password);
  }
}
