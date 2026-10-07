import { describe, expect, it } from "vitest";
import { Bash } from "../../Bash.js";

describe("sed BRE anchors at the edges of an alternative", () => {
  it("anchors $ before \\|", async () => {
    const env = new Bash();
    const result = await env.exec("printf 'ab\\ncd\\n' | sed -n '/b$\\|xx/p'");
    expect(result.stdout).toBe("ab\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("anchors ^ after \\|", async () => {
    const env = new Bash();
    const result = await env.exec("printf 'ab\\ncd\\n' | sed -n '/xx\\|^c/p'");
    expect(result.stdout).toBe("cd\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("anchors both edges in an s command", async () => {
    const env = new Bash();
    const result = await env.exec("printf 'ab\\ncd\\n' | sed 's/b$\\|^c/X/'");
    expect(result.stdout).toBe("aX\nXd\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("keeps $ and ^ literal inside an alternative", async () => {
    const env = new Bash();
    const result = await env.exec(
      "printf 'a$b\\nc^d\\n' | sed -n '/a$b\\|c^d/p'",
    );
    expect(result.stdout).toBe("a$b\nc^d\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });
});
