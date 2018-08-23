import fs from 'fs';
import path from 'path';

const tempDir = './tmp';

export class Reader {
    static read(filename: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(path.resolve(filename), (err, data) => {
                if(err)
                    return reject(err);

                resolve(data.toString('utf8'));
            })
        });
    }
}