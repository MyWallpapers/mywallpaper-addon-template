# MyWallpaper Add-on Template

Starter repository for a public MyWallpaper Canvas add-on. It uses the same
manifest, settings tree and `mount(context)` contract as the official add-ons.

## Local development

```bash
corepack enable pnpm
pnpm install --frozen-lockfile
pnpm dev
```

The local page is only a development preview. The production artifact is
generated with:

```bash
pnpm typecheck
pnpm build
```

The build emits the ESM entry `dist/assets/addon.js` and its assets. The entry exports
`mount` and receives an isolated layer root, settings and lifecycle APIs from
MyWallpaper; it does not use undocumented globals or `postMessage` protocols.

## Settings tree

`manifest.json` demonstrates sections and nested settings through the
`parent` field. Add settings to the array, choose a section parent, and keep
the default value in the manifest. `showIf` can hide a dependent control while
the runtime continues to receive the complete settings object.

## Publishing

Merge the source and matching manifest/package version into the reviewed default
branch, wait for quality checks, then push a new immutable `v<version>` tag.
Open this add-on's management page in MyWallpaper and select that tag to request
publication with an active lifetime entitlement.

MyWallpaper resolves the exact public repository and commit, dispatches its
pinned central workflow, rebuilds and verifies the artifacts, and publishes the
immutable transport from the platform repository. The add-on repository needs
no publication workflow or MyWallpaper credential. Do not pre-create a GitHub
release: a source tag alone does not publish the add-on to the catalogue.

Each accepted newer release is available for new installations. Existing
wallpapers remain pinned to their exact release until explicitly changed.


Copy this repository for a new add-on and update its name, description, version,
thumbnail and source. Keep `generated/mywallpaper-runtime.d.ts` synchronized
with the canonical CLI.
