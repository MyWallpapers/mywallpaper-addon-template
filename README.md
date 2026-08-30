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

The build emits `dist/index.html` and `dist/assets/addon.js`. The entry exports
`mount` and receives an isolated layer root, settings and lifecycle APIs from
MyWallpaper; it does not use undocumented globals or `postMessage` protocols.

## Settings tree

`manifest.json` demonstrates sections and nested settings through the
`parent` field. Add settings to the array, choose a section parent, and keep
the default value in the manifest. `showIf` can hide a dependent control while
the runtime continues to receive the complete settings object.

## Publication

The repository is intentionally public and contains no credentials. The
canonical publication workflow is triggered by an immutable `v*` tag and calls
the pinned MyWallpaper toolchain. Publication validates the exact source,
manifest, build output, provenance and digest before a release can enter the
catalogue. Nothing is published from the local preview server.

Copy this repository when starting a new add-on, then update the name,
description, version, thumbnail in `assets/` and source module. Keep the generated runtime
declaration in `generated/` synchronized with the toolchain.
