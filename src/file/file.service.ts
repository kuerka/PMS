import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File as FileEntity } from './file.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ulid } from 'ulid';

@Injectable()
export class FileService {
  uploadDir = 'uploads';
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {}

  async create(file: Express.Multer.File) {
    return await this.fileRepository.manager.transaction(async (manager) => {
      let filename = file.originalname;
      filename = Buffer.from(filename, 'latin1').toString('utf8');

      const fileDir = path.join(this.uploadDir, ulid());
      if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });
      const filepath = path.join(fileDir, filename);

      const files = new FileEntity();
      files.path = filepath;
      files.type = '中标通知书';
      files.name = filename;
      files.size = file.size;
      await manager.save(files);

      fs.writeFileSync(filepath, file.buffer);

      return files;
    });
  }

  async delete(id: number) {
    return await this.fileRepository.manager.transaction(async (manager) => {
      const file = await manager.findOneBy(FileEntity, { id });
      if (!file) return;
      await manager.delete(FileEntity, { id });

      if (file.path) {
        const dirName = path.dirname(file.path);
        fs.rmSync(dirName, { force: true, recursive: true });
      }
      return file;
    });
  }
}
