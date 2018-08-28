import { Http } from "../../lib/util";

export class MockHttp extends Http {
    constructor(){
        super();

        this.getJSON = jasmine.createSpy();
    }
}