import { Request } from 'express';
import { User } from 'src/modules/users/entities/user.entity';

export interface UserAuthenticatedRequest extends Request {
  user: User;
}
