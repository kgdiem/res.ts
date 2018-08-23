import { Parser } from "../parser";

export interface Generator {
    parser: Parser;
    project(entities: string[], path: string): Promise<string>;
    projectDir: string;
    root: string;
    typesDir: string;
}
