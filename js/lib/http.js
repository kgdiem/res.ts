"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importStar(require("node-fetch"));
class Http {
    constructor(parser) {
        this.parser = parser;
    }
    transformResponse(entity, url, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield node_fetch_1.default(url, this.fetchInit(headers)); // get data
            if (!res.ok)
                throw new Error(`Couldn't fetch ${entity}, response ${res.status} ${res.statusText}`);
            const data = yield res.json();
            this.parser.loadJSON(data, entity);
            return this.parser.dump();
        });
    }
    fetchInit(headers) {
        const headerObject = {};
        if (headers)
            this.formatHeaders(headers, headerObject);
        return {
            method: 'GET',
            redirect: 'follow',
            headers: new node_fetch_1.Headers(headerObject)
        };
    }
    formatHeaders(headers, headerObject) {
        const allHeaders = headers.split(';');
        allHeaders.map(header => {
            const headerArr = header.split(' ');
            headerObject[headerArr[0]] = headerArr.splice(0, 1).join(' ');
        });
    }
}
exports.Http = Http;
