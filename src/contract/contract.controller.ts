import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContractService } from './services/contract.service';
import {
  ContractDto,
  ContractQueryDto,
  ContractUpdateDto,
} from './dto/contract.dto';
import { Public } from '@/auth/auth.decorators';
import { CostFormService } from '@/cost-form/cost-form.service';

@Public()
@Controller('contract')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ContractController {
  constructor(
    private contractService: ContractService,
    private costFormService: CostFormService,
  ) {}

  @Post('add')
  async createContract(@Body() contractDto: ContractDto) {
    console.log(contractDto);
    const contract = this.contractService.createContract(contractDto);
    return await this.contractService.addContractTransition(contract);
  }
  @Post('page')
  async getContractPage(@Body() contractQueryDto: ContractQueryDto) {
    return await this.contractService.getContractPage(contractQueryDto);
  }
  @Get('detail')
  async getContractDetail(@Query('id') id: number) {
    return await this.contractService.getContractDetailsById(id);
  }
  @Post('update')
  async updateContract(@Body() contractDto: ContractUpdateDto) {
    const contract = this.contractService.createContract(contractDto);
    console.log(contract);
    return await this.contractService.updateContractTransition(contract);
  }
  @Post('delete')
  async deleteContract(@Param('id') id: number) {
    return await this.contractService.deleteContract(id);
  }
}
