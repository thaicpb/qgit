#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { loadConfig, saveConfig, getConfigPath, ensureConfigExists } from './lib/config.js';
import { executeAlias } from './lib/executor.js';
import { addAlias, removeAlias, listAliases, editAlias } from './lib/alias-manager.js';

async function main() {
  await ensureConfigExists();
  
  program
    .name('mygit')
    .description('Custom git command aliases manager')
    .version('1.0.0');

  program
    .command('add <alias> <command>')
    .description('Add a new alias')
    .action(async (alias, command) => {
      try {
        await addAlias(alias, command);
        console.log(chalk.green(`✓ Alias "${alias}" added successfully`));
      } catch (error) {
        console.error(chalk.red(`✗ Error: ${error.message}`));
      }
    });

  program
    .command('remove <alias>')
    .aliases(['rm', 'delete'])
    .description('Remove an alias')
    .action(async (alias) => {
      try {
        await removeAlias(alias);
        console.log(chalk.green(`✓ Alias "${alias}" removed successfully`));
      } catch (error) {
        console.error(chalk.red(`✗ Error: ${error.message}`));
      }
    });

  program
    .command('edit <alias> <newCommand>')
    .description('Edit an existing alias')
    .action(async (alias, newCommand) => {
      try {
        await editAlias(alias, newCommand);
        console.log(chalk.green(`✓ Alias "${alias}" updated successfully`));
      } catch (error) {
        console.error(chalk.red(`✗ Error: ${error.message}`));
      }
    });

  program
    .command('list')
    .aliases(['ls'])
    .description('List all aliases')
    .action(async () => {
      await listAliases();
    });

  program
    .command('config')
    .description('Show config file path')
    .action(() => {
      console.log(chalk.cyan('Config file location:'), getConfigPath());
    });

  program
    .arguments('<alias> [args...]')
    .description('Execute an alias command')
    .action(async (alias, args) => {
      try {
        const config = await loadConfig();
        
        if (!config.aliases || !config.aliases[alias]) {
          console.error(chalk.red(`✗ Alias "${alias}" not found`));
          console.log(chalk.yellow('Tip: Use "mygit list" to see all available aliases'));
          process.exit(1);
        }

        await executeAlias(alias, args);
      } catch (error) {
        console.error(chalk.red(`✗ Error: ${error.message}`));
        process.exit(1);
      }
    });

  if (process.argv.length === 2) {
    program.outputHelp();
  }

  program.parse(process.argv);
}

main().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});