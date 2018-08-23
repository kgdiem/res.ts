import { ArrayTransformResponse } from './types';

import { FileSystem, Compiler, Http } from './util';

import { Parser as IParser, ParserMetaData } from './types';

export class Parser implements IParser {
    private fileSystem: FileSystem;
    private compiler: Compiler;
    private http: Http;
    private _name: string = '';
    private object: any;
    private raw: string = '';

    public metadata: ParserMetaData = <ParserMetaData>{};

    constructor(fileSystem: FileSystem, compiler: Compiler, http: Http, str?: string, name?: string) {
        this.fileSystem = fileSystem;
        this.compiler = compiler;
        this.http = http;

        if(str)
            this.loadEntity(str, name);
    }

    process(dir: string, entities: string[]): Promise<ParserMetaData[]> {
        const metadataCollection = <ParserMetaData[]> [];

        return new Promise(async resolve => {
            await Promise.all(entities.map(async entity => {
                const name = this.getEntityName(entity);
                const parser = new Parser(this.fileSystem, this.compiler, this.http);
    
                await parser.loadEntity(entity, name);
    
                await parser.dump(dir);
    
                metadataCollection.push(parser.metadata);
            }));

            resolve(metadataCollection);
        });
    }

    load(str: string, name?: string): void {
        if(name)
            this._name = name;
        this.raw = str;

        this.object = this.parse(str);
    }

    loadJSON(json: any, name?: string): void {
        if(name)
            this._name = name;

        this.raw = this.parseJSON(json);

        this.object = json;
    }

    async loadUrl(url: string, name?: string): Promise<void> {
        const json = await this.http.getJSON(url);

        this.loadJSON(json, name);
    }

    async loadFile(path: string, name?: string): Promise<void> {
        const jsonString = await this.fileSystem.read(path);
        
        this.load(jsonString, name);
    }

    async dump(dir?: string): Promise<string> {
        if(!this.raw || !this.object) {
            throw new Error('No valid JSON string');
        } else if (!this._name) {
            throw new Error('No interface name');
        }

        let ts;
        if(Array.isArray(this.object)){
            ts = this.transformJsonArray(this._name, this.object);
        }
        else {
            ts = this.transform(this._name, this.object);
        }

        const fileName = await this.fileSystem.write(ts, '.ts', this._name, dir);

        const compiled: boolean = this.compiler.compile(fileName);

        if(!dir || !compiled){
            this.fileSystem.delete(fileName);
        }

        this.fileSystem.delete(fileName.replace(/.ts$/, '.js'));

        if(!compiled){
            throw new Error(`Compiler error \n\n parser output: \n ${ts}`);
        }

        return ts;
    }

    private loadEntity(entity: string, name?: string): Promise<void> {
        if(/^http/.test(entity)){
            return this.loadUrl(entity, name);
        }
        else if(/\.json$/.test(entity)){
            return this.loadFile(entity, name);
        }
        else{
            this.load(entity, name);
        }

        return Promise.resolve();
    }

    private getEntityName(entity: string): string {
        let name = '';

        if(/^http/.test(entity)){
            const urlparts = entity.split('/');

            let part = urlparts.pop();

            if(part === '/')
                part = urlparts.pop();

            if(part && parseInt(part))
                part = urlparts.pop();

            if(part)
                name = part;
        }
        else if(/\.json$/.test(entity)){
            const fileParts = entity.replace(/\.json$/, '').split('/');
            name = fileParts[fileParts.length - 1];
        }
        else{
            name = `${new Date().getTime()}`;
        }

        return name;
    }

    private parse(str: string): any {
        try {
            return JSON.parse(str);
        } catch(e) {
            throw new Error(`Invalid JSON ${this.raw} ${e}`);
        }
    }

    private parseJSON(json: any): string {
        try {
            return JSON.stringify(json);
        } catch(e) {
            throw new Error(`Invalid JSON ${e}`);
        }
    }

