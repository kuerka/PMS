import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export const parseIntString = (value: string) => {
  const num = Number(value);
  return Number.isInteger(num) ? num : value;
};

export function IsOptionalOrEmpty() {
  return applyDecorators(
    IsOptional(),
    Transform(({ value }): string | null => (value === '' ? null : value)),
  );
}
