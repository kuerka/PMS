import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ContractService } from './services/contract.service';
import { ContractDto } from './dto/contract.dto';
import { Public } from '@/auth/auth.decorators';

@Public()
@Controller('contract')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Post('add')
  async createContract(@Body() contractDto: ContractDto) {
    console.log(contractDto);
    const contract = this.contractService.createContract(contractDto);
    return await this.contractService.addContract(contract);
  }
}
