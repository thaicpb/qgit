import { execa } from 'execa';
import chalk from 'chalk';
import { loadConfig } from './config.js';

function parseCommand(commandTemplate, args) {
  let command = commandTemplate;
  
  if (args.length === 0) {
    command = command.replace(/\$@|\$\d+/g, '');
  } else {
    if (command.includes('$@')) {
      command = command.replace('$@', args.join(' '));
    }
    
    for (let i = 0; i < args.length; i++) {
      const placeholder = `$${i + 1}`;
      if (command.includes(placeholder)) {
        command = command.replace(new RegExp(`\\$${i + 1}`, 'g'), args[i]);
      }
    }
  }
  
  command = command.replace(/\$\d+/g, '');
  
  return command.trim();
}

export async function executeAlias(alias, args = []) {
  try {
    const config = await loadConfig();
    const commandTemplate = config.aliases[alias];
    
    if (!commandTemplate) {
      throw new Error(`Alias "${alias}" not found`);
    }
    
    const fullCommand = parseCommand(commandTemplate, args);
    
    console.log(chalk.gray(`→ Executing: ${fullCommand}`));
    console.log();
    
    const [cmd, ...cmdArgs] = fullCommand.split(' ');
    
    const { stdout, stderr, exitCode } = await execa(cmd, cmdArgs, {
      stdio: 'inherit',
      shell: true,
      preferLocal: true,
      reject: false
    });
    
    if (exitCode !== 0 && exitCode !== null) {
      process.exit(exitCode);
    }
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(chalk.red(`✗ Command not found: ${error.message}`));
    } else {
      console.error(chalk.red(`✗ Error executing command: ${error.message}`));
    }
    process.exit(1);
  }
}

export async function executeRawCommand(command) {
  try {
    console.log(chalk.gray(`→ Executing: ${command}`));
    console.log();
    
    const { stdout, stderr, exitCode } = await execa(command, {
      stdio: 'inherit',
      shell: true,
      preferLocal: true,
      reject: false
    });
    
    if (exitCode !== 0 && exitCode !== null) {
      process.exit(exitCode);
    }
    
  } catch (error) {
    console.error(chalk.red(`✗ Error: ${error.message}`));
    process.exit(1);
  }
}