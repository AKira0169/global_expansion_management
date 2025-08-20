import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_ABILITY, RequiredRule } from 'src/Decorator/abilities.decorator';
import { ForbiddenError } from '@casl/ability';
import { AbilityFactory, AppAbility } from 'src/ability/ability.factory';
import { AbilityRequest } from 'src/types/AbilityRequest';
import { UserAuthenticatedRequest } from 'src/types/UserAuthenticatedRequest';

@Injectable()
export class AbilitiesGuard {
  constructor(
    private abilityFactory: AbilityFactory,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const rules = this.reflector.getAllAndOverride<RequiredRule[]>(CHECK_ABILITY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest<UserAuthenticatedRequest & AbilityRequest>();
    const user = request?.user;

    if (user) {
      const ability = this.abilityFactory.definedUserAbility(user);
      request.ability = ability as AppAbility;

      for (const rule of rules ?? []) {
        // Handle class-based subjects by converting them to strings
        const subjectType = this.resolveSubjectType(rule.subject);
        try {
          ForbiddenError.from(ability)
            .setMessage(`You cannot ${rule.action} ${subjectType}`)
            .throwUnlessCan(rule.action, subjectType);
        } catch (error) {
          throw new ForbiddenException(error);
        }

        if (request.body) {
          for (const field of Object.keys(request.body)) {
            try {
              ForbiddenError.from(ability)
                .setMessage(`You cannot update field "${field}" on ${subjectType}`)
                .throwUnlessCan(rule.action, subjectType, field);
            } catch (error) {
              throw new ForbiddenException(error);
            }
          }
        }
      }

      return true;
    }
    throw new ForbiddenException('No authenticated principal found');
  }

  // Fix: Handle all possible Subjects types
  private resolveSubjectType(subject: RequiredRule['subject']): string {
    if (typeof subject === 'string') return subject;
    // Try to access `modelName` or `name` safely
    const maybeModel = subject as { modelName?: string; name?: string };
    return maybeModel.modelName ?? maybeModel.name ?? 'all';
  }
}
