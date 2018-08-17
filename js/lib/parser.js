"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parser {
    constructor(str, name) {
        this._name = '';
        this.raw = '';
        if (str)
            this.load(str, name);
    }
    load(str, name) {
        if (name)
            this._name = name;
        this.raw = str;
        this.object = this.parse(str);
    }
    loadJSON(json, name) {
        if (name)
            this._name = name;
        this.raw = this.parseJSON(json);
        this.object = json;
    }
    dump() {
        if (!this.raw || !this.object) {
            throw new Error('No valid JSON string');
        }
        else if (!this._name) {
            throw new Error('No interface name');
        }
        if (Array.isArray(this.object))
            throw new Error('Arrays cannot be transformed into an interface');
        return this.transform(this._name, this.object);
    }
    parse(str) {
        try {
            return JSON.parse(str);
        }
        catch (e) {
            throw new Error(`Invalid JSON ${e}`);
        }
    }
    parseJSON(json) {
        try {
            return JSON.stringify(json);
        }
        catch (e) {
            throw new Error(`Invalid JSON ${e}`);
        }
    }
    transform(name, object, anyTypeKeys) {
        let val, type, isObject;
        let ts = this.getName(name);
        let arrayTransformResponse;
        let interfaces = new Array();
        Object.keys(object).map(key => {
            if (anyTypeKeys && anyTypeKeys.indexOf(key) > -1) {
                ts += this.map(key, 'any');
                return;
            }
            val = object[key];
            type = typeof (val);
            isObject = (type === 'object');
            if (isObject && Array.isArray(val)) {
                arrayTransformResponse = this.transformArray(key, val);
                if (arrayTransformResponse.interface)
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
        ts += interfaces.map((interfaceObj) => interfaceObj).join('\n');
        return ts;
    }
    transformArray(name, object) {
        let val, type, isObject;
        let firstType;
        let pastObjects = [];
        let collision = false;
        let hasArray = false;
        const response = {
            type: '',
            interface: ''
        };
        for (let i = 0; i < object.length; i++) {
            val = object[i];
            type = typeof (val);
            isObject = (type === 'object');
            if (isObject && Array.isArray(val)) {
                if (hasArray) {
                    const arrayType = this.transformArray(name, val).type;
                    if (arrayType !== firstType) {
                        firstType = 'Array<any>';
                    }
                }
                else {
                    hasArray = true;
                    firstType = this.transformArray(name, val).type;
                }
            }
            else if (isObject) {
                if (pastObjects.length && pastObjects.indexOf(stringKeys(val)) < 0) {
                    return anyType();
                }
                const interfaceVal = this.transform(name, val);
                if (!response.interface) {
                    response.interface = interfaceVal;
                }
                else if (response.interface !== interfaceVal) {
                    collision = true;
                }
                firstType = name;
                pastObjects.push(stringKeys(val));
            }
            else if (!firstType) {
                firstType = type;
            }
            else if (type !== firstType) {
                return anyType();
            }
        }
        response.type = `Array<${firstType}>`;
        if (collision)
            return this.handleCollision(name, response, object);
        return response;
        function stringKeys(val) {
            return JSON.stringify(Object.keys(val).sort());
        }
        function anyType() {
            response.type = 'Array<any>';
            response.interface = '';
            return response;
        }
    }
    handleCollision(name, response, arr) {
        const mixedKeys = [];
        arr.map((obj, index) => {
            if (!index)
                return;
            Object.keys(obj).map(key => {
                if (typeof (obj[key]) !== typeof (arr[index - 1][key]) && mixedKeys.indexOf(key) < 0)
                    mixedKeys.push(key);
            });
        });
        response.interface = this.transform(name, arr[0], mixedKeys);
        return response;
    }
    getName(name) {
        return `interface ${name} {\n`;
    }
    map(key, type) {
        return `\t${key}: ${type};\n`;
    }
}
exports.Parser = Parser;
