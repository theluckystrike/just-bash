import { describe, expect, it } from "vitest";
import { Bash } from "./Bash.js";
import { MountableFs } from "./fs/mountable-fs/index.js";
import { OverlayFs } from "./fs/overlay-fs/index.js";

describe("command stubs in /bin and /usr/bin", () => {
  it("are executable for test -x, [ -x ] and stat", async () => {
    const bash = new Bash();
    const result = await bash.exec(
      "test -x /usr/bin/ls; echo usr=$?; [ -x /bin/cat ]; echo bin=$?; stat -c %a /usr/bin/grep",
    );
    expect(result.stdout).toBe("usr=0\nbin=0\n755\n");
  });

  it("are found by an autoconf-style PATH probe", async () => {
    const bash = new Bash();
    const result = await bash.exec(
      'dirs=/usr/local/bin:/usr/bin:/bin; IFS=:; for d in $dirs; do f="$d/grep"; if test -f "$f" && test -x "$f"; then echo "$f"; break; fi; done',
    );
    expect(result.stdout).toBe("/usr/bin/grep\n");
  });

  it("are executable on OverlayFs", async () => {
    const bash = new Bash({ fs: new OverlayFs({ root: process.cwd() }) });
    const result = await bash.exec("test -x /usr/bin/ls; echo $?");
    expect(result.stdout).toBe("0\n");
  });

  it("are executable on MountableFs", async () => {
    const bash = new Bash({ fs: new MountableFs() });
    const result = await bash.exec("test -x /bin/ls; echo $?");
    expect(result.stdout).toBe("0\n");
  });
});
