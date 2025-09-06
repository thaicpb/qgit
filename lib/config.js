import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const CONFIG_FILENAME = '.mygitconfig.json';
const CONFIG_PATH = join(homedir(), CONFIG_FILENAME);

const DEFAULT_CONFIG = {
  version: '1.0.0',
  aliases: {
    st: 'git status',
    cmt: 'git commit -m "$1"',
    co: 'git checkout $@',
    br: 'git branch $@',
    push: 'git push $@',
    pull: 'git pull $@',
    log: 'git log --oneline -10',
    diff: 'git diff $@',
    add: 'git add $@',
    stash: 'git stash $@',
    recent: 'git log --oneline --graph --decorate -15',
    unstage: 'git reset HEAD $@',
    amend: 'git commit --amend',
    undo: 'git reset --soft HEAD~1',
    branches: 'git branch -a',
    remotes: 'git remote -v'
  }
};

export function getConfigPath() {
  return CONFIG_PATH;
}

export async function ensureConfigExists() {
  try {
    await access(CONFIG_PATH);
  } catch {
    await saveConfig(DEFAULT_CONFIG);
  }
}

export async function loadConfig() {
  try {
    const data = await readFile(CONFIG_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await saveConfig(DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }
    throw error;
  }
}

export async function saveConfig(config) {
  const dir = dirname(CONFIG_PATH);
  
  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
  
  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
}

export async function updateConfig(updater) {
  const config = await loadConfig();
  const updatedConfig = updater(config);
  await saveConfig(updatedConfig);
  return updatedConfig;
}