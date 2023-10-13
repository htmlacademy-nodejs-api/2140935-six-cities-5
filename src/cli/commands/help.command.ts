import chalk from 'chalk';
import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.bold('   Программа для подготовки данных для REST API сервера.'));
    console.info(chalk.blue('   Пример:'), chalk.green('cli.js --<command> [--arguments]'));
    console.info(chalk.blue('   Команды:'));
    console.info(chalk.green('      --version:'), '# выводит номер версии');
    console.info(chalk.green('      --help:'), '# печатает этот текст');
    console.info(chalk.green('      --import <path>:'), '# импортирует данные из TSV');
    console.info(chalk.green('      --generate <n> <path> <url>'), '# генерирует произвольное количество тестовых данных');
  }
}
