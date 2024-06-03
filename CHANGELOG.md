# Next

[diff](https://github.com/gtm-support/vue-gtm/compare/3.0.1...main)

# 3.0.1

[diff](https://github.com/gtm-support/vue-gtm/compare/3.0.0...3.0.1)

- Fix missing `types` exposing

# 3.0.0

[diff](https://github.com/gtm-support/vue-gtm/compare/2.2.0...3.0.0)

- Drop cjs support
- Return gtmPlugin from app context ([#409])

[#409]: https://github.com/gtm-support/vue-gtm/pull/409

# 2.2.0

[diff](https://github.com/gtm-support/vue-gtm/compare/2.1.0...2.2.0)

- Upgrade `core` to [2.1.0](https://github.com/gtm-support/core/releases/tag/2.1.0)

# 2.1.0

[diff](https://github.com/gtm-support/vue-gtm/compare/2.0.0...2.1.0)

- Fix peer dependency ranges ([#351])
- Internal changes of the bundling process

[#351]: https://github.com/gtm-support/vue-gtm/issues/351

# 2.0.0

[diff](https://github.com/gtm-support/vue-gtm/compare/1.6.0...2.0.0)

## BREAKING CHANGE

- Minimum required Vue version is now `^3.2.0`
- Minimum required Vue Router version is now `^4.1.0`
- Minimum required EcmaScript is now `ES2018`

## Features

- Now serving ESM and CJS
- Handle `vue-router` failure checks manually ([#273])
- Set `lib` from `ES2020` to `ES2018`

[#273]: https://github.com/gtm-support/vue-gtm/pull/273

# 1.6.0

[diff](https://github.com/gtm-support/vue-gtm/compare/1.5.0...1.6.0)

- Upgrade `core` to [1.4.0](https://github.com/gtm-support/core/releases/tag/1.4.0)
- Use `^`-semver modifier for `@gtm-support/core`

# 1.5.0

[diff](https://github.com/gtm-support/vue-gtm/compare/1.4.0...1.5.0)

- Upgrade `core` to [1.3.0](https://github.com/gtm-support/core/releases/tag/1.3.0)

# 1.4.0

[diff](https://github.com/gtm-support/vue-gtm/compare/1.3.0...1.4.0)

- Upgrade `core` to [1.2.0](https://github.com/gtm-support/core/releases/tag/1.2.0)

# 1.3.0

[diff](https://github.com/gtm-support/vue-gtm/compare/1.2.3...1.3.0)

- New option `vueRouterAdditionalEventData` ([#110])

[#110]: https://github.com/gtm-support/vue-gtm/issues/110

# 1.2.3

[diff](https://github.com/gtm-support/vue-gtm/compare/1.2.2...1.2.3)

- Detect if running in browser context ([#97])

[#97]: https://github.com/gtm-support/vue-gtm/pull/97

# 1.2.2

[diff](https://github.com/gtm-support/vue-gtm/compare/1.2.1...1.2.2)

- Make `vue-router` optional, for real this time...

# 1.2.1

[diff](https://github.com/gtm-support/vue-gtm/compare/1.2.0...1.2.1)

- Fix optional `vue-router` peer dependency

# 1.2.0

[diff](https://github.com/gtm-support/vue-gtm/compare/1.1.0...1.2.0)

- Upgrade `core` to [1.1.0](https://github.com/gtm-support/core/releases/tag/1.1.0)

# 1.1.0

[diff](https://github.com/gtm-support/vue-gtm/compare/1.0.0...1.1.0)

- Ability to ignore views by callback ([#37])

## BREAKING CHANGE

- Ignore views is not case insensitive anymore

[#37]: https://github.com/gtm-support/vue-gtm/pull/37

# 1.0.0

[diff](https://github.com/gtm-support/vue-gtm/compare/940a45a90d4cb44a045923910e7439d0202372ca...1.0.0)

- Initial release

# 1.0.0-alpha.3

[diff](https://github.com/gtm-support/vue-gtm/compare/1.0.0-alpha.2...1.0.0-alpha.3)

- Update to [@gtm-support/core v1.0.0-alpha.3](https://github.com/gtm-support/core/releases/tag/1.0.0-alpha.3)

# 1.0.0-alpha.2

[diff](https://github.com/gtm-support/vue-gtm/compare/1.0.0-alpha.1...1.0.0-alpha.2)

- Use [@gtm-support/core](https://github.com/gtm-support/core) natively

## BREAKING CHANGE

The `id` parameter is now part of the options, therefor if you used the constructor you need to move the first argument into the second `option` argument.  
Also some names changed here and there.

# 1.0.0-alpha.1

[diff](https://github.com/gtm-support/vue-gtm/compare/940a45a90d4cb44a045923910e7439d0202372ca...1.0.0-alpha.1)

- Compatibility release for `vue-gtm` `3.5.0`
- [Previous Changelog](https://github.com/mib200/vue-gtm/blob/master/CHANGELOG.md)
