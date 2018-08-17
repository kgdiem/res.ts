import { Parser } from './parser';
import fetch, { Response, Headers } from 'node-fetch';

export class Http {
    private parser: Parser;

    constructor(parser: Parser){
        this.parser = parser;
    }

    async transformResponse(entity: string, url: string, headers?: string): Promise<string> {
        const res: Response = await fetch(url, this.fetchInit(headers));

        if(!res.ok)
            throw new Error(`Couldn't fetch ${entity}, response ${res.status} ${res.statusText}`);

        const data = await res.json();

        this.parser.loadJSON(data, entity);

        return this.parser.dump();
    }

    private fetchInit(headers?: string): any {
        const headerObject: any = {};

        if(headers)
            this.formatHeaders(headers, headerObject);

        return {
            method: 'GET',
            redirect: 'follow',
            headers: new Headers(headerObject)
        };
    }

    private formatHeaders(headers: string, headerObject: any) {
        const allHeaders = headers.split(';');

        allHeaders.map(header => {
            const headerArr = header.split(' ');

            headerObject[headerArr[0]] = headerArr.splice(0, 1).join(' ');
        });
    }
}
