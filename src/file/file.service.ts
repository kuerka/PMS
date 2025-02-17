/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File as FileEntity } from './file.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  uploadDir = 'uploads';
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {}

  async create(file: Express.Multer.File) {
    if (!fs.existsSync(this.uploadDir)) fs.mkdirSync(this.uploadDir);
    const filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const filesize = file.size as number;

    const filepath = path.join(this.uploadDir, filename);
    fs.writeFileSync(filepath, file.buffer);

    const files = [{ filename, filepath, filesize }];
    const res = await this.fileRepository.save(files);

    return res;
  }

  async delete(id: number) {
    const file = await this.fileRepository.findOneBy({ id });
    if (!file) return;
    await this.fileRepository.delete({ id });
    fs.rmSync(file.filepath, { force: true, recursive: true });
    return file;
  }
}
