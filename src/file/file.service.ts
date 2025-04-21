import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File as FileEntity } from './file.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ulid } from 'ulid';
import * as archiver from 'archiver';
import { ContractService } from '@/contract/services/contract.service';
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
    private contractService: ContractService,
  ) {}

  async getProspectFiles(id: number) {
    return await this.fileRepository.findBy({
      prospectProjectId: id,
    });
  }

  async getContractFiles(id: number) {
    return await this.fileRepository.findBy({
      contractId: id,
    });
  }

  async addProspectFile(file: Express.Multer.File, id: number, type: FileType) {
    const fileEntity = this.fileRepository.create();
    fileEntity.prospectProjectId = id;
    fileEntity.type = type;
    const prefix = `prospect/${id}`;
    await this.add(file, fileEntity, prefix);
  }

  async addContractFile(file: Express.Multer.File, id: number, type: FileType) {
    const fileEntity = this.fileRepository.create();
    fileEntity.contractId = id;
    fileEntity.type = type;
    const prefix = `contract/${id}`;
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
      const fileDir = path.posix.join(UploadDir, prefix, ulid());
      fileEntity.path = path.posix.join(fileDir, filename);

      if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

      await manager.insert(FileEntity, fileEntity);

      fs.writeFileSync(fileEntity.path, file.buffer);
      return fileEntity;
    });
  }

  async updateFileType(id: number, type: FileType) {
    return await this.fileRepository.update(id, { type });
  }

  async downloadFile(id: number, res: Response) {
    const fileEntity = await this.fileRepository.findOneBy({ id });
    if (!fileEntity) throw new Error('File not found');
    if (!fs.existsSync(fileEntity.path!)) throw new Error('File not found');

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

  async batchDownloadContractFile(id: number, res: Response) {
    const contract = await this.contractService.getById(id);
    if (!contract) return;

    const fileEntities = await this.fileRepository.findBy({
      contractId: id,
    });

    await this.batchDownload(fileEntities, res, contract.projectName!);
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
    const file = await this.fileRepository.findOneBy({ id });
    if (!file) return;
    await this.fileRepository.manager.delete(FileEntity, { id });
    void this.handleRemoveFile(file);
    return file;
  }

  async handleRemoveFile(file: FileEntity) {
    const filePath = file.path;
    if (!filePath) return;
    const res = await this.fileRepository.exists({
      where: { path: path.posix.join(filePath) },
    });
    if (res) return;
    const dirName = path.dirname(filePath);
    fs.rmSync(dirName, { force: true, recursive: true });
  }
}
