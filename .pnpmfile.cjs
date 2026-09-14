// Workaround for a packaging bug in drawui-react@0.2.1:
// the published package declares its dependency on drawui-core as
// "workspace:*" (a monorepo-only protocol) instead of a real version range.
// pnpm cannot resolve "workspace:*" outside the author's own repo, so we
// rewrite it to a concrete version here at resolve time.
function readPackage(pkg) {
  if (
    pkg.name === 'drawui-react' &&
    pkg.dependencies &&
    pkg.dependencies['drawui-core'] === 'workspace:*'
  ) {
    pkg.dependencies['drawui-core'] = '0.2.1';
  }
  return pkg;
}

module.exports = { hooks: { readPackage } };
