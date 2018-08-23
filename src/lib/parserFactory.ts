import { Parser } from "./parser";
import { FileSystem, Compiler, Http } from "./util";

export class ParserFactory {
    static create(str?: string, name?: string): Parser {
        return new Parser(new FileSystem(), new Compiler(), new Http(), str, name);
    }
}