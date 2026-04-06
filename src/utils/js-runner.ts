import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { ParseError } from "../errors.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Run a JavaScript function from a script file using Node.js vm module.
 * Replaces Python's py_mini_racer.MiniRacer().
 */
export async function runJsFunction<TResult = unknown>(
  scriptPath: string,
  functionName: string,
  ...args: unknown[]
): Promise<TResult> {
  const fullPath = scriptPath.startsWith("/") ? scriptPath : join(__dirname, scriptPath);

  const scriptContent = await readFile(fullPath, "utf-8");
  return runJsFunctionFromString(scriptContent, functionName, ...args);
}

/**
 * Run a JavaScript function from a script string using Node.js vm module.
 */
export function runJsFunctionFromString<TResult = unknown>(
  scriptContent: string,
  functionName: string,
  ...args: unknown[]
): TResult {
  const context = vm.createContext({
    // Provide minimal globals needed by decryption scripts
    Math,
    Date,
    parseInt,
    parseFloat,
    String,
    Array,
    Object,
    Number,
    Boolean,
    encodeURIComponent,
    decodeURIComponent,
    atob: (str: string) => Buffer.from(str, "base64").toString("binary"),
    btoa: (str: string) => Buffer.from(str, "binary").toString("base64"),
  });

  try {
    vm.runInContext(scriptContent, context);
  } catch (err) {
    throw new ParseError(
      `Failed to execute JS script: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const fn = context[functionName];
  if (typeof fn !== "function") {
    throw new ParseError(`Function "${functionName}" not found in script`);
  }

  try {
    return fn(...args) as TResult;
  } catch (err) {
    throw new ParseError(
      `JS function "${functionName}" execution failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}
