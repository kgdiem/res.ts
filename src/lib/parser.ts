import { ArrayTransformResponse } from './types';

import { Compiler } from './compiler';
import { Writer } from './writer';

export class Parser {
    private _name: string = '';
    private object: any;
    private raw: string = '';

    constructor(str?: string, name?: string) {
        if(str)
            this.load(str, name);
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

    async dump(): Promise<string> {
        if(!this.raw || !this.object) {
            throw new Error('No valid JSON string');
        } else if (!this._name) {
            throw new Error('No interface name');
        }

        if(Array.isArray(this.object))
            throw new Error('Arrays cannot be transformed into an interface');

        const ts = this.transform(this._name, this.object);

        const fileName = await Writer.write(ts, '.ts');

        const compiled: boolean = Compiler.compile(fileName);

        Writer.delete(fileName);

        if(!compiled){
            throw new Error(`Compiler error`);
        }

        return ts;
    }

    private parse(str: string): any {
        try {
            return JSON.parse(str);
        } catch(e) {
            throw new Error(`Invalid JSON ${e}`);
        }
    }

    private parseJSON(json: any): string {
        try {
            return JSON.stringify(json);
        } catch(e) {
            throw new Error(`Invalid JSON ${e}`);
        }
    }

    private transform(name: string, object: any, anyTypeKeys?: string[]): string {
        let val, type, isObject;
        let ts: string = this.getName(name);
        let arrayTransformResponse: ArrayTransformResponse;

        let interfaces = new Array<string>();

        Object.keys(object).map(key => {
            if(anyTypeKeys && anyTypeKeys.indexOf(key) > -1){
                ts += this.map(key, 'any');
                return;
            }

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

            ts += this.map(key, type);
        });

        ts += '}\n';

        ts += interfaces.map((interfaceObj: string) => interfaceObj).join('\n');

        return ts;
    }

    private transformArray(name: string, object: Array<any>): ArrayTransformResponse {
        let val, type, isObject;
        let firstType: any;
        let pastObjects: Array<string> = [];
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
                if(pastObjects.length && pastObjects.indexOf(stringKeys(val)) < 0){
                    return anyType();
                }

                const interfaceVal = this.transform(name, val);

                if(!response.interface){
                    response.interface = interfaceVal;
                }
                else if(response.interface !== interfaceVal){
                    collision = true;
                }
                
                firstType = name;

                pastObjects.push(stringKeys(val));
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

        function stringKeys(val: any): string {
            return JSON.stringify(Object.keys(val).sort());
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

    private map(key: string, type: string): string {
        return `\t${key}: ${type};\n`;
    }
}
