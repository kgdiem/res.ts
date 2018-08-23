import { Parser } from "./parser";
import { FileSystem } from "./util";

import { Generator as IGenerator } from './types';

export class Generator implements IGenerator {
    private fs: FileSystem;

    constructor(fs: FileSystem){
        this.fs = fs;
    }

    
}