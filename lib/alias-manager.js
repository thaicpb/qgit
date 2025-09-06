import chalk from 'chalk';
import { loadConfig, updateConfig } from './config.js';

export async function addAlias(alias, command) {
  const config = await loadConfig();
  
  if (config.aliases && config.aliases[alias]) {
    throw new Error(`Alias "${alias}" already exists. Use 'mygit edit' to modify it.`);
  }
  
  await updateConfig(cfg => ({
    ...cfg,
    aliases: {
      ...cfg.aliases,
      [alias]: command
    }
  }));
}

export async function removeAlias(alias) {
  const config = await loadConfig();
  
  if (!config.aliases || !config.aliases[alias]) {
    throw new Error(`Alias "${alias}" not found`);
  }
  
  await updateConfig(cfg => {
    const { [alias]: removed, ...rest } = cfg.aliases;
    return {
      ...cfg,
      aliases: rest
    };
  });
}

export async function editAlias(alias, newCommand) {
  const config = await loadConfig();
  
  if (!config.aliases || !config.aliases[alias]) {
    throw new Error(`Alias "${alias}" not found`);
  }
  
  await updateConfig(cfg => ({
    ...cfg,
    aliases: {
      ...cfg.aliases,
      [alias]: newCommand
    }
  }));
}

export async function listAliases() {
  const config = await loadConfig();
  
  if (!config.aliases || Object.keys(config.aliases).length === 0) {
    console.log(chalk.yellow('No aliases configured yet.'));
    console.log(chalk.gray('Use "mygit add <alias> <command>" to add your first alias.'));
    return;
  }
  
  console.log(chalk.cyan.bold('\n📝 Configured Aliases:\n'));
  
  const maxAliasLength = Math.max(...Object.keys(config.aliases).map(a => a.length));
  
  const sortedAliases = Object.entries(config.aliases).sort(([a], [b]) => a.localeCompare(b));
  
  for (const [alias, command] of sortedAliases) {
    const paddedAlias = alias.padEnd(maxAliasLength + 2);
    console.log(`  ${chalk.green(paddedAlias)} → ${chalk.gray(command)}`);
  }
  
  console.log('\n' + chalk.gray('Tip: Use "mygit <alias> [args]" to execute an alias'));
  console.log(chalk.gray('     Parameters: $1, $2, ... for specific args, $@ for all args\n'));
}