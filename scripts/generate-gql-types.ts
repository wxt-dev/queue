import CodeBlockWriter from "code-block-writer";
import type { Server } from "../src/server";
import { consola } from "consola";

const typesFile = Bun.file("src/@types/gql.d.ts");

const scalarNameToTs = {
  Boolean: "bool",
  String: "string",
  Int: "number",
};

export async function generateGqlTypes(server: Server) {
  consola.info("Generating GraphQL types...");
  const introspection = await server.introspect();

  const { queryType, mutationType, subscriptionType, types, directives } =
    introspection.data.__schema;

  let variableTypes: any[] = [];

  const code = new CodeBlockWriter({
    indentNumberOfSpaces: 2,
    newLine: "\n",
  });

  code.write("namespace Gql").block(() => {
    // Root Resolver Type
    const rootTypeNames = [
      queryType?.name,
      mutationType?.name,
      subscriptionType?.name,
    ].filter((name) => !!name);
    code.writeLine(`type RootResolver = ${rootTypeNames.join(" | ")}`);

    // Types
    types.forEach((type: any) => {
      // Ignore internal types
      if (type.name.startsWith("__")) return;

      switch (type.kind) {
        case "OBJECT":
          return writeObjectType(code, variableTypes, type);
        case "SCALAR":
          return writeScalarType(code, type);
        default:
          return consola.warn("Unknown kind:", {
            kind: type.kind,
            name: type.name,
          });
      }
    });

    // Query Variables
    variableTypes.map((type) => writeObjectType(code, variableTypes, type));
  });
  code.newLine();

  await Bun.write(typesFile, code.toString());
  consola.success("Generated GraphQL types");
}

function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) return str;
  return str[0].toUpperCase() + str.substring(1);
}

function getTsTypeString(gqlType: any): string {
  if (gqlType.kind === "NON_NULL")
    return `NonNullable<${getTsTypeString(gqlType.ofType)}>`;
  if (gqlType.kind === "SCALAR" || gqlType.kind === "OBJECT")
    return `${gqlType.name} | undefined`;

  consola.warn("Unknown TS type:", gqlType);
  return "unknown";
}

function writeCommentBlock(code: CodeBlockWriter, description: string | null) {
  if (!description) return;

  code.writeLine("/**");
  description
    ?.split("\n")
    .forEach((line: string) => code.writeLine(` * ${line}`));
  code.writeLine(" */");
}

function writeObjectType(
  code: CodeBlockWriter,
  variableTypes: any[],
  type: any
) {
  writeCommentBlock(code, type.description);
  code.write(`interface ${type.name}`).block(() => {
    type.fields.forEach((field: any) => {
      writeCommentBlock(code, field.description);
      let returnTypeStr = getTsTypeString(field.type);

      let args = "";
      if (field.args?.length) {
        const variablesType = {
          kind: "OBJECT",
          name: `${type.name}${capitalizeFirstLetter(field.name)}Variables`,
          fields: field.args,
        };
        args = `(variables: ${variablesType.name})`;
        variableTypes.push(variablesType);
        returnTypeStr = `Promise<${returnTypeStr}> | ${returnTypeStr}`;
      }
      code.writeLine(`"${field.name}"${args}: ${returnTypeStr}`);
    });
  });
}

function writeScalarType(code: CodeBlockWriter, type: any) {
  writeCommentBlock(code, type.description);
  // @ts-expect-error
  const typeStr = scalarNameToTs[type.name];
  if (typeStr == null) {
    consola.warn("Unknown scalar type:", type);
  }
  code.writeLine(`type ${type.name} = ${typeStr || "unknown"};`);
}
