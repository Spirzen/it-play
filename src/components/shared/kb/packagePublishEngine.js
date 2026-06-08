export const ECOSYSTEMS = [
  {
    id: 'npm',
    label: 'npm (JS)',
    pack: 'npm pack',
    publish: 'npm publish',
    registry: 'registry.npmjs.org',
    manifest: `{
  "name": "slugify-url",
  "version": "1.0.0",
  "main": "index.js"
}`,
  },
  {
    id: 'nuget',
    label: 'NuGet (.NET)',
    pack: 'dotnet pack',
    publish: 'dotnet nuget push *.nupkg',
    registry: 'nuget.org',
    manifest: `<PackageId>MyCompany.Utils</PackageId>
<Version>1.0.0</Version>`,
  },
  {
    id: 'pypi',
    label: 'PyPI (Python)',
    pack: 'python -m build',
    publish: 'twine upload dist/*',
    registry: 'pypi.org',
    manifest: `[project]
name = "friendly-slug"
version = "1.0.0"`,
  },
];

export const PUBLISH_STEPS = [
  {id: 'idea', label: '1. Идея', done: 'Одна задача, независимость от проекта'},
  {id: 'code', label: '2. Код', done: 'Минимальный API + README'},
  {id: 'pack', label: '3. Упаковка', done: 'Версия semver, лицензия'},
  {id: 'account', label: '4. Аккаунт', done: 'Регистрация в реестре'},
  {id: 'push', label: '5. Публикация', done: 'CLI или веб-загрузка'},
];
