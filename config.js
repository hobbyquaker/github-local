const pkg = require('./package.json');

process.title = pkg.name;

module.exports = require('yargs')
    .usage('$0 [args]')

    .describe('user', 'Github User')
    .required('user')
    .alias('user', 'u')

    .describe('token', 'Github API Token')
    .alias('token', 't')

    .describe('path', 'Path to store cloned Repos')
    .required('path')
    .alias('path', 'p')

    .describe('starred', 'Include starred Repos')
    .boolean('starred')
    .alias('starred', 's')

    .describe('watched', 'Include watched Repos')
    .boolean('watched')
    .alias('watched', 'w')

    .help()
    .env('GL')
    .argv;
