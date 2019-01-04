import { Import } from "../types";

export const ServiceTemplates = {
    apiCallMethod: apiCallMethod,
    classImports: classImports,
    classOpen: (name: string) => `export class ${name} extends Service {\n`,
    close: (tab?: boolean) => `${tab ? '\t' : ''}}\n`,
    constructor: (args: string[]) => `${methodOpen('constructor', args, '')}\tsuper();\n${ServiceTemplates.close(true)}`,
    methodOpen: methodOpen,
};

function apiCallMethod(entity: string, name: string, args: string[], type: string, modifiers: string[] = ['async']) {
    if(!modifiers.indexOf('async'))
        modifiers.push('async');

    if(type.indexOf('Promise') === 0)
        type = type.replace(/Promise ?\</, '').replace(/\>$/, '');

    return `${methodOpen(name, args, `Promise<${type}>`, modifiers)}\tconst data: ${type} = await this._fetch(entity);\n\treturn data;`;
}

function classImports(imports: Import[]): string {
    const importStrings  = imports.map((importObj: Import) => `import ${importObj.name} from ${importObj.location}`);

    return ["import { Service } from './service';"].concat(importStrings).join('\n');
}

function methodOpen(name: string, args: string[], returnType: string = '', modifiers: string[] = []) {
    const modifierString = modifiers.length ? `${modifiers.join(' ')} ` : '';

    return `\t${modifierString}${name}(${args.join(',')}): ${returnType} {\n`
}