const { existsSync, readFileSync, writeFileSync } = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Table = require('cli-table');
const dotenv = require('dotenv');
const result = dotenv.config()

const envFile = './.env';
const envTplFile = './.env-tpl';
const configJsonFile = './config.json';

setupEnvFile();

async function setupEnvFile() {

  if (existsSync(envFile)) {
    await printData(result.parsed);
    return console.log(chalk.green('.env file ready, you can strat your work'));
  }
  console.log(chalk.green('.env file missing... lets prepare the configuration...'));
  console.log(chalk.green('... answer questions and provide required config options'));
  console.log(chalk.yellow('Later you can modify this values in .env file at root of your project'));

  let tpl = readFileSync(envTplFile).toString();

  const tplArr = tpl.split("\n").map((line, index, arr) => {
    const isValue = line.trim().indexOf('#') !== 0 && line.indexOf('=') > 0;
    let message = '';
    let key = '';
    let value = '';

    if(isValue) {
      [key, value] = line.split('=');
      const c = (arr[index-1] || '').trim();
      if(c.indexOf('#') === 0) {
        message = c.substring(1).trim();
      }
    } else {
      value = line;
    }
    return {
      index,
      isValue,
      key: key.trim(),
      value: (value || '').trim(),
      message
    };
  })

  const questions = tplArr.filter(l => l.isValue).map(line => ({
    type: 'text',
    name: line.key,
    message: line.message,
    default: line.value,
  }))


  const data = await inquirer.prompt(questions);

  const newTplArr = tplArr.map(line => ({
    ...line,
    value: line.isValue ? data[line.key] : line.value,
  }))

  tpl = newTplArr.map(o => o.isValue ? `${o.key}=${o.value}` : o.value).join("\n");

  writeFileSync(envFile, tpl);

  console.log(chalk.green('.env file is now ready'));

  await printData(data);

  console.log(chalk.green('You can start your work :)'));
};

async function printData(data) {

  console.log(chalk.green('.env file values'));

  var table = new Table({
    head: ['Key', 'Value'],
  });

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      table.push([key, value]);
    }
  }

  console.log(table.toString());
}
