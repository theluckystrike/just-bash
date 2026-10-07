---
"just-bash": patch
---

Write the `/bin` and `/usr/bin` command stubs with mode 755, so `test -x`, `stat` and PATH probes such as autoconf's `as_fn_executable_p` see them as executable. `OverlayFs.writeFileSync` and `MountableFs.writeFileSync` accept the optional `metadata` argument that `InMemoryFs.writeFileSync` already takes.
