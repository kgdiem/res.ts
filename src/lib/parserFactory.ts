import { Parser } from "./parser";
import { FileSystem, Compiler } from "./util";

export class ParserFactory {
    static create(str?: string, name?: string): Parser {
        return new Parser(new FileSystem(), new Compiler(), str, name);
    }
}