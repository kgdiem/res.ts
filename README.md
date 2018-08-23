# res.ts 
Create TypeScript Interfaces with JSON samples

Inspired by wsdl2java, etc.

# Current State:
Basic parsing is implemented. There are plenty of shortcomings/oversights. See known issues

# Usage: 

```
const parser = new Parser([json string?], [interface name?]);
parser.load([json string], [interface name]);
parser.dump() // dumps string interface[s]
```

# Examples:
```
import { ParserFactory, GeneratorFactory, Http } from './lib/public_api';

const testJSON = `{
    "name": "test",
    "num": 1,
    "tt": {"p": 1},
    "numArr": [1,2,3],
    "test": ["a", "b"],
    "test2": [1, "a", true],
    "typedArrayTest": [{"a": 1}, {"a": 2}, {"a": 3}, {"a": "A"}],
    "booleanVal": true
}`;

const interfaceName = 'Test';

const parser = ParserFactory.create(testJSON, interfaceName);
const generator = GeneratorFactory.create();

const testParser = async () => {
    const res: string = await parser.dump();

    console.log(res);
}

const testParserWriteFile = async () => {
    const res: string = await parser.dump('./test');

    console.log(res);
}
testParser();
testParserWriteFile();

const testParserReadFile = async () => {
    await parser.loadFile('./src/tests/test.json', interfaceName);

    const res = await parser.dump();

    console.log(res);
}

testParserReadFile();

const http = new Http(parser);

const testHttp = async () => {
    const res: string = await http.transformResponse('Test', 'https://jsonplaceholder.typicode.com/todos/1');

    console.log(res);
}

testHttp();

// Creates project directory
generator.project();

// Creates types folder inside project directory
generator.types();

// Creates types inside type folder
parser.dump(generator.typesDir);
```

# Known Issues:

# Todo:
* Generate services
* Refactor
* Wrap up library into a CLI
