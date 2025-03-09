import { IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  currentPage: number; // 默认第一页
  @IsOptional()
  pageSize: number; // 默认每页 10 条
}

export class SortDTO {
  @IsOptional()
  @IsString()
  prop: string;
  @IsOptional()
  @IsString()
  order: 'ASC' | 'DESC';
}
