import { ParserFactory } from '../lib/public_api';

const tabNewline = /\n|\t/g;

test('Parses string key as string', async () => {
    const parser = ParserFactory.create('{"test": "a"}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: string;}");
});

test('Parses number key as number', async () => {
    const parser = ParserFactory.create('{"test": 1}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: number;}");
});

test('Parses boolean key as boolean', async () => {
    const parser = ParserFactory.create('{"test": false, "test2": true}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: boolean;test2: boolean;}");
});

test('Creates nested interfaces', async () => {
    const parser = ParserFactory.create('{"obj": {"p": 1}}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {obj: obj;}export interface obj {p: number;}");
});
