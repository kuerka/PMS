import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/auth/auth.decorators';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDTO } from './file.dto';

@Public()
@Controller('file')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class FileController {
  constructor(private fileService: FileService) {}

  @Get('list/prospect')
  async getProspectFiles(@Query('id', ParseIntPipe) id: number) {
    return await this.fileService.getProspectFiles(id);
  }

  @Get('list/contract')
  async getContractFiles(@Query('id', ParseIntPipe) id: number) {
    if (!id) return [];
    return await this.fileService.getContractFiles(id);
  }

  @Post('upload/prospect')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProspectFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDTO: UploadFileDTO,
  ) {
    const { id, type } = uploadFileDTO;
    return await this.fileService.addProspectFile(file, id, type);
  }

  @Post('upload/contract')
  @UseInterceptors(FileInterceptor('file'))
  async uploadContractFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDTO: UploadFileDTO,
  ) {
    const { id, type } = uploadFileDTO;
    return await this.fileService.addContractFile(file, id, type);
  }

  @Get('download')
  async downloadFile(
    @Res() res: Response,
    @Query('id', ParseIntPipe) id: number,
  ) {
    await this.fileService.downloadFile(id, res);
  }

  @Get('batch/prospect')
  async batchDownloadProspectFiles(
    @Res() res: Response,
    @Query('id', ParseIntPipe) id: number,
  ) {
    await this.fileService.batchDownloadProspectFile(id, res);
  }

  @Get('batch/contract')
  async batchDownloadContractFiles(
    @Res() res: Response,
    @Query('id', ParseIntPipe) id: number,
  ) {
    await this.fileService.batchDownloadContractFile(id, res);
  }

  @Post('delete')
  async deleteFile(@Body('id', ParseIntPipe) id: number) {
    return await this.fileService.delete(id);
  }
}
