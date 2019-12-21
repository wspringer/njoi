const Joi = require("@hapi/joi");
const html2text = require("html2text");

const schema1 = Joi.object().keys({
  a: Joi.string().describe("Some string"),
  b: Joi.number().describe("Some number"),
  c: Joi.number().describe("Some boolean")
});

describe("joidoc", () => {
  const joidoc = require("../joidoc");
  it("should render sensible html", () => {
    console.info(html2text(joidoc(schema1)));
  });
});
