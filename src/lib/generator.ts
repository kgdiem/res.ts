import { Parser } from "./parser";
import { FileSystem } from "./util";

import { Generator as IGenerator } from './types';

export class Generator implements IGenerator {
    private fs: FileSystem;
    private _root: string;
    private _projectDir: string = '';

    constructor(fs: FileSystem, root?: string){
        this.fs = fs;

        this._root = root ? root : './';
    }

    get root(): string {
        return this._root;
    }

    set root(root: string){
        this._root = root;
    }

    project(path?: string) {
        if(!path)
            path = 'project';

        this._projectDir = `${this.root}/${path}`;

        this.fs.mkdir(this._projectDir);
    }

    types(){
        if(!this._projectDir)
            this.project();

        this.fs.mkdir(`${this._projectDir}/types`);
    }

    private services(){
        if(!this._projectDir)
            this.project();

        this.fs.mkdir(`${this._projectDir}/services`);
    }
}