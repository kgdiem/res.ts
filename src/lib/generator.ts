import { Parser } from "./parser";
import { FileSystem } from "./util";

import { Generator as IGenerator } from './types';

export class Generator implements IGenerator {
    private fs: FileSystem;
    private _root: string;
    private _projectDir: string = '';
    private _typesDir: string = '';

    constructor(fs: FileSystem, root?: string){
        this.fs = fs;

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

    project(path?: string): string {
        if(!path)
            path = 'project';

        this._projectDir = `${this.root}/${path}`;

        this.fs.mkdir(this._projectDir);

        return this._projectDir;
    }

    types(): string {
        if(!this._projectDir)
            this.project();

        this._typesDir = `${this._projectDir}/types`;

        this.fs.mkdir(this._typesDir);

        return this._typesDir;
    }

    private services(){
        if(!this._projectDir)
            this.project();

        this.fs.mkdir(`${this._projectDir}/services`);
    }
}