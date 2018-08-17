"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./lib/public_api"));
/*
example:
*/
const public_api_1 = require("./lib/public_api");
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
const parser = new public_api_1.Parser(testJSON, interfaceName);
parser.dump();
const http = new public_api_1.Http(parser);
const testHttp = () => __awaiter(this, void 0, void 0, function* () {
    const res = yield http.transformResponse('Test', 'https://jsonplaceholder.typicode.com/todos/1');
    console.log(res);
});
testHttp();
//*/
