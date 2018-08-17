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

# Known Issues:
* Variably typed object properties in array
  * Arrays of objects with the same keys but different types are ignored 
* Nested arrays unimplemented
  * ex, `{val: [[],[]]}`

# Todo
* tsc output to js folder
* Add HTTP options
* Add flat file options
* Wrap up library into a CLI