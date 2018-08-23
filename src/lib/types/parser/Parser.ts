export interface Parser {
    load(str: string, name?: string): void;
    loadJSON(json: any, name?: string): void;
    loadFile(path: string, name?: string): Promise<void>;
    dump(dir?: string): Promise<string>;
}