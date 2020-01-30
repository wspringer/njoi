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
    expect(njoi.jsonish({ comments: true })(schema1)).toMatchSnapshot();
  });

  it("should allow you to generate jsdoc", () => {
    const schema = schema1.keys({
      g: Joi.object()
        .pattern(
          Joi.string()
            .valid("a", "b", "c")
            .description("The first three characters."),
          Joi.object()
            .keys({
              top: Joi.number().description("The top coordinate"),
              left: Joi.number().description("The left coordinate")
            })
            .label("Location")
        )
        .description("The coordinates indexed by characters")
        .label("CoordinateHolder")
    });

    // console.info(JSON.stringify(schema.describe(), null, 2));

    expect(njoi.jsonish({ comments: false })(schema)).toMatchSnapshot();
    expect(njoi.jsdoc()(schema)).toMatchSnapshot();
    console.info(njoi.jsonish({ comments: false })(schema));
  });
});
