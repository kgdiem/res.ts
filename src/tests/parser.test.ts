import { Parser } from '../lib/public_api';

const tabNewline = /\n|\t/g;

test('Parses string key as string', () => {
    const parser = new Parser('{"test": "a"}', "test");

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {test: string;}");
});

test('Parses number key as number', () => {
    const parser = new Parser('{"test": 1}', "test");

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {test: number;}");
});

test('Parses boolean key as boolean', () => {
    const parser = new Parser('{"test": false, "test2": true}', "test");

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {test: boolean;test2: boolean;}");
});

test('Parses string array as string array', () => {
    const parser = new Parser('{"test": ["a", "b", "c"]}', "test");

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {test: Array<string>;}");
});

test('Parses number array as number array', () => {
    const parser = new Parser('{"test": [1,2,3]}', "test");

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {test: Array<number>;}");
});

test('Parses boolean array as boolean array', () => {
    const parser = new Parser('{"test": [true, false, true]}', "test");

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {test: Array<boolean>;}");
});

test('Parses mixed array as any array', () => {
    const parser = new Parser('{"test": ["a", 1, true]}', "test");

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {test: Array<any>;}");

    parser.load('{"test": ["a", 1]}');

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {test: Array<any>;}");

    parser.load('{"test": ["a", true]}');

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {test: Array<any>;}");

    parser.load('{"test": [1, true]}');

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {test: Array<any>;}");

    parser.load('{"test": [{}, 1, true]}');

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {test: Array<any>;}");
});

test('Creates interface for array', () => {
    const parser = new Parser('{"obj": [{"p": 1}]}', "test");

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {obj: Array<obj>;}interface obj {p: number;}");
});

test('Creates nested interfaces', () => {
    const parser = new Parser('{"obj": {"p": 1}}', "test");

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {obj: obj;}interface obj {p: number;}");
});