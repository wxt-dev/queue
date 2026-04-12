import z from "zod";
import { ExtensionStoreName } from "./enums";

export const ExtensionStoreNameSchema = z
  .enum(ExtensionStoreName)
  .meta({ ref: "ExtensionStoreName" });
