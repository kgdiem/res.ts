import { Compiler } from "../../lib/util";

export class MockCompiler extends Compiler {
    constructor(){
        super();

        this.compile = jasmine.createSpy().and.returnValue(true);
    }
}