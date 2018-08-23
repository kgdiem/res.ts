import { Parser } from '../lib/public_api';

const tabNewline = /\n|\t/g;

test('Parses string array as string array', async () => {
    const parser = new Parser('{"test": ["a", "b", "c"]}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: Array<string>;}");
});

test('Parses number array as number array', async () => {
    const parser = new Parser('{"test": [1,2,3]}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: Array<number>;}");
});

test('Parses boolean array as boolean array', async () => {
    const parser = new Parser('{"test": [true, false, true]}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: Array<boolean>;}");
});

test('Parses mixed array as any array', async () => {
    const parser = new Parser('{"test": ["a", 1, true]}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: Array<any>;}");

    parser.load('{"test": ["a", 1]}');

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: Array<any>;}");

    parser.load('{"test": ["a", true]}');

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: Array<any>;}");

    parser.load('{"test": [1, true]}');

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: Array<any>;}");

    parser.load('{"test": [{}, 1, true]}');

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: Array<any>;}");
});

test('Parses nested arrays', async () => {
    const parser = new Parser('{"test": [["a"], ["b"]]}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: Array<Array<string>>;}");
});

test('Parses mixed nested arrays', async () => {
    const parser = new Parser('{"test": [["a"], [1]]}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: Array<Array<any>>;}");

    parser.load('{"test": [["a"], [1], [{}]]}');

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: Array<Array<any>>;}");
});

test('Parses mixed array with nested array', async () => {
    const parser = new Parser('{"test": [["a"], ["b"], "c", 1, 2, ["3"]]}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {test: Array<any>;}");
});

test('Creates interface for array', async () => {
    const parser = new Parser('{"obj": [{"p": 1}]}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {obj: Array<obj>;}export interface obj {p: number;}");
});

test('Creates any typed interface key for mixed type object key array', async () => {
    const parser = new Parser('{"obj": [{"p": 1}, {"p": "a"}]}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {obj: Array<obj>;}export interface obj {p: any;}");
});

test('Creates any typed interface key for mixed type object array', async () => {
    const parser = new Parser('{"obj": [{"p": 1}, {"p": "a", "m": "x"}]}', "test");

    expect((await parser.dump()).replace(tabNewline, '')).toBe("export interface test {obj: Array<any>;}");
});
