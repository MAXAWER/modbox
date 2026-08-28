# MThread — ModBox

The pages ModBox links to, and the list of catalogue content it must not show.

Published with GitHub Pages at <https://maxawer.github.io/modbox/>.

| Address | What it is |
|---|---|
| `/privacy` | Privacy policy. The Store submission is refused without it. |
| `/terms` | Terms of use. |
| `/support` | How to get help, and where to write. |
| `/blocklist.json` | Content ModBox refuses to show or download. |

## Taking something out of the catalogue for everybody

Every installed copy of ModBox fetches `blocklist.json` when the catalogue is opened,
and keeps the last copy it got. Adding an entry here therefore stops that item being
shown or downloaded on every machine, within the hour, with no update and no
certification.

A report sent from inside ModBox arrives by e-mail with the line already written out —
both the one that blocks the whole project and, where it applies, the one that blocks a
single version. Paste the line into `items`, add one to `revision`, set `issued` to
today, and commit.

```json
{
  "revision": 2,
  "issued": "2026-08-28T00:00:00Z",
  "items": [
    { "project": "AANobbMI", "reason": "rules" }
  ]
}
```

`project` and `version` are Modrinth's base62 identifiers, never slugs: an author can
change a slug, and the identifier is what the report carries. Omitting `version` blocks
every version of the project.

`reason` is one of `platform` (the store operator asked), `rights` (a rights holder
complained), `malware`, `rules` (it breaks the published content rules) or `withdrawn`.
An unrecognised word still blocks — an older ModBox reading a list written by a newer
one must not become permissive.

`revision` has to go up. It is what lets a copy of ModBox recognise a stale list.

## What is not here

The application itself, its source and its releases. This repository is the two things
that have to be reachable from a browser and changeable without a release: the pages
the product is obliged to link to, and the list it enforces.
