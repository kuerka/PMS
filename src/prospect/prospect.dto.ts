import { PaginationDto } from '@/pagination/pagination.dto';

export class ProspectQueryDto extends PaginationDto {
  query: {
    name: string;
  };
}
