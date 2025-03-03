import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File as FileEntity } from './file.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ulid } from 'ulid';
import * as archiver from 'archiver';
import { ProspectService } from '@/prospect/prospect.service';
import { Response } from 'express';

const UploadDir = 'uploads';
type FileType = FileEntity['type'];

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
    private prospectService: ProspectService,
  ) {}

  async addProspectFile(file: Express.Multer.File, id: number, type: FileType) {
    const fileEntity = this.fileRepository.create();
    fileEntity.prospectProjectId = id;
    fileEntity.type = type;
    const prefix = `prospect/${id}/${type}`;
    await this.add(file, fileEntity, prefix);
  }

  async addContractFile(file: Express.Multer.File, id: number, type: FileType) {
    const fileEntity = this.fileRepository.create();
    fileEntity.contractId = id;
    fileEntity.type = type;
    const prefix = `contract/${id}/${type}`;
    await this.add(file, fileEntity, prefix);
  }

  async add(
    file: Express.Multer.File,
    fileEntity: FileEntity,
    prefix: string = '',
  ) {
    return await this.fileRepository.manager.transaction(async (manager) => {
      const filename = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      );
      fileEntity.size = file.size;
      fileEntity.name = filename;
      const fileDir = path.join(UploadDir, prefix, ulid());
      fileEntity.path = path.join(fileDir, filename);

      if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

      await manager.insert(FileEntity, fileEntity);

      fs.writeFileSync(fileEntity.path, file.buffer);
      return fileEntity;
    });
  }

  async downloadFile(id: number, res: Response) {
    const fileEntity = await this.fileRepository.findOneBy({ id });
    if (!fileEntity) return;
    if (!fs.existsSync(fileEntity.path!)) return;

    const filename = encodeURIComponent(fileEntity.name!);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    fs.createReadStream(fileEntity.path!).pipe(res);
  }

  async batchDownloadProspectFile(id: number, res: Response) {
    const prospect = await this.prospectService.findById(id);
    if (!prospect) return;

    const fileEntities = await this.fileRepository.findBy({
      prospectProjectId: id,
    });

    await this.batchDownload(fileEntities, res, prospect.projectName);
  }

  async batchDownload(
    fileEntities: FileEntity[],
    res: Response,
    filename: string = 'files',
  ) {
    const zipName = encodeURIComponent(`${filename}.zip`);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
    const archive = archiver('zip');
    archive.pipe(res);

    for (const fileEntity of fileEntities) {
      const { path, name, type } = fileEntity;
      archive.file(path!, { name: `${type}/${name}` });
    }
    await archive.finalize();
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
