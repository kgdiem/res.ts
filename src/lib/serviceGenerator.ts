import { ParserMetaData, ApiDefinition, Entity} from "./types";
import { FileSystem, Compiler } from "./util";

import { ServiceTemplates } from './templates';

export class ServiceGenerator {
    private fs: FileSystem;
    private compiler: Compiler;

    constructor(fs: FileSystem, compiler: Compiler) {
        this.fs = fs;
        this.compiler = compiler;
    }

    createService(metadata: ParserMetaData, entity: Entity) {
        let service = ServiceTemplates.classOpen(metadata.name);

        service += ServiceTemplates.constructor([]);

        service = this.addMethods(service, entity)
    }

    private addMethods(service: string, entity: Entity): string {

        entity.methods.forEach(method => {
            service += ServiceTemplates.apiCallMethod(entity.url, entity.name, [], entity.name);
        });

        return service;
    }
}