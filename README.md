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
* None

# Todo
* Validate that interface compiles
* Add flat file options
* Write to file
* Wrap up library into a CLI