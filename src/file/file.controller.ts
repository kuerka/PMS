import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/auth/auth.decorators';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { File as FileEntity } from './file.entity';

type FileType = FileEntity['type'];

@Public()
@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload/prospect')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProspectFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('id') id: number,
    @Body('type') type: FileType,
  ) {
    return await this.fileService.addProspectFile(file, id, type);
  }

  @Post('upload/contract')
  @UseInterceptors(FileInterceptor('file'))
  async uploadContractFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('id') id: number,
    @Body('type') type: FileType,
  ) {
    return await this.fileService.addContractFile(file, id, type);
  }

  @Get('download')
  async downloadFile(@Res() res: Response, @Query('id') id: number) {
    await this.fileService.downloadFile(id, res);
  }

  @Get('batch/prospect')
  async batchDownloadProspectFiles(
    @Res() res: Response,
    @Query('id') id: number,
  ) {
    await this.fileService.batchDownloadProspectFile(id, res);
  }

  @Post('delete')
  async deleteFile(@Body('id') id: number) {
    if (!id) return;
    return await this.fileService.delete(id);
  }
}
