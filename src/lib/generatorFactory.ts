import { Generator } from "./generator";
import { FileSystem, Compiler, Http } from "./util";
import { Parser } from "./parser";

export class GeneratorFactory {
    static create(rootDir?: string): Generator {
        const fileSystem = new FileSystem();
        const parser = new Parser(fileSystem, new Compiler(), new Http());

        return new Generator(fileSystem, parser, rootDir);
    }
}