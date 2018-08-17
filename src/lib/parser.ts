export class Parser {
    private _name: string = '';
    private object: any;
    private raw: string = '';

    constructor(str?: string, name?: string) {
        if(str)
            this.load(str, name);
    }

    load(str: string, name?: string, ){
        if(name)
            this._name = name;
        this.raw = str;

        this.object = this.parse(str);
    }

    dump(){
        if(!this.raw || !this.object) {
            throw new Error('No valid JSON string');
        } else if (!this._name) {
            throw new Error('No interface name');
        }

        if(Array.isArray(this.object))
            throw new Error('Arrays cannot be transformed into an interface')

        return this.transform(this._name, this.object);
    }

    private parse(str: string){
        try {
            return JSON.parse(str);
        } catch(e) {
            throw new Error(`Invalid JSON ${e}`);
        }
    }

    private transform(name: string, object: any): string {
        let val, type, isObject;
        let ts: string = this.getName(name);
        let arrayTransformResponse: ArrayTransformResponse;

        let interfaces = new Array<string>();

        Object.keys(object).map(key => {
            val = object[key];
            
            type = typeof(val);

            isObject = (type === 'object');

            if(isObject && Array.isArray(val)) {
                arrayTransformResponse = this.transformArray(key, val);

                if(arrayTransformResponse.interface)
                    interfaces.push(arrayTransformResponse.interface);

                type = arrayTransformResponse.type;
            } else if (isObject) {
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

        const response: ArrayTransformResponse = {
            type: '',
            interface: ''
        }

        let pastObjects = [];

        for(let i = 0; i < object.length; i++){
            val = object[i];

            type = typeof(val);

            isObject = (type === 'object');

            if(isObject && Array.isArray(val)){
                
            }
            else if (isObject) {
                if(pastObjects.length && pastObjects.indexOf(stringKeys(val)) < 0){
                    return anyType();
                }

                response.interface = this.transform(name, val);
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

        return response;

        function stringKeys(val: any){
            return JSON.stringify(Object.keys(val).sort());
        }

        function anyType(){
            response.type = 'Array<any>';
            response.interface = '';

            return response;
        }
    }

    private getName(name: string){
        return `interface ${name} {\n`;
    }

    private map(key: string, type: string): string {
        return `\t${key}: ${type};\n`;
    }
}

interface ArrayTransformResponse {
    type: string,
    interface: string
}
