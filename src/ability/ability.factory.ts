import { Injectable } from '@nestjs/common';
import { createMongoAbility, MongoAbility, AbilityBuilder } from '@casl/ability';
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/users/enums/roles.enum';
import { Project } from 'src/modules/projects/entities/project.entity';
import { Vendor } from 'src/modules/vendors/entities/vendor.entity';
import { Match } from 'src/modules/matches/entities/match.entity';
import { ResearchDocument } from 'src/modules/research-documents/entities/research-document.entity';

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
  | ResearchDocument
  | typeof User
  | typeof Project
  | typeof Vendor
  | typeof Match
  | typeof ResearchDocument
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
