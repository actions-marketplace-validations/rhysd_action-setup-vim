import * as path from 'path';
import * as core from '@actions/core';
import { Installed } from './install';
import { Config } from './config';
import { installNightlyVimOnWindows } from './vim';
import { downloadNeovim } from './neovim';

function installVimStable(token: string): Promise<Installed> {
    core.debug('Installing stable Vim on Windows');
    core.warning('No stable Vim release is officially created for Windows. Install nightly instead');
    return installVimNightly(token);
}

async function installVimNightly(token: string): Promise<Installed> {
    core.debug('Installing nightly Vim on Windows');
    const vimDir = await installNightlyVimOnWindows(token);
    return {
        executable: path.join(vimDir, 'vim.exe'),
        bin: vimDir,
    };
}

async function installVim(ver: string): Promise<Installed> {
    core.debug(`Installing Vim version '${ver}' on Windows`);
    throw new Error(`Installing Vim of specific version '${ver}' is not supported yet`);
}

async function installNeovimStable(): Promise<Installed> {
    core.debug('Installing stable Neovim on Windows');
    const nvimDir = await downloadNeovim('stable', 'windows');
    return {
        executable: path.join(nvimDir, 'bin', 'nvim.exe'),
        bin: path.join(nvimDir, 'bin'),
    };
}

async function installNeovimNightly(): Promise<Installed> {
    core.debug('Installing nightly Neovim on Windows');
    const nvimDir = await downloadNeovim('nightly', 'windows');
    return {
        executable: path.join(nvimDir, 'bin', 'nvim.exe'),
        bin: path.join(nvimDir, 'bin'),
    };
}

async function installNeovim(ver: string): Promise<Installed> {
    core.debug(`Installing Neovim version '${ver}' on Windows`);
    throw new Error(`Installing NeoVim of specific version '${ver}' is not supported yet`);
}

export function install(config: Config): Promise<Installed> {
    if (config.neovim) {
        switch (config.version) {
            case 'stable':
                return installNeovimStable();
            case 'nightly':
                return installNeovimNightly();
            default:
                return installNeovim(config.version);
        }
    } else {
        const { token } = config;
        if (token === null) {
            throw new Error("Please set 'github-token' input to get the latest installer from official Vim release");
        }
        switch (config.version) {
            case 'stable':
                return installVimStable(token);
            case 'nightly':
                return installVimNightly(token);
            default:
                return installVim(config.version);
        }
    }
}
