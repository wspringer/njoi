const { isString, isUndefined, get, repeat } = require("lodash");
const { fromEntries, entries } = Object;
const wrap = require("word-wrap");

const indent = (out, depth) => out.write(repeat("  ", depth));

const transformPair = ([key, value]) => [key, transformNode(value)];

const quote = value =>
  !isUndefined(value) && isString(value) ? `"${value}"` : void 0;

const transformNode = node => {
  const comment = node.description;
  switch (node.type) {
    case "object": {
      return {
        type: "object",
        members: fromEntries(entries(node.children).map(transformPair)),
        comment
      };
    }
    case "array": {
      return {
        type: "array",
        items: transformNode(node.items[0]),
        comment
      };
    }
    default:
      return {
        type: node.type,
        value:
          quote(get(node, "examples[0].value")) ||
          quote(get(node, "flags.default")) ||
          `<${node.type}>`,
        comment
      };
  }
};

renderPair = (out, depth) => ([key, node], index) => {
  if (index !== 0) out.write("\n");
  if (node.comment) {
    indent(out, depth);
    out.write("/**\n");
    out.write(wrap(node.comment, { indent: repeat("  ", depth) + " * " }));
    out.write("\n");
    indent(out, depth);
    out.write(" */\n");
  }
  indent(out, depth);
  out.write(key);
  out.write(": ");
  renderNode(node, out, depth);
  out.write(",\n");
};

renderNode = (node, out, depth = 0) => {
  switch (node.type) {
    case "object": {
      out.write("{\n");
      entries(node.members).forEach(renderPair(out, depth + 1));
      indent(out, depth);
      out.write("}");
      break;
    }
    case "array": {
      out.write("[");
      renderNode(node.items, out, depth);
      out.write(", ...]");
      break;
    }
    default: {
      out.write(node.value);
      break;
    }
  }
};

const buffer = () => {
  let internal = "";
  return {
    write: str => (internal += str),
    get: () => internal
  };
};

module.exports = (schema, stream) => {
  const target = stream || buffer();
  renderNode(transformNode(schema.describe()), target);
  return stream ? void 0 : target.get();
};
