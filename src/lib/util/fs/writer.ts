import fs from 'fs';
import path from 'path';

import { FileSystem } from './fileSystem';

const tempDir = './tmp';

export class Writer {
    static write(content: string, extension: string, name: string, dir?: string): Promise<string> {
        return new Promise(resolve => {
            const writeDir = dir ? dir : tempDir;

            new FileSystem().mkdir(writeDir);

            const filename = `${writeDir}/${name}${extension}`;

            fs.writeFile(path.resolve(filename), content, err => {
                resolve(err ? '' : filename);
            });
        });
    }
}