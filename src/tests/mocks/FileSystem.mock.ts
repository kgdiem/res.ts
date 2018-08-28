import { FileSystem } from "../../lib/util";

export class MockFileSystem extends FileSystem {
    constructor(){
        super();

        this.mkdir = jasmine.createSpy();
        this.delete = jasmine.createSpy();
        this.read = jasmine.createSpy();
        this.write = jasmine.createSpy().and.returnValue(Promise.resolve(' '));
    }
}
