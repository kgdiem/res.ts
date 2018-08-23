import fs from 'fs';
import path from 'path';

import { Writer } from './writer';
import { Reader } from './reader';

export class FileSystem {
    write(content: string, extension: string, name: string, dir?: string): Promise<string> {
        return Writer.write(content, extension, name, dir)
    }

    read(filename: string): Promise<string> {
        return Reader.read(filename)
    }

    delete(filename: string) {
        try{
            fs.unlinkSync(path.resolve(filename));
        }
        catch(e){}
    }

    mkdir(dir: string){
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }
}