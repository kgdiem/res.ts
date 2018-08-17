import fs from 'fs';
import path from 'path';

const dir = './tmp';

export class Writer {
    static write(content: string, extension: string): Promise<string> {
        return new Promise(resolve => {
            this.mkdir();

            const filename = `${dir}/${new Date().getTime()}${extension}`;

            fs.writeFile(path.resolve(filename), content, err => {
                resolve(err ? '' : filename);
            });
        });
    }

    static delete(filename: string) {
        fs.unlinkSync(filename);
    }

    private static mkdir(){
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }
}