    private transform(name: string, object: any, anyTypeKeys?: string[], optionalKeys?: string[]): string {
        let val, type, isObject;
        let ts: string = this.getName(name);
        let arrayTransformResponse: ArrayTransformResponse;
        let optional = false;

        let interfaces = new Array<string>();

        Object.keys(object).map(key => {
            if(anyTypeKeys && anyTypeKeys.indexOf(key) > -1){
                ts += this.map(key, 'any');
                return;
            }
            
            optional = !!(optionalKeys && optionalKeys.indexOf(key) > -1);

            val = object[key];
            
            type = typeof(val);

            isObject = (type === 'object');

            if(isObject && Array.isArray(val)) {
                arrayTransformResponse = this.transformArray(key, val);

                if(arrayTransformResponse.interface)
                    interfaces.push(arrayTransformResponse.interface);

                type = arrayTransformResponse.type;
            }
            else if (isObject) {
                interfaces.push(this.transform(key, val));

                type = key;
            }

            key += optional ? '?' : '';

            ts += this.map(key, type);
        });

        ts += '}\n';

        ts += interfaces.map((interfaceObj: string) => interfaceObj).join('\n');

        return ts;
    }

    private transformJsonArray(name: string, object: any): string {
        const singular = name.replace(/s$/, '');

        const type = this.transformArray(singular, object);

        const ploralized = singular + 's';

        let ts = this.getType(ploralized, type.type);

        ts += `\n${type.interface}`;

        return ts;
    }

    private transformArray(name: string, object: Array<any>): ArrayTransformResponse {
        let val: any, type, isObject;
        let firstType: any;
        let pastObjectLookup: Array<string> = [];
        let pastObjects: Array<any> = [];
        let optionalKeys: Array<string> = [];
        let anyTypeKeys: Array<string> = [];
        let collision: boolean = false;
        let hasArray: boolean = false;


        const response: ArrayTransformResponse = {
            type: '',
            interface: ''
        }

        for(let i = 0; i < object.length; i++){
            val = object[i];

            type = typeof(val);

            isObject = (type === 'object');

            if(isObject && Array.isArray(val)){
                if(hasArray){
                    const arrayType = this.transformArray(name, val).type;

                    if(arrayType !== firstType){
                        firstType = 'Array<any>';
                    }
                } else {
                    hasArray = true;
                    firstType = this.transformArray(name, val).type;
                }
            }
            else if (isObject) {
                if(pastObjects.length && pastObjectLookup.indexOf(stringKeys(val)) < 0){
                    const theseKeys = sortedKeys(val);
                    const lastVal = object[i - 1];
                    const lastKeys = sortedKeys(lastVal);

                    theseKeys.map(key => {
                        let lastKeysIndex = lastKeys.indexOf(key);

                        if(lastKeysIndex === -1){
                            optionalKeys.push(key);
                        }
                        else if(typeof(val[key]) !== typeof(lastVal[key])){
                            anyTypeKeys.push(key);
                        }
                    });

                    lastKeys.map(key => {
                        let theseKeysIndex = theseKeys.indexOf(key);

                        if(theseKeysIndex === -1){
                            optionalKeys.push(key);
                        }
                        else if(typeof(val[key]) !== typeof(lastVal[key])){
                            anyTypeKeys.push(key);
                        }
                    })

                    response.interface = this.transform(name, val, anyTypeKeys, optionalKeys);
                }
                else {
                    const interfaceVal = this.transform(name, val);

                    if(!response.interface){
                        response.interface = interfaceVal;
                    }
                    else if(response.interface !== interfaceVal){
                        collision = true;
                    }
                }

                firstType = name;

                pastObjectLookup.push(stringKeys(val));
                pastObjects.push(val);
            }
            else if(!firstType) {
                firstType = type;
            } else if(type !== firstType) {
                return anyType();
            }
        }

        response.type = `Array<${firstType}>`;

        if(collision)
            return this.handleCollision(name, response, object);

        return response;

        function sortedKeys(val: any): string[] {
            return Object.keys(val).sort();
        }

        function stringKeys(val: any): string {
            return JSON.stringify(sortedKeys(val));
        }

        function anyType(): ArrayTransformResponse {
            response.type = 'Array<any>';
            response.interface = '';

            return response;
        }
    }

    private handleCollision(name: string, response: ArrayTransformResponse, arr: Array<any>): ArrayTransformResponse {
        const mixedKeys: Array<string> = [];

        arr.map((obj, index) => {
            if(!index)
                return;

            Object.keys(obj).map(key => {
                if(typeof(obj[key]) !== typeof(arr[index - 1][key]) && mixedKeys.indexOf(key) < 0)
                    mixedKeys.push(key);
            });
        });

        response.interface = this.transform(name, arr[0], mixedKeys);

        return response;
    }

    private getName(name: string): string {
        return `export interface ${name} {\n`;
    }

    private getType(name: string, value: string): string {
        return `export type ${name} = ${value};`;
    }

    private map(key: string, type: string): string {
        return `\t${key}: ${type};\n`;
    }
}
