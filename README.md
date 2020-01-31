<!--
  -- This file is auto-generated from ./README.js.md. Changes should be made there.
  -->

# README

An experiment to render a sensible JSON-alike structure from the Joi definition
to be copied in to (Github) fenced markdown sections.

If this is the Joi schema you're defining:

```javascript
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

```javascript
const njoi = require('njoi');
console.log(njoi.jsonish()(schema));

⇒ {
⇒   "name": <string>,
⇒   "age": <number>?,
⇒   "tags": [<string>, ...]?,
⇒   "address": {
⇒     "street": <string>?,
⇒     "houseNumber": <string>?,
⇒     "type": <"condo"|"appartment"|"mansion">?,
⇒     "city": <string>?,
⇒   }?,
⇒   "education": [{
⇒     "school": <string>?,
⇒     "degree": <boolean>?,
⇒   }, ...]?,
⇒ }
```

Or one including comments:

```javascript
console.log(njoi.jsonish({comments: true})(schema));

⇒ {
⇒   /**
⇒    * The given name
⇒    */
⇒   "name": <string>,
⇒ 
⇒   /**
⇒    * The age
⇒    */
⇒   "age": <number>?,
⇒ 
⇒   /**
⇒    * A set of tags to be a associated
⇒    */
⇒   "tags": [<string>, ...]?,
⇒ 
⇒   "address": {
⇒     /**
⇒      * The street
⇒      */
⇒     "street": <string>?,
⇒ 
⇒     /**
⇒      * The housenumber.
⇒      */
⇒     "houseNumber": <string>?,
⇒ 
⇒     "type": <"condo"|"appartment"|"mansion">?,
⇒ 
⇒     /**
⇒      * The city
⇒      */
⇒     "city": <string>?,
⇒   }?,
⇒ 
⇒   "education": [{
⇒     /**
⇒      * The school attended
⇒      */
⇒     "school": <string>?,
⇒ 
⇒     /**
⇒      * Got the degree or not
⇒      */
⇒     "degree": <boolean>?,
⇒   }, ...]?,
⇒ }
```

Or a markdown breakdown using:

```javascript
console.log(njoi.markdown()(schema));

⇒ ### name: _string_
⇒ 
⇒ The given name.
⇒ 
⇒ ### age: _number?_
⇒ 
⇒ The age. Defaults to `5`.
⇒ 
⇒ ### tags[]: _string?_
⇒ 
⇒ ### address.street: _string?_
⇒ 
⇒ The street.
⇒ 
⇒ ### address.houseNumber: _string?_
⇒ 
⇒ The housenumber.
⇒ 
⇒ ### address.type: _string?_
⇒ 
⇒ Set it to either `condo`, `appartment`, or `mansion`.
⇒ 
⇒ ### address.city: _string?_
⇒ 
⇒ The city.
⇒ 
⇒ ### education[].school: _string?_
⇒ 
⇒ The school attended.
⇒ 
⇒ ### education[].degree: _boolean?_
⇒ 
⇒ Got the degree or not.
⇒ 
⇒ 
```

Or a JSDoc breakdown using:

```javascript
console.log(njoi.jsdoc()(schema));

⇒ /**
⇒  * @typedef {Object} Person
⇒  * @property {string} name - The given name
⇒  * @property {number} [age=5] - The age
⇒  * @property {string[]} [tags] - A set of tags to be a associated
⇒  * @property {Address} [address]
⇒  * @property {Education[]} [education]
⇒  */
⇒ /**
⇒  * @typedef {Object} Address
⇒  * @property {string} [street] - The street
⇒  * @property {string} [houseNumber] - The housenumber.
⇒  * @property {('condo'|'appartment'|'mansion')} [type]
⇒  * @property {string} [city] - The city
⇒  */
⇒ /**
⇒  * @typedef {Object} Education
⇒  * @property {string} [school] - The school attended
⇒  * @property {boolean} [degree] - Got the degree or not
⇒  */
⇒ 
```


If you want, then can pass in a callback to have the ability to render some
additional lines:

```javascript
const envVariable = (node, context) => {
  if (context && context.indexOf('[]') < 0) {
    const name = context.split('.').map(str => str.toUpperCase()).join('_');
    return `Use the \`${name}\` environment variable to override this setting.`
  } else {
    return void 0;
  }
}

console.log(njoi.markdown({extra: envVariable})(schema));

⇒ ### name: _string_
⇒ 
⇒ The given name. Use the `NAME` environment variable to override this setting.
⇒ 
⇒ ### age: _number?_
⇒ 
⇒ The age. Defaults to `5`. Use the `AGE` environment variable to override this 
⇒ setting.
⇒ 
⇒ ### tags[]: _string?_
⇒ 
⇒ ### address.street: _string?_
⇒ 
⇒ The street. Use the `ADDRESS_STREET` environment variable to override this 
⇒ setting.
⇒ 
⇒ ### address.houseNumber: _string?_
⇒ 
⇒ The housenumber. Use the `ADDRESS_HOUSENUMBER` environment variable to override 
⇒ this setting.
⇒ 
⇒ ### address.type: _string?_
⇒ 
⇒ Use the `ADDRESS_TYPE` environment variable to override this setting. Set it to 
⇒ either `condo`, `appartment`, or `mansion`.
⇒ 
⇒ ### address.city: _string?_
⇒ 
⇒ The city. Use the `ADDRESS_CITY` environment variable to override this setting.
⇒ 
⇒ ### education[].school: _string?_
⇒ 
⇒ The school attended.
⇒ 
⇒ ### education[].degree: _boolean?_
⇒ 
⇒ Got the degree or not.
⇒ 
⇒ 
```


----
Markdown generated from [./README.js.md](README.js.md) by [![RunMD Logo](http://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)