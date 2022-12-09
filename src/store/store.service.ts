import { Injectable, OnModuleInit } from '@nestjs/common';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';

export class FindOptions {
  skip?: number;
  take?: number;
}

@Injectable()
export class StoreService implements OnModuleInit {

  private STORAGE_FILE = './storage/data.json';

  data: { [key: string]: any[]; } = {};

  private async persist() {
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

  async save<T>(cls: T): Promise<T> {
    const name = cls.constructor.name;
    if(!this.data[name]) {
      this.data[name] = [];
    }
    if(cls['id']) {
      return this.update(cls.constructor as any, cls, {id: cls['id']} as any)
    } else {

      const ids = this.data[name].map(e => e.id);
      if(!ids.length) {
        ids.push(0);
      }
      const id = (Math.max(...ids))+1
      cls['id'] = id;
      const entity = {
        ...cls,
      }
      this.data[name].push(entity);
      await this.persist();
      return cls;
    }
  }

  async find<T>(cls: new () => T, query?: FindOptions): Promise<T[]> {
    const name = cls.name;
    let rows = (this.data[name] || []).map(entity => {
      const inst = new cls();
      Object.assign(inst, entity);
      return inst;
    });

    if(query && (query.skip >= 0) && query.take) {
      rows = rows.slice(query.skip, query.skip+query.take)
    }
    return rows;
  }

  async findOneBy<T>(cls: new () => T, where: Partial<T>): Promise<T | null> {
    const name = cls.name;
    if(!this.data[name]) {
      return null;
    }
    const props = Object.keys(where);

    const prop = props[0];
    const value = where[prop];
    let entities = this.data[name].filter(e => e[prop] === value);
    if(props[1]) {
      const prop = props[1];
      const value = where[prop];
  
      entities = entities.filter(e => e[prop] === value);
    }
    if(props[2]) {
      const prop = props[2];
      const value = where[prop];
  
      entities = entities.filter(e => e[prop] === value);
    }
    const entity = entities[0];

    if(!entity) {
      return null;
    }
    const inst = new cls();
    Object.assign(inst, entity);
    return inst;
  }

  async update<T>(cls: new () => T, data: Partial<T>, where: Partial<T>): Promise<T | null> {
    const name = cls.name;

    if(!this.data[name]) {
      return null;
    }

    const entity = await this.findOneBy(cls, where);
    const row = this.data[name].find(r => r.id === entity['id'])
    if(!entity) {
      return null;
    }
    delete data['id'];
    Object.assign(entity, data);
    Object.assign(row, data);
    await this.persist();
    return entity;
  }  

  async remove<T>(cls: T): Promise<number | null> {
    const name = (cls as any).constructor.name;

    if(!this.data[name]) {
      return null;
    }

    const id = (cls as any).id;
    const row = this.data[name].find(e => e.id === id)

    if(!row) {
      return null;
    }
    this.data[name] = this.data[name].filter(e => e.id !== id);

    await this.persist();

    return id;
  }

  async delete<T>(cls: new () => T, id: number): Promise<number | null> {
    const name = cls.name;
    if(!this.data[name]) {
      return null;
    }
    const row = this.data[name].find(e => e.id === id)
    if(!row) {
      return null;
    }
    this.data[name] = this.data[name].filter(e => e.id !== id);

    await this.persist();

    return id;
  }

}

