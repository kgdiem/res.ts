import { ParserFactory } from '../lib/public_api';

const tabNewline = /\n|\t/g;

test('Parses JSON array of objects', async () => {
    const parser = ParserFactory.create('[{"test": "a"}]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<test>;export interface test {test: string;}");
});

test('Parses JSON array of objects with optionals', async () => {
    const parser = ParserFactory.create('[{"test": "a"}, {"test": "a", "optional": 1}]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<test>;export interface test {test: string;optional?: number;}");
});

test('Parses JSON array of objects with nested arrays', async () => {
    const parser = ParserFactory.create('[{"test": "a", "arr": [1,2,3]}, {"test": "a", "arr": [3,4,5]}]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<test>;export interface test {test: string;arr: Array<number>;}");
});

test('Parses JSON array of objects with nested json arrays', async () => {
    const parser = ParserFactory.create('[{"test": "a", "arr": [{"m": "a"}]}, {"test": "a", "arr": [{"m": "x"}]}]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<test>;export interface test {test: string;arr: Array<arr>;}export interface arr {m: string;}");
});

test('Returns type for json array of primatives', async () => {
    const parser = ParserFactory.create('["a"]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<string>;");

    parser.load('[1]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<number>;");

    parser.load('[true]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<boolean>;");
});

test('Returns typed array for nested array', async () => {
    const parser = ParserFactory.create('[["a"]]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<Array<string>>;");
});

test('Returns any array for nested array', async () => {
    const parser = ParserFactory.create('[["a"], [1]]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<Array<any>>;");
});