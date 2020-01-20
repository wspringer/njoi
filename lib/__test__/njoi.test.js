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
      Joi.object()
        .keys({
          first: Joi.string()
        })
        .label("Person")
    ),
    f: Joi.string().valid("a", "b", "c"),
    type: Joi.string().valid("condo", "appartment", "mansion")
  })
  .label("Simple")
  .unknown(true);

describe("njoi", () => {
  const njoi = require("../njoi");
  it("should a sensible description", () => {
    console.info(JSON.stringify(schema1.describe(), null, 2));
    console.info(njoi.markdown()(schema1));
    console.info(njoi.jsdoc()(schema1));
    expect(njoi.jsonish(schema1)).toMatchSnapshot();
  });

  it("should allow you to generate jsdoc", () => {
    const schema = schema1.keys({
      g: Joi.object()
        .pattern(
          Joi.string().valid("a", "b", "c"),
          Joi.object()
            .keys({
              top: Joi.number(),
              left: Joi.number()
            })
            .label("Coordinates")
        )
        .label("CoordinateHolder")
    });

    console.info(JSON.stringify(schema.describe(), null, 2));

    console.info(njoi.jsdoc()(schema));
  });
});
