import { describe, expect, it } from "vitest";
import { Bash } from "../Bash.js";

/**
 * Word splitting of an unquoted expansion used as the command word.
 *
 * Bash expands the command word like any other word: an unquoted `$CC` with
 * `CC="cc -O2"` splits into the fields `cc` and `-O2`, the first field names
 * the command and the rest become its leading arguments. A quoted `"$X"` stays
 * one field, so a value with spaces is looked up as a single command name.
 *
 * Every expectation here was verified against real bash before being written.
 */
describe("word splitting of the command word", () => {
  it("should split a variable holding a command and its options", async () => {
    const env = new Bash();
    const result = await env.exec(`CC="echo cc -O2"; $CC -c x.c`);
    expect(result.stdout).toBe("cc -O2 -c x.c\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should split a variable holding a builtin and its format", async () => {
    const env = new Bash();
    const result = await env.exec(`ECHO='printf %s\\n'; $ECHO hello world`);
    expect(result.stdout).toBe("hello\nworld\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should split $* in command position and keep quoted $@ fields", async () => {
    const env = new Bash();
    const result = await env.exec(
      `set -- echo a b; $*; set -- echo "x  y"; "$@"`,
    );
    expect(result.stdout).toBe("a b\nx  y\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should call a function named by the first field", async () => {
    const env = new Bash();
    const result = await env.exec(`f() { echo "f:$*"; }; CMD="f a b"; $CMD`);
    expect(result.stdout).toBe("f:a b\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  it("should not split a quoted expansion in command position", async () => {
    const env = new Bash();
    const result = await env.exec(`X="echo a b"; "$X"`);
    expect(result.stdout).toBe("");
    expect(result.stderr).toBe("bash: echo a b: command not found\n");
    expect(result.exitCode).toBe(127);
  });

  it("should run the first argument when the command word expands to nothing", async () => {
    const env = new Bash();
    const result = await env.exec(`x=''; $x echo ran`);
    expect(result.stdout).toBe("ran\n");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });
});
