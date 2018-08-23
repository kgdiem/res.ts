import { Generator } from "./generator";
import { FileSystem } from "./util";

export class GeneratorFactory {
    static create(): Generator {
        return new Generator(new FileSystem());
    }
}