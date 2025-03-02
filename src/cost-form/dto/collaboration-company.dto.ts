import {
  IsOptional,
  IsInt,
  IsString,
  IsDecimal,
  IsEnum,
} from 'class-validator';
import { CollaborationCompany } from '../entities/collaboration-company.entity';

type DTO = Partial<CollaborationCompany>;

export class CreateCollaborationCompanyDto implements DTO {
  @IsInt()
  productionCostFormId: number;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsDecimal()
  collaborationAmount?: string;

  @IsOptional()
  @IsEnum(['固定单价', '包干总价'])
  collaborationAmountType?: '固定单价' | '包干总价';

  @IsOptional()
  @IsDecimal()
  settlementAmount?: string;

  @IsOptional()
  @IsDecimal()
  collaborationPayableFunds?: string;
}

export class UpdateCollaborationCompanyDto implements DTO {
  @IsInt()
  id: number;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsDecimal()
  collaborationAmount?: string;

  @IsOptional()
  @IsEnum(['固定单价', '包干总价'])
  collaborationAmountType?: '固定单价' | '包干总价';

  @IsOptional()
  @IsDecimal()
  settlementAmount?: string;

  @IsOptional()
  @IsDecimal()
  collaborationPayableFunds?: string;
}
