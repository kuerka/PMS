import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from 'src/auth/auth.decorators';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
// import { File as FileEntity } from './file.entity';

@Public()
@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.fileService.create(file);
  }

  @Post('delete')
  async deleteFile(@Body() body: { id: number }) {
    const { id } = body;
    console.log(id, typeof id);
    return await this.fileService.delete(id);
  }
}
