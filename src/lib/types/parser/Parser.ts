import { ParserMetaData } from "./ParserMetaData";

export interface Parser {
    load(str: string, name?: string): void;
    loadJSON(json: any, name?: string): void;
    loadFile(path: string, name?: string): Promise<void>;
    dump(dir?: string): Promise<string>;
    process(dir: string, entities: string[]): void;
    metadata: ParserMetaData;
}