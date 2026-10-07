---
"just-bash": patch
---

Fix `sed -E` and `sed -r` so address regexes such as `/a|b/` and `/a+/` use extended syntax, matching the `s` command and GNU sed.
