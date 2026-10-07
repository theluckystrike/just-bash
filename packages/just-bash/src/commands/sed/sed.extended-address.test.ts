import { describe, expect, it } from "vitest";
import { Bash } from "../../Bash.js";

describe("sed extended regex in addresses", () => {
  it("should treat | as alternation in a -E address", async () => {
    const env = new Bash();
    const result = await env.exec("printf 'a\\nb\\nc\\n' | sed -E '/a|b/d'");
    expect(result.stdout).toBe("c\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should treat + as a quantifier in a -E address", async () => {
    const env = new Bash();
    const result = await env.exec("printf 'aa\\nb\\n' | sed -E -n '/a+/p'");
    expect(result.stdout).toBe("aa\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should treat ( ) as groups in a -r range address", async () => {
    const env = new Bash();
    const result = await env.exec(
      "printf 'x\\nstart1\\ny\\nend2\\nz\\n' | sed -r -n '/^(start)[0-9]$/,/^(end)[0-9]$/p'",
    );
    expect(result.stdout).toBe("start1\ny\nend2\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should keep | literal in a BRE address", async () => {
    const env = new Bash();
    const result = await env.exec("printf 'a|b\\na\\n' | sed -n '/a|b/p'");
    expect(result.stdout).toBe("a|b\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });
});
