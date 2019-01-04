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

test('Creates metadata object for simple object', async () => {
    parser.load('{"test": "a"}', "test");

    await parser.dump();

    expect(parser.metadata).toBeDefined();
    expect(parser.metadata).toBeTruthy();

    expect(parser.metadata.interfaces).toBeDefined();
    expect(parser.metadata.interfaces.length).toBe(1);

    expect(parser.metadata.types).toBeDefined();
    expect(parser.metadata.types.length).toBe(0);

    const interfaceObject = parser.metadata.interfaces[0];

    expect(interfaceObject.name).toBeDefined();
    expect(interfaceObject.name).toBe('test');

    expect(interfaceObject.entity).toBeDefined();
    expect(interfaceObject.entity.replace(tabNewline, '')).toBe("export interface test {test: string;}");

    expect(interfaceObject.props).toBeDefined();
    expect(interfaceObject.props.length).toBe(1);

    const prop = interfaceObject.props[0];

    expect(prop.key).toBe('test');
    expect(prop.type).toBe('string');

});

test('Creates types for array', async () => {
    parser.load('["a", "a"]', "test");

    const output = await parser.dump();

    expect(parser.metadata).toBeDefined();
    expect(parser.metadata).toBeTruthy();

    expect(parser.metadata.interfaces).toBeDefined();
    expect(parser.metadata.interfaces.length).toBe(0);

    expect(parser.metadata.types).toBeDefined();
    expect(parser.metadata.types.length).toBe(1);

    const type = parser.metadata.types[0];

    expect(type).toBeDefined();

    expect(type.type).toBe('Array<string>');
    expect(type.name).toBe('tests');

    expect(output.replace(tabNewline, '')).toBe('export type tests = Array<string>;');
});
