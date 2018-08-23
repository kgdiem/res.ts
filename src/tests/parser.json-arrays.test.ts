import { Parser } from '../lib/public_api';

const tabNewline = /\n|\t/g;

test('Parses JSON array of objects', async () => {
    const parser = new Parser('[{"test": "a"}]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<test>;export interface test {test: string;}");
});

test('Parses JSON array of objects with optionals', async () => {
    const parser = new Parser('[{"test": "a"}, {"test": "a", "optional": 1}]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<test>;export interface test {test: string;optional?: number;}");
});

test('Returns type for json array of primatives', async () => {
    const parser = new Parser('["a"]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<string>;");

    parser.load('[1]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<number>;");

    parser.load('[true]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<boolean>;");
});

test('Returns typed array for nested array', async () => {
    const parser = new Parser('[["a"]]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<Array<string>>;");
});

test('Returns any array for nested array', async () => {
    const parser = new Parser('[["a"], [1]]', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export type tests = Array<Array<any>>;");
});