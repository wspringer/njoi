```javascript --hide
runmd.onRequire = function(path) {
  if (path === 'njoi') {
    return './lib/njoi.js';
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
  name: Joi.string().description('The given name').required(),
  age: Joi.number().description('The age').default(5),
  tags: Joi.array().items(Joi.string()).description('A set of tags to be a associated'),
  address: Joi.object().keys({
    street: Joi.string().description('The street'),
    houseNumber: Joi.string().description('The housenumber.'),
    type: Joi.string().valid('condo', 'appartment', 'mansion'),
    city: Joi.string().description('The city')
  }).label('Address'),
  education: Joi.array().items(Joi.object().keys({
    school: Joi.string().description('The school attended'),
    degree: Joi.boolean().description('Got the degree or not')
  }).label('Education'))
}).label('Person');
```

… then you will be able to generate something a little easier on the eyes using:

```javascript --run simple
const njoi = require('njoi');
console.log(njoi.jsonish()(schema));
```

Or one including comments:

```javascript --run simple
console.log(njoi.jsonish({comments: true})(schema));
```

Or a markdown breakdown using:

```javascript --run simple
console.log(njoi.markdown()(schema));
```

Or a JSDoc breakdown using:

```javascript --run simple
console.log(njoi.jsdoc()(schema));
```


If you want, then can pass in a callback to have the ability to render some
additional lines:

```javascript --run simple
const envVariable = (node, context) => {
  if (context && context.indexOf('[]') < 0) {
    const name = context.split('.').map(str => str.toUpperCase()).join('_');
    return `Use the \`${name}\` environment variable to override this setting.`
  } else {
    return void 0;
  }
}

console.log(njoi.markdown({extra: envVariable})(schema));
```

