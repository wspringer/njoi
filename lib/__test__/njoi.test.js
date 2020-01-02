const Joi = require("@hapi/joi");

const schema1 = Joi.object()
  .keys({
    a: Joi.string()
      .required()
      .description(
        "Some string alkdsf jlkasj dfjklasj dfklj aklsj fkljaklsdfj klajs fklj aklsj fklja sklfjkl asjdfklj asklj klajsklfj aklsj dfklaskldfj klaj skldf jf"
      )
      .example("yay"),
    b: Joi.number()
      .description("Some number")
      .default(3),
    c: Joi.boolean().description("Some boolean"),
    d: Joi.array().items(Joi.string()),
    e: Joi.array().items(
      Joi.object().keys({
        first: Joi.string()
      })
    ),
    type: Joi.string().valid("condo", "appartment", "mansion")
  })
  .unknown(true);

describe("joidoc", () => {
  const joidoc = require("../njoi");
  it("should a sensible description", () => {
    console.info(JSON.stringify(schema1.describe(), null, 2));
    console.info(joidoc.markdown()(schema1));
    expect(joidoc.jsonish(schema1)).toMatchSnapshot();
  });
});
