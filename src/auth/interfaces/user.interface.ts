import { Role } from './role.enum';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
}
