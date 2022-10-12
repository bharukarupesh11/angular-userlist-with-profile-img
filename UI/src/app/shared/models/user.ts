export interface User {
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  file: string;
  isAdmin: boolean;
  token?: string;
}
