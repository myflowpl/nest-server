const { existsSync, readFileSync, writeFileSync } = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Table = require('cli-table');
const dotenv = require('dotenv');
const result = dotenv.config()

const envFile = './.env';
const envTplFile = './.env-tpl';
const configJsonFile = './config.json';

(async function() {
  if (result.parsed) {
    await setupConfigJsonFile(result.parsed);
  } else {
    await setupEnvFile();
  }
})()

async function setupConfigJsonFile(config) {
  config = {
    ...config,
    SOURCE: 'from assets config.json file (dev only)'
  };
  writeFileSync(configJsonFile, JSON.stringify(config, null, 2));
  console.log(chalk.green(`Plik ${configJsonFile} został uaktualniony konfiguracją z pliku .env`));
  await printData(config);
}

async function setupEnvFile() {

  if (existsSync(envFile)) {
    return console.log(chalk.green('Ten projekt ma plik .env i jest gotowy do pracy'));
  }
  console.log(chalk.green('Brak pliku .env !!!'));
  console.log(chalk.green('Podaj wymaganą konfigurację odpowiadając na poniższe pytania'));
  console.log(chalk.yellow('W razie potrzeby później możesz ręcznie edytować plik .env'));

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

  console.log(chalk.green('Plik konfiguracyjny .env jest gotowy'));

  await setupConfigJsonFile(data);

  console.log(chalk.green('Można rozpocząć pracę :)'));
};

async function printData(data) {

  console.log(chalk.green('Konfiguracja:'));

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
