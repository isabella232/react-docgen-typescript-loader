import validate from "@webpack-contrib/schema-utils";
import LoaderOptions from "./LoaderOptions";

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tsconfigPath: {
      type: "string",
      minLength: 1,
    },

    compilerOptions: {
      type: "object",
    },

    docgenCollectionName: {
      anyOf: [{ type: "string", minLength: 1 }, { type: "null" }],
    },

    setDisplayName: {
      type: "boolean",
    },

    parserOptions: {
      type: "object",
    },
  },
};

function validateOptions(options: LoaderOptions = {}) {
  validate({
    name: "react-docgen-typescript-loader",
    schema,
    target: options,
  });
}

export default validateOptions;
