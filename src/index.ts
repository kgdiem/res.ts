export * from './lib/public_api';

/*
example: 
import { Parser } from './lib/public_api';

const testJSON = `{
    "name": "test",
    "num": 1,
    "tt": {"p": 1},
    "numArr": [1,2,3],
    "test": ["a", "b"],
    "test2": [1, "a", true],
    "typedArrayTest": [{"a": 1}, {"a": 2}, {"a": 3}, {"a": "A"}],
    "booleanVal": true
}`;

const interfaceName = 'Test';

const parser = new Parser(testJSON, interfaceName);

console.log(parser.dump());
*/