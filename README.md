# github-local

[![npm version](https://badge.fury.io/js/github-local.svg)](http://badge.fury.io/js/github-local)
[![dependencies Status](https://david-dm.org/hobbyquaker/github-local/status.svg)](https://david-dm.org/hobbyquaker/github-local)
[![Build Status](https://travis-ci.org/hobbyquaker/github-local.svg?branch=master)](https://travis-ci.org/hobbyquaker/github-local)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License][mit-badge]][mit-url]

> Clone/Pull all your Github Repositories

I'm using this to keep a local copy of all my Repositories and all Repositories I'm watching and I've starred.

## Install

Requirements: Node.js >= 6, git in PATH.

`$ npm install -g github-local`


## Usage

Create a directory e.g. `/srv/github` and run `github-local --user=YourGithubUser --path=/srv/github`. You are not 
forced to use a Github API Token, but if you don't you will probably hit the API rate limit (depending on the number
of repos you have), so it's strongly advised to use one.


### Command Line Options

``` 
github-local [args]

Options:
  --version      Show version number                                   [boolean]
  --user, -u     Github User                                          [required]
  --token, -t    Github API Token
  --path, -p     Path to store cloned Repos                           [required]
  --starred, -s  Include starred Repos                                 [boolean]
  --watched, -w  Include watched Repos                                 [boolean]
  --help         Show help                                             [boolean]
```

### Environment Variables

All Command Line Options can be supplied by environment variables. Prefix them with `GL_` and use uppercase, e.g.
`GL_TOKEN=1234567890abcdef`.


## License

MIT © [Sebastian Raff](https://github.com/hobbyquaker)


[mit-badge]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat
[mit-url]: LICENSE
