import { Request } from 'express';
import { AppAbility } from 'src/ability/ability.factory';

export interface AbilityRequest extends Request {
  ability: AppAbility;
}
