import { createServer } from "../src/server";
import { generateGqlTypes } from "./generate-gql-types";

const server = createServer();

await generateGqlTypes(server);

server.httpServer.stop();
