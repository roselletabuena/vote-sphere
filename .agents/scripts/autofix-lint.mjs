import { execSync } from "node:child_process";
import { extname, isAbsolute, resolve } from "node:path";

let input = "";
process.stdin.setEncoding("utf-8");

process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  try {
    const data = input.trim() ? JSON.parse(input) : {};
    const workspaceRoot =
      data.workspacePaths && data.workspacePaths[0] ? data.workspacePaths[0] : process.cwd();

    let targetFile = data.toolCall?.args?.TargetFile;

    if (targetFile) {
      if (!isAbsolute(targetFile)) {
        targetFile = resolve(workspaceRoot, targetFile);
      }
      const ext = extname(targetFile);
      if ([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"].includes(ext)) {
        try {
          execSync(`npx eslint --fix "${targetFile}"`, {
            cwd: workspaceRoot,
            stdio: "ignore",
          });
        } catch {
          // Lint errors that couldn't be autofixed are safely ignored
        }
      }
    } else {
      try {
        execSync("npm run lint:fix", {
          cwd: workspaceRoot,
          stdio: "ignore",
        });
      } catch {
        // Lint errors that couldn't be autofixed are safely ignored
      }
    }
  } catch {
    // Ignore payload parse errors
  } finally {
    // PostToolUse contract requires a valid JSON object on stdout
    process.stdout.write(JSON.stringify({}) + "\n");
  }
});
