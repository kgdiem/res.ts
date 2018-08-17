import { Parser } from './lib';

const parser = new Parser('{"name": "poop", "num": 1, "tt": {"p": 1}, "crap": [1,2,3], "test": ["a", "b"], "test2": [1, "a", true], "typedArrayTest": [{"a": 1}, {"a": 2}, {"a": 3}, {"a": "A"}], "bb": true}', 'Test');

console.log(parser.dump());