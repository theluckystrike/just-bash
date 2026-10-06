import { afterEach, beforeEach, describe, it } from "vitest";
import {
  cleanupTestDir,
  compareOutputs,
  createTestDir,
  setupFiles,
} from "./fixture-runner.js";

describe("prefix bindings - Real Bash Comparison", () => {
  let testDir: string;
  beforeEach(async () => {
    testDir = await createTestDir();
  });
  afterEach(async () => {
    await cleanupTestDir(testDir);
  });

  it.each([
    "TEMP=0; TEMP=one TEMP=two :; echo $TEMP",
    "TEMP=0; TEMP=one TEMP=$((TEMP=5)) :; echo $TEMP",
    "TEMP=0; TEMP=5 TEMP=$((TEMP=5)) :; echo $TEMP",
    'a=(old); a=("$((a[0]=5))") :; printf "array=<%s>\\n" "${a[0]}"',
    'a=(old keep); a=(temp) a=("$((a[1]=5))") :; printf "<%s>\\n" "${a[@]}"',
    // Locked fixture observed with Bash 5.3.20; macOS Bash 3.2 lacks -A.
    'declare -A a=([key]=value); a=(temp) unset a; printf "lookup=<%s>\\n" "${a[key]}"',
  ])("preserves underlying state for %s", async (script) => {
    const bash = await setupFiles(testDir, {});
    await compareOutputs(bash, testDir, script);
  });
});
