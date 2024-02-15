import { generateGqlTypes } from "../scripts/generate-gql-types";
import { createServer } from "./server";

const server = createServer();
await generateGqlTypes(server);
server.httpServer.stop();
