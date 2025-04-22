import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { File as FileEntity } from './file.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { ulid } from 'ulid';
import * as archiver from 'archiver';
import { Response } from 'express';
import { ProspectProject } from '@/prospect/prospect.entity';
import { Contract } from '@/contract/entities/contract.entity';

const UploadDir = 'uploads';
type FileType = FileEntity['type'];

const handleFileError = (res: Response, error: Error) => {
  res.status(500).json({ code: 500, success: false, message: error.message });
};

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
    @InjectDataSource() private dataSource: DataSource,
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
      // const filename = file.originalname;
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
    try {
      const fileEntity = await this.fileRepository.findOneBy({ id });
      if (!fileEntity) throw new Error('File not found');
      if (!fs.existsSync(fileEntity.path!)) throw new Error('File not found');

      const filename = encodeURIComponent(fileEntity.name!);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`,
      );

      fs.createReadStream(fileEntity.path!).pipe(res);
    } catch (error) {
      handleFileError(res, error as Error);
    }
  }

  async batchDownloadProspectFile(id: number, res: Response) {
    try {
      const prospect = await this.dataSource
        .getRepository(ProspectProject)
        .findOneBy({ id });
      if (!prospect) throw new Error('Prospect not found');

      const fileEntities = await this.fileRepository.findBy({
        prospectProjectId: id,
      });

      await this.batchDownload(fileEntities, res, prospect.projectName);
    } catch (error) {
      handleFileError(res, error as Error);
    }
  }

  async batchDownloadContractFile(id: number, res: Response) {
    try {
      const contract = await this.dataSource
        .getRepository(Contract)
        .findOneBy({ id });
      if (!contract) throw new Error('Contract not found');

      const fileEntities = await this.fileRepository.findBy({
        contractId: id,
      });

      await this.batchDownload(fileEntities, res, contract.projectName!);
    } catch (error) {
      handleFileError(res, error as Error);
    }
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

  async deleteByProspectId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.fileRepository.manager;
    const files = await this.fileRepository.findBy({
      prospectProjectId: id,
    });
    if (!files.length) return;
    await this.fileRepository.manager.delete(FileEntity, {
      prospectProjectId: id,
    });
    for (const file of files) {
      void this.handleRemoveFile(file);
    }
    return files;
  }

  async deleteByContractId(id: number, manager?: EntityManager) {
    if (!manager) manager = this.fileRepository.manager;
    const files = await this.fileRepository.findBy({
      contractId: id,
    });
    if (!files.length) return;
    await this.fileRepository.manager.delete(FileEntity, {
      contractId: id,
    });
    for (const file of files) {
      void this.handleRemoveFile(file);
    }
    return files;
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
