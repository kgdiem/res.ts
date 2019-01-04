import { MockFileSystem, MockCompiler, MockHttp } from './mocks';
import { Parser } from '../lib/parser';
import { tabNewline } from './helpers';

let parser;

const fs = new MockFileSystem();

const compiler = new MockCompiler();
const http = new MockHttp();

beforeEach(() => {
    parser = new Parser(fs, compiler, http)
});

test('Parses string key as string', async () => {
    parser.load('{"test": "a"}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: string;}");
});

test('Parses number key as number', async () => {
    parser.load('{"test": 1}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: number;}");
});

test('Parses boolean key as boolean', async () => {
    parser.load('{"test": false, "test2": true}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: boolean;test2: boolean;}");
});

test('Creates nested interfaces', async () => {
    parser.load('{"obj": {"p": 1}}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {obj: obj;}export interface obj {p: number;}");
});
