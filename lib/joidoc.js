const path = require("path");
const pug = require("pug");

render = pug.compileFile(path.resolve(__dirname, "./joidoc.html.pug"));

module.exports = schema => render({ desc: schema.describe() });
