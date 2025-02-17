export type Role = 'ADMIN' | 'USER';

export type JwtUserInfo = {
  id: number;
  username: string;
  role: Role;
};

export const jwtConstants = {
  secret: 'secret_key',
};
