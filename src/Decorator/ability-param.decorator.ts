import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AbilityRequest } from 'src/types/AbilityRequest';

export const AbilityParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest<AbilityRequest>().ability;
  },
);
