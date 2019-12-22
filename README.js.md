```javascript --hide
runmd.onRequire = function(path) {
  if (path === 'joidoc') {
    return './lib/joidoc.js';
  } else {
    return path;
  }
}
```

# README

An experiment to render a sensible JSON-alike structure from the Joi definition
to be copied in to (Github) fenced markdown sections.

If this is the Joi schema you're defining:

```javascript --run simple
const Joi = require('@hapi/joi');
const schema = Joi.object().keys({
  a: Joi.string().description('Some string value').default('go'),
  b: Joi.number().description('Some number').default(5),
  c: Joi.array().items(Joi.string()).description('An array of strings'),
  d: Joi.array().items(Joi.object().keys({
    e: Joi.boolean().description('Some boolean value')
  }))
});
```

… then you will be able to generate something a little easier on the eyes using:

```javascript --run simple
const joidoc = require('joidoc');
console.log(joidoc(schema));
```
