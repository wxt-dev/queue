import CodeBlockWriter from "code-block-writer";
import { consola } from "consola";
import type { ServerSideFetch } from "@aklinker1/zeta/types";
import app from "../src/server";

const typesFile = Bun.file("src/@types/gql.d.ts");

const scalarNameToTs = {
  Boolean: "bool",
  String: "string",
  Int: "number",
  Float: "number",
};

export async function generateGqlTypes(fetch: ServerSideFetch = app.build()) {
  consola.info("Generating GraphQL types...");
  const introspection = await introspect(fetch);

  const {
    queryType,
    mutationType,
    subscriptionType,
    types,
    directives: _,
  } = introspection.data.__schema;

  let argTypes: any[] = [];

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
          return writeObjectType(code, argTypes, type);
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
    argTypes.map((type) => writeObjectType(code, argTypes, type));
  });
  code.newLine();

  await Bun.write(typesFile, code.toString());
  consola.success("Generated GraphQL types");
}

function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) return str;
  return str[0]!.toUpperCase() + str.substring(1);
}

function getTsTypeString(gqlType: any): string {
  if (gqlType.kind === "NON_NULL")
    return `NonNullable<${getTsTypeString(gqlType.ofType)}>`;
  if (gqlType.kind === "LIST")
    return `Array<${getTsTypeString(gqlType.ofType)}> | undefined`;
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

function writeObjectType(code: CodeBlockWriter, argTypes: any[], type: any) {
  writeCommentBlock(code, type.description);
  code.write(`interface ${type.name}`).block(() => {
    type.fields.forEach((field: any) => {
      writeCommentBlock(code, field.description);
      let returnTypeStr = getTsTypeString(field.type);

      let args = "";
      if (field.args?.length) {
        const argsType = {
          kind: "OBJECT",
          name: `${type.name}${capitalizeFirstLetter(field.name)}Variables`,
          fields: field.args,
        };
        args = `(args: ${argsType.name}, ctx: WxtQueueCtx)`;
        argTypes.push(argsType);
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

async function introspect(fetch: ServerSideFetch): Promise<any> {
  const request = new Request("http://localhost/api", {
    body: JSON.stringify({
      operationName: "IntrospectionQuery",
      query:
        "query IntrospectionQuery { __schema { queryType { name } mutationType { name } subscriptionType { name } types { ...FullType } directives { name description locations args { ...InputValue } } } } fragment FullType on __Type { kind name description fields(includeDeprecated: true) { name description args { ...InputValue } type { ...TypeRef } isDeprecated deprecationReason } inputFields { ...InputValue } interfaces { ...TypeRef } enumValues(includeDeprecated: true) { name description isDeprecated deprecationReason } possibleTypes { ...TypeRef } } fragment InputValue on __InputValue { name description type { ...TypeRef } defaultValue } fragment TypeRef on __Type { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } } } } } } ",
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const res = await fetch(request);
  if (res.ok) return await res.json();

  throw Error("Introspection request failed: " + (await res.text()));
}
