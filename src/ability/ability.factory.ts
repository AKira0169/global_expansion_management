import { Injectable } from '@nestjs/common';
import { createMongoAbility, MongoAbility, AbilityBuilder } from '@casl/ability';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/enums/roles.enum';
import { Project } from 'src/projects/entities/project.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { Match } from 'src/matches/entities/match.entity';

export enum Action {
  Manage = 'manage', // Full control
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | User
  | Project
  | Vendor
  | Match
  | typeof User
  | typeof Project
  | typeof Vendor
  | typeof Match
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  definedUserAbility(user: User) {
    const { build, can, cannot } = new AbilityBuilder(createMongoAbility);
    if (user.role === Role.ADMIN) {
      can(Action.Manage, 'all');
    } else if (user.role === Role.CLIENT) {
      cannot(Action.Manage, 'all');
      can(Action.Read, Project.name, {
        userId: user.id,
      });
    }

    return build();
  }
}
