const { initial, last, isString, isUndefined, get, repeat } = require("lodash");
const { fromEntries, entries } = Object;
const wrap = require("word-wrap");

const indent = (out, depth) => out.write(repeat("  ", depth));

const transformPair = ([key, value]) => [key, transformNode(value)];

const quote = value =>
  !isUndefined(value) && isString(value) ? `"${value}"` : void 0;

const transformNode = node => {
  const comment = [node.description].join("\n");
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

const jsonish = (schema, stream) => {
  const target = stream || buffer();
  renderNode(transformNode(schema.describe()), target);
  return stream ? void 0 : target.get();
};

const endWithPeriod = str => {
  const trimmed = str.trim();
  return trimmed.length > 0 && trimmed.charAt(trimmed.length - 1) !== "."
    ? `${trimmed}.`
    : trimmed;
};

const typeDescriptor = node => {
  return get(node, "flags.presence") === "required"
    ? node.type
    : `${node.type}?`;
};

const markdown = (opts = {}) => {
  opts.heading = opts.heading || "###";
  opts.width = opts.width || 80;
  const render = (node, out, context) => {
    switch (node.type) {
      case "object": {
        entries(node.children).forEach(([key, child]) =>
          render(child, out, isUndefined(context) ? key : `${context}.${key}`)
        );
        break;
      }
      case "array": {
        render(node.items[0], out, `${context}[]`);
        break;
      }
      default: {
        out.write(`${opts.heading} ${context}: _${typeDescriptor(node)}_\n\n`);
        const valids = node.valids
          ? node.valids.map(str => `\`${str}\``)
          : void 0;
        const lines = [
          node.description ? endWithPeriod(node.description) : void 0,
          get(node, "flags.default")
            ? `Defaults to \`${get(node, "flags.default")}\`.`
            : void 0,
          opts.extra ? opts.extra(node, context) : void 0,
          valids
            ? `Set it to either ${[
                initial(valids).join(", "),
                last(valids)
              ].join(", or ")}.`
            : void 0
        ].filter(line => !isUndefined(line));
        if (lines.length > 0) {
          out.write(wrap(lines.join(" "), { indent: "", width: opts.width }));
          out.write("\n\n");
        }
        break;
      }
    }
  };
  return (schema, stream) => {
    const target = stream || buffer();
    render(schema.describe(), target);
    return stream ? void 0 : target.get();
  };
};

const jsdoc = (opts = {}) => {
  const getType = node => {
    switch (node.type) {
      case "object": {
        return node.label || "Object";
      }
      case "array": {
        return node.items[0] ? `${getType(node.items[0])}[]` : "Array";
      }
      case "string": {
        const valids = node.valids
          ? node.valids.map(str => `'${str}'`)
          : void 0;
        return valids ? `(${valids.join("|")})` : node.type;
      }
      default: {
        return node.type;
      }
    }
  };
  const render = (node, out) => {
    switch (node.type) {
      case "object": {
        if (
          node.patterns &&
          node.patterns[0].schema &&
          node.patterns[0].schema.type === "string" &&
          node.patterns[0].schema.valids
        ) {
          out.write("/**\n");
          if (node.description) {
            out.write(` * ${node.description}\n`);
          }
          out.write(
            ` * @typedef {Object.<string,${getType(node.patterns[0].rule)}>} ${
              node.label
            } - Valid keys: ${node.patterns[0].schema.valids
              .map(value => `'${value}'`)
              .join(", ")}\n`
          );
          out.write(" */\n");
          render(node.patterns[0].rule, out);
        } else {
          out.write("/**\n");
          if (node.description) {
            out.write(` * ${node.description}\n`);
          }
          out.write(` * @typedef {Object} ${node.label}\n`);
          entries(node.children).forEach(([key, child]) => {
            const keyRepr =
              get(child, "flags.presence") === "required"
                ? key
                : get(child, "flags.default")
                ? `[${key}=${get(child, "flags.default")}]`
                : `[${key}]`;
            const descr = child.description ? ` - ${child.description}` : "";
            out.write(` * @property {${getType(child)}} ${keyRepr}${descr}\n`);
          });
          out.write(" */\n");
          entries(node.children).forEach(([key, child]) => {
            render(child, out);
          });
        }
        break;
      }
      case "array": {
        if (node.items[0]) render(node.items[0], out);
        break;
      }
    }
  };
  return (schema, stream) => {
    const target = stream || buffer();
    render(schema.describe(), target);
    return stream ? void 0 : target.get();
  };
};

const buffer = () => {
  let internal = "";
  return {
    write: str => (internal += str),
    get: () => internal
  };
};

module.exports = { jsonish, markdown, jsdoc };
