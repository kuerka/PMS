export type limits = 0 | 1 | 2; // 0:admin, 1:edit, 2:view
export const LimitsMap: Record<string, limits> = {
  admin: 0,
  edit: 1,
  view: 2,
};
export const LIMIT_ADMIN = LimitsMap.admin;
export const LIMIT_EDIT = LimitsMap.edit;
export const LIMIT_VIEW = LimitsMap.view;
export const ANY_ROLE = Object.values(LimitsMap);
export const ABOVE_EDIT = [LIMIT_ADMIN, LIMIT_EDIT];

export type JwtUserInfo = {
  id: number;
  username: string;
  limits: limits;
};

export const jwtConstants = {
  secret: 'secret_key',
};
