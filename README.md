GitHub Action to setup Vim and Neovim
=====================================
[![Build status][ci-badge]][ci]
[![Action Marketplace][release-badge]][marketplace]

[action-setup-vim][proj] is an action for [GitHub Actions][github-actions] to setup [Vim][vim] or
[Neovim][neovim] on Linux, macOS and Windows. Stable releases, nightly releases and specifying
versions are supported.

For stable releases, this action will install Vim or Neovim from system's package manager or
official releases since it is the most popular way to install them and it's faster than building
from source.

For nightly release, this action basically installs the nightly release of Vim or Neovim from
official releases. If unavailable, it builds executables from sources.

For more details, please read the following 'Installation details' section.

## Why?

Since preparing Vim editor is highly depending on a platform. On Linux, Vim is usually installed via
system's package manager like `apt`. On macOS, MacVim is the most popular Vim distribution and
usually installed via Homebrew. On Windows, [official installers][win-inst] are provided.

Neovim provides releases [on GitHub][neovim-release] and system package managers.

If you're an author of Vim and/or Neovim plugin and your plugin has some tests, you'd like to run
them across platforms on Vim and/or Neovim. action-setup-vim will help the installation with only
one step. You don't need to separate workflow jobs for each platforms and Vim/Neovim.

## Usage

Install the latest stable Vim

```yaml
- uses: rhysd/action-setup-vim@v1
```

Install the latest nightly Vim

```yaml
- uses: rhysd/action-setup-vim@v1
  with:
    version: nightly
```

Install the latest Vim v8.1.123. The version is a tag name in [vim/vim][vim] repository. Please see
the following 'Choose specific version' section also

```yaml
- uses: rhysd/action-setup-vim@v1
  with:
    version: v8.1.0123
```

Install the latest stable Neovim

```yaml
- uses: rhysd/action-setup-vim@v1
  with:
    neovim: true
```

Install the latest nightly Neovim

```yaml
- uses: rhysd/action-setup-vim@v1
  with:
    neovim: true
    version: nightly
```

Install the Neovim v0.4.3. Please see the following 'Choose specific version' section also

```yaml
- uses: rhysd/action-setup-vim@v1
  with:
    neovim: true
    version: v0.4.3
```

After the setup, `vim` executable will be available for Vim and `nvim` executable will be available
for Neovim.

Real-world examples are workflows in [clever-f.vim][clever-f-workflow] and
[git-messenger.vim][git-messenger-workflow]. And you can see [this repository's CI workflows][ci].
They run this action with all combinations of the inputs.

For comprehensive lists of inputs and outputs, please refer [action.yml](./action.yml).

## Outputs

This action sets installed executable path to the action's `executable` output. You can use it for
running Vim command in the steps later.

Here is an example to set Vim executable to run unit tests with [themis.vim][vim-themis].

```yaml
- uses: actions/checkout@v2
  with:
    repository: thinca/vim-themis
    path: vim-themis
- uses: rhysd/action-setup-vim@v1
  id: vim
- name: Run unit tests with themis.vim
  env:
    THEMIS_VIM: ${{ steps.vim.outputs.executable }}
  run: |
    ./vim-themis/bin/themis ./test
```

## Installation details

### Vim

`vX.Y.Z` represents a specific version such as `v8.2.0126`.

| OS      | Version   | Installation                                                                       |
|---------|-----------|------------------------------------------------------------------------------------|
| Linux   | `stable`  | Install [`vim-gnome`][ubuntu-vim] package via `apt` package manager                |
| Linux   | `nightly` | Build the HEAD of [vim/vim][vim] repository                                        |
| Linux   | `vX.Y.Z`  | Build the `vX.Y.Z` tag of [vim/vim][vim] repository                                |
| macOS   | `stable`  | Install MacVim via `brew install macvim`                                           |
| macOS   | `nightly` | Build the HEAD of [vim/vim][vim] repository                                        |
| macOS   | `vX.Y.Z`  | Build the `vX.Y.Z` tag of [vim/vim][vim] repository                                |
| Widnows | `stable`  | There is no stable release for Windows so fall back to `nightly`                   |
| Windows | `nightly` | Install the latest release from [installer repository][win-inst]                   |
| Windows | `vX.Y.Z`  | Install the release at `vX.Y.Z` tag of [installer repository][win-inst] repository |

For stable releases on all platforms and nightly on Windows, `gvim` executable is also available.

When installing without system's package manager, Vim is installed at `$HOME/vim`.

### Neovim

`vX.Y.Z` represents a specific version such as `v0.4.3`.

| OS      | Version   | Installation                                                              |
|---------|-----------|---------------------------------------------------------------------------|
| Linux   | `stable`  | Install from the latest [Neovim stable release][nvim-stable]              |
| Linux   | `nightly` | Install from the latest [Neovim nightly release][nvim-nightly]            |
| Linux   | `vX.Y.Z`  | Install the release at `vX.Y.Z` tag of [neovim/neovim][neovim] repository |
| macOS   | `stable`  | `brew install neovim` using Homebrew                                      |
| macOS   | `nightly` | Install from the latest [Neovim nightly release][nvim-nightly]            |
| macOS   | `vX.Y.Z`  | Install the release at `vX.Y.Z` tag of [neovim/neovim][neovim] repository |
| Windows | `stable`  | Install from the latest [Neovim stable release][nvim-stable]              |
| Windows | `nightly` | Install from the latest [Neovim nightly release][nvim-nightly]            |
| Windows | `vX.Y.Z`  | Install the release at `vX.Y.Z` tag of [neovim/neovim][neovim] repository |

Only on Windows, `nvim-qt.exe` executable is available for GUI.

When installing without system's package manager, Neovim is installed at `$HOME/nvim`.

**Note:** Ubuntu 18.04 supports official [`neovim` package][ubuntu-nvim] but this action does not
install it. As of now, GitHub Actions also supports Ubuntu 16.04.

**Note:** When downloading an asset for stable Neovim from `stable` release on GitHub, the asset is
rarely missing. In the case, this action will get the latest version tag from GitHub API and use
it instead of `stable` tag (see [#5][issue-5] for more details).

## Choose specific version

### Vim

If Vim is built from source, any tag version should be available.

If Vim is installed via release asset (on Windows), please check
[vim-win32-installer releases page][win-inst-release] to know which versions are available.
The repository makes a release once per day (nightly).

Note that Vim's patch number in version tags is in 4-digits like `v8.2.0126`. Omitting leading
zeros such as `v8.2.126` or `v8.2.1` is not allowed.

### Neovim

When installing the specific version of Neovim, this action downloads release assets from
[neovim/neovim][neovim]. Please check [neovim/neovim releases page][neovim-release] to know which
versions have release assets. For example,
[Neovim 0.4.0](https://github.com/neovim/neovim/releases/tag/v0.4.0) has no Windows releases so it
is not available for installing Neovim on Windows.

## Current limitation

- GUI version (gVim and nvim-qt) is supported partially as described in above section.
- Building Vim is not configurale. For example, arguments cannot be passed to `./configure`.
- Installing Vim/Neovim from system's package manager is not configurable. For example, arguments cannot be passed to `brew install`.
- Cannot build Neovim from sources in favor of [neovim releases][neovim-release].

These are basically not a technical limitation. Please let me know by creating an issue if you want
some of them.

## License

Distributed under [the MIT license](./LICENSE.txt).

[ci-badge]: https://github.com/rhysd/action-setup-vim/workflows/CI/badge.svg?branch=master&event=push
[ci]: https://github.com/rhysd/action-setup-vim/actions?query=workflow%3ACI+branch%3Amaster
[release-badge]: https://img.shields.io/github/v/release/rhysd/action-setup-vim.svg
[marketplace]: https://github.com/marketplace/actions/setup-vim
[proj]: https://github.com/rhysd/action-setup-vim
[github-actions]: https://github.com/features/actions
[vim]: https://github.com/vim/vim
[neovim]: https://github.com/neovim/neovim
[win-inst]: https://github.com/vim/vim-win32-installer
[nvim-stable]: https://github.com/neovim/neovim/releases/tag/stable
[nvim-nightly]: https://github.com/neovim/neovim/releases/tag/nightly
[clever-f-workflow]: https://github.com/rhysd/clever-f.vim/blob/master/.github/workflows/ci.yml
[git-messenger-workflow]: https://github.com/rhysd/git-messenger.vim/blob/master/.github/workflows/ci.yml
[ubuntu-vim]: https://packages.ubuntu.com/search?keywords=vim-gnome
[ubuntu-nvim]: https://packages.ubuntu.com/search?keywords=neovim
[vim-themis]: https://github.com/thinca/vim-themis
[win-inst-release]: https://github.com/vim/vim-win32-installer/releases
[neovim-release]: https://github.com/neovim/neovim/releases
[generate-pat]: https://github.com/settings/tokens/new
[gh-action-secrets]: https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets
[issue-5]: https://github.com/rhysd/action-setup-vim/issues/5
