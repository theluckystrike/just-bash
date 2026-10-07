---
"just-bash": patch
---

Fix `sed` basic regular expressions so `$` before `\|` and `^` after `\|` act as anchors, matching GNU sed.
