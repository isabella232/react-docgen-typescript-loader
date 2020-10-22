import path from "path";
import { ComponentDoc } from "@luke-john/react-docgen-typescript/lib/parser.js";

export interface GeneratorOptions {
  filename: string;
  source: string;
  componentDocs: ComponentDoc[];
  docgenCollectionName: string | null;
  setDisplayName: boolean;
}

export default function generateDocgenCodeBlock({
  filename,
  source,
  componentDocs,
  docgenCollectionName,
  setDisplayName,
}: GeneratorOptions): string {
  const relativeFilename = path
    .relative("./", path.resolve("./", filename))
    .replace(/\\/g, "/");

  const codeToInsertComponentDocs__docgenInfo = componentDocs
    .map(componentDoc => {
      const descriptionValue = JSON.stringify(componentDoc.description);
      const descriptionLine = descriptionValue
        ? `description: ${descriptionValue}`
        : undefined;
      const propsValue = JSON.stringify(componentDoc.props);
      const propsLine = propsValue ? `props: ${propsValue}` : undefined;
      const dislayNameLine = `displayName: "${componentDoc.displayName}"`;

      const lines = [descriptionLine, propsLine, dislayNameLine].filter(
        line => line !== undefined,
      );

      const globalCollectionCode = docgenCollectionName
        ? getCodeToInsertDocgenIntoGlobalCollection(
            componentDoc.displayName,
            docgenCollectionName,
            relativeFilename,
          )
        : "";

      const setDisplayNameCode = setDisplayName
        ? `
  // @ts-ignore
  ${componentDoc.displayName}.displayName = "${componentDoc.displayName}"
          `.trim()
        : "";

      return `
  // @ts-ignore
  ${componentDoc.displayName}.__docgenInfo = {
      ${lines.join(",\n      ")}
  };
  ${[globalCollectionCode, setDisplayNameCode]
    .filter(item => item !== undefined)
    .join("\n  ")}
`.trim();
    })
    .join("\n");

  return `
${source}
try {
${codeToInsertComponentDocs__docgenInfo}
} catch {};
`.trim();
}

/**
 * Adds a component's docgen info to the global docgen collection.
 *
 * ```
 * if (typeof STORYBOOK_REACT_CLASSES !== "undefined") {
 *   STORYBOOK_REACT_CLASSES["src/.../SimpleComponent.tsx"] = {
 *     name: "SimpleComponent",
 *     docgenInfo: SimpleComponent.__docgenInfo,
 *     path: "src/.../SimpleComponent.tsx",
 *   };
 * }
 * ```
 *
 * @param componentDocAccess Component doc.
 * @param docgenCollectionName Global docgen collection variable name.
 * @param relativeFilename Relative file path of the component source file.
 */
function getCodeToInsertDocgenIntoGlobalCollection(
  componentDocDisplayName: string,
  docgenCollectionName: string,
  relativeFilename: string,
): string {
  const globalCollectionKey = `${relativeFilename}#${componentDocDisplayName}`;
  return `
  // @ts-ignore
  if (typeof ${docgenCollectionName} !== "undefined") {
    // @ts-ignore
    ${docgenCollectionName}['${globalCollectionKey}'] = ${componentDocDisplayName}.__docgenInfo;
  }
`.trim();
}
