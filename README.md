winston-memory
==============

Memory logger for winston

Install
==============

```sh
$ npm install winston-memory
```


Use
==============

Hook it up to winston like this:

```js
var winston = require('winston');
require('winston-memory').Memory;

winston.add(cli.output.transports.Memory);
winston.remove(cli.output.transports.Console);
```

And you're ready to go. When you need to access your logged info, just access:

```js
var transport = winston['default'].transports['memory'];

// Arrays with output and error lines
var outputs = transport.writeOutput;
var errors = transport.errorOutput;
```