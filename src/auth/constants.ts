export type limits = 0 | 1 | 2; // 0:admin, 1:edit, 2:view
export const LimitsMap: Record<string, limits> = {
  admin: 0,
  edit: 1,
  view: 2,
};

export type JwtUserInfo = {
  id: number;
  username: string;
  limits: limits;
};

export const jwtConstants = {
  secret: 'secret_key',
};
