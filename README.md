# res.ts 
## Create TypeScript Interfaces with JSON samples
### Inspired by wsdl2java, etc.

# Current State:
Basic parsing is implemented. There are plenty of shortcomings/oversights. See known issues

# Known Issues:
* Variably typed object properties in array
  * Arrays of objects with the same keys but different types are ignored 

# Todo
* Type check array objects
* Add HTTP options
* Add flat file options
* Wrap up library into a CLI