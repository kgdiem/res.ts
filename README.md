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

# Todo
* Add flat file options
* Wrap up library into a CLI
