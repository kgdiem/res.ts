import { Parser } from "./parser";
import { FileSystem } from "./util";

import { Generator as IGenerator, ParserMetaData } from './types';

export class Generator implements IGenerator {
    public parser: Parser;

    private fs: FileSystem;
    private _root: string;
    private _projectDir: string = '';
    private _typesDir: string = '';
    private _servicesDir: string = '';

    constructor(fs: FileSystem, parser: Parser, root?: string){
        this.fs = fs;
        this.parser = parser;

        this._root = root ? root : './';
    }

    get root(): string {
        return this._root;
    }

    set root(root: string) {
        this._root = root;
    }

    get projectDir(): string {
        return this._projectDir;
    }

    get typesDir(): string {
        return this._typesDir;
    }

    async project(entities: string[], path='project'): Promise<string> {
        this.makeProjectDir(path);

        const apiMetaData: ParserMetaData[] = await this.types(entities);

        this.services(apiMetaData);

        return this._projectDir;
    }

    private async types(entities: string[]): Promise<ParserMetaData[]> {
        this.makeTypesDir();
        
        return this.parser.process(this._typesDir, entities);
    }

    private services(apiMetaData: ParserMetaData[]){
        this.makeServicesDir();

        // generate services
    }

    private makeProjectDir(path: string){
        this._projectDir = `${this.root}/${path}`;

        this.fs.mkdir(this._projectDir);
    }

    private makeTypesDir(){
        this._typesDir = `${this._projectDir}/types`;

        this.fs.mkdir(this._typesDir);

        return this._typesDir;
    }

    private makeServicesDir(){
        this._servicesDir = `${this._projectDir}/services`;

        this.fs.mkdir(this._servicesDir);

        return this._typesDir;
    }
}