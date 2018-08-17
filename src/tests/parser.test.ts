import { Parser } from '../lib/public_api';

const tabNewline = /\n|\t/g;

test('Parses string key as string', () => {
    const parser = new Parser('{"test": "a"}', "test");

    expect(parser.dump().replace(tabNewline, '')).toBe("interface test {test: string;}");
});