---
"just-bash": patch
---

Word-split an unquoted expansion in command position, so `CC="cc -O2"; $CC -c x.c` runs `cc` with `-O2 -c x.c` as bash does instead of failing with "command not found".
