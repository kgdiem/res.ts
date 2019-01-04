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

test('Parses JSON array of objects', async () => {
    parser.load('[{"test": "a"}]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<test>;export interface test {test: string;}");
});

test('Parses JSON array of objects with optionals', async () => {
    parser.load('[{"test": "a"}, {"test": "a", "optional": 1}]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<test>;export interface test {test: string;optional?: number;}");
});

test('Parses JSON array of objects with nested arrays', async () => {
    parser.load('[{"test": "a", "arr": [1,2,3]}, {"test": "a", "arr": [3,4,5]}]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<test>;export interface test {test: string;arr: Array<number>;}");
});

test('Parses JSON array of objects with nested json arrays', async () => {
    parser.load('[{"test": "a", "arr": [{"m": "a"}]}, {"test": "a", "arr": [{"m": "x"}]}]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<test>;export interface test {test: string;arr: Array<arr>;}export interface arr {m: string;}");
});

test('Returns type for json array of primatives', async () => {
    parser.load('["a"]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<string>;");

    parser.load('[1]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<number>;");

    parser.load('[true]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<boolean>;");
});

test('Returns typed array for nested array', async () => {
    parser.load('[["a"]]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<Array<string>>;");
});

test('Returns any array for nested array', async () => {
    parser.load('[["a"], [1]]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<Array<any>>;");
});