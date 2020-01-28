import * as path from 'path';
import * as core from '@actions/core';
import { Installed } from './install';
import { Config } from './config';
import { exec } from './shell';
import { buildVim } from './vim';
import { downloadNeovim } from './neovim';

async function installVimStable(): Promise<Installed> {
    core.debug('Installing stable Vim on Linux');
    await exec('sudo', ['apt', 'install', '-y', 'vim-gnome']);
    return {
        executable: '/usr/bin/vim',
        bin: '/usr/bin',
    };
}

async function installVimNightly(): Promise<Installed> {
    core.debug('Installing nightly Vim on Linux');
    const vimDir = await buildVim(null);
    return {
        executable: path.join(vimDir, 'bin', 'vim'),
        bin: path.join(vimDir, 'bin'),
    };
}

async function installVim(ver: string): Promise<Installed> {
    core.debug(`Installing Vim version '${ver}' on Linux`);
    throw new Error(`Installing Vim of specific version '${ver}' is not supported yet`);
}

async function installNeovim(ver: string): Promise<Installed> {
    core.debug(`Installing Neovim version '${ver}' on Linux`);
    const nvimDir = await downloadNeovim(ver, 'linux');
    return {
        executable: path.join(nvimDir, 'bin', 'nvim'),
        bin: path.join(nvimDir, 'bin'),
    };
}

export function install(config: Config): Promise<Installed> {
    if (config.neovim) {
        switch (config.version) {
            case 'stable':
                return installNeovim('stable');
            case 'nightly':
                return installNeovim('nightly');
            default:
                return installNeovim(config.version);
        }
    } else {
        switch (config.version) {
            case 'stable':
                return installVimStable();
            case 'nightly':
                return installVimNightly();
            default:
                return installVim(config.version);
        }
    }
}
