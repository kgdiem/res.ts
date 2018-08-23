import fs from 'fs';
import path from 'path';

const tempDir = './tmp';

export class Writer {
    static write(content: string, extension: string, dir?: string): Promise<string> {
        return new Promise(resolve => {
            const writeDir = dir ? dir : tempDir;

            this.mkdir(writeDir);

            const filename = `${writeDir}/${new Date().getTime()}${extension}`;

            fs.writeFile(path.resolve(filename), content, err => {
                resolve(err ? '' : filename);
            });
        });
    }

    static delete(filename: string) {
        try{
            fs.unlinkSync(path.resolve(filename));
        }
        catch(e){}
    }

    private static mkdir(dir: string){
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }
}