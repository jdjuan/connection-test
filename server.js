import { testActiveDirectory } from './directory.js';
import { testDatabase } from './database.js';
// console.log(process.env);

if (process.env.script === 'database') {
  testDatabase();
} else {
  testActiveDirectory();
}
