import fs from 'fs';
import path from 'path';

import { Writer } from './writer';
import { Reader } from './reader';

export class FileSystem {
    static write(content: string, extension: string, dir?: string): Promise<string> {
        return Writer.write(content, extension, dir)
    }

    static read(filename: string): Promise<string> {
        return Reader.read(filename)
    }

    static delete(filename: string) {
        try{
            fs.unlinkSync(path.resolve(filename));
        }
        catch(e){}
    }

    static mkdir(dir: string){
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }
}