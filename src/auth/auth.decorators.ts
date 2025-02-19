import { SetMetadata } from '@nestjs/common';
import { limits } from './constants';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: limits[]) => SetMetadata(ROLES_KEY, roles);
