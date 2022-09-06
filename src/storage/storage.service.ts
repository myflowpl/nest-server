import { Injectable, OnModuleInit } from '@nestjs/common';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';

@Injectable()
export class StorageService implements OnModuleInit {

  private STORAGE_FILE = './storage/data.json';
  data: { [key: string]: any[]; } = {};

  private async save() {
    await writeFile(this.STORAGE_FILE, JSON.stringify(this.data, null, 2));
  }

  async onModuleInit() {
    await mkdir('./storage', {recursive: true});
    const dataFile = await stat(this.STORAGE_FILE).catch(e => null);
    if(!dataFile) {
      await writeFile(this.STORAGE_FILE, '{}');
    }
    const data = (await readFile(this.STORAGE_FILE)).toString();
    if(data) {
      this.data = JSON.parse(data as any);
    }
  }

  async create<T>(cls: new () => T, data: Partial<T>): Promise<T> {
    const name = cls.name;
    if(!this.data[name]) {
      this.data[name] = [];
    }
    const ids = this.data[name].map(e => e.id);
    if(!ids.length) {
      ids.push(0);
    }
    const id = (Math.max(...ids))+1
    const entity = {
      id,
      ...data,
    }
    this.data[name].push(entity);
    await this.save();
    const inst = new cls();
    Object.assign(inst, entity);
    return inst;
  }

  async findAll<T>(cls: new () => T): Promise<T[]> {
    const name = cls.name;
    return (this.data[name] || []).map(entity => {
      const inst = new cls();
      Object.assign(inst, entity);
      return inst;
    });
  }

  async findOne<T>(cls: new () => T, id: number): Promise<T | null> {
    const name = cls.name;
    if(!this.data[name]) {
      return null;
    }
    const entity = this.data[name].find(e => e.id === id);
    if(!entity) {
      return null;
    }
    const inst = new cls();
    Object.assign(inst, entity);
    return inst;
  }
  async update<T>(cls: new () => T, id: number, data: Partial<T>): Promise<T | null> {
    const name = cls.name;
    if(!this.data[name]) {
      return null;
    }

    const entity = this.data[name].find(e => e.id === id);
    if(!entity) {
      return null;
    }
    delete data['id'];
    Object.assign(entity, data);
    await this.save();
    const inst = new cls();
    Object.assign(inst, entity);
    return inst;
  }  

  async remove<T>(cls: new () => T, id: number): Promise<number | null> {
    const name = cls.name;
    const row = await this.findOne(cls, id);
    if(!row) {
      return null;
    }
    if(this.data[name]) {
      this.data[name] = this.data[name].filter(e => e.id !== id);
    }
    await this.save();
    return id;
  }

}
