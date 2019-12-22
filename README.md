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
  a: Joi.string().description('Some string value').default('go'),
  b: Joi.number().description('Some number').default(5),
  c: Joi.array().items(Joi.string()).description('An array of strings'),
  d: Joi.array().items(Joi.object().keys({
    e: Joi.boolean().description('Some boolean value')
  }))
});

```

… then you will be able to generate something a little easier on the eyes using:

```javascript
const joidoc = require('joidoc');
console.log(joidoc(schema));

⇒ {
⇒   /**
⇒    * Some string value
⇒    */
⇒   a: "go",
⇒ 
⇒   /**
⇒    * Some number
⇒    */
⇒   b: <number>,
⇒ 
⇒   /**
⇒    * An array of strings
⇒    */
⇒   c: [<string>, ...],
⇒ 
⇒   d: [{
⇒     /**
⇒      * Some boolean value
⇒      */
⇒     e: <boolean>,
⇒   }, ...],
⇒ }
```

----
Markdown generated from [./README.js.md](README.js.md) by [![RunMD Logo](http://i.imgur.com/h0FVyzU.png)](https://github.com/broofa/runmd)