import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

export interface UserAuthenticatedRequest extends Request {
  user: User;
}
