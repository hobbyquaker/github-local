#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
const request = require('request');
const mkdirp = require('mkdirp');
const ora = require('ora');

const config = require('./config.js');

const baseUrl = config.token ?
    'https://' + config.user + ':' + config.token + '@api.github.com/' :
    'https://api.github.com/';

const queue = [];
const repos = [];

let spinnerText = 'Populating Repository Queue';

const spinner = ora();

getUserRepos()
    .then(getStarredRepos)
    .then(getWatchedRepos)
    .then(shiftQueue);

function getUserRepos() {
    return new Promise(resolve => {
        spinnerText = 'Populating Repository Queue with User Repos';
        spinner.start(spinnerText);
        getRepos('users/' + config.user + '/repos', 1, () => {
            spinner.succeed();
            resolve();
        });
    });
}

function getStarredRepos() {
    return new Promise(resolve => {
        if (config.starred) {
            spinnerText = 'Populating Repository Queue with Starred Repos';
            spinner.start(spinnerText);
            getRepos('users/' + config.user + '/starred', 1, () => {
                spinner.succeed();
                resolve();
            });
        } else {
            resolve();
        }
    });
}

function getWatchedRepos() {
    return new Promise(resolve => {
        if (config.watched) {
            spinnerText = 'Populating Repository Queue with Watched Repos';
            spinner.start(spinnerText);
            getRepos('users/' + config.user + '/watched', 1, () => {
                spinner.succeed();
                resolve();
            });
        } else {
            resolve();
        }
    });
}

function getRepos(path, page, cb) {
    request({
        url: baseUrl + path + '?page=' + page,
        headers: {
            'User-Agent': 'node_request'
        },
        json: true
    }, (err, res, body) => {
        if (err) {
            spinner.fail(err.message);
            process.exit(1);
        } else if (body && body.message) {
            spinner.fail(body.message);
            process.exit(1);
        } else if (body && body.length > 0) {
            body.forEach(repo => {
                queuePush(repo);
            });
            spinner.text = spinnerText + ' ' + '.'.repeat(page);
        }
        if (body && body.length > 0) {
            getRepos(path, page + 1, cb);
        } else if (typeof cb === 'function') {
            cb();
        }
    });
}

function queuePush(repo) {
    if (!repos.includes(repo.full_name)) { // eslint-disable-line camelcase
        repos.push(repo.full_name); // eslint-disable-line camelcase
        queue.push([repo.full_name, repo.clone_url]); // eslint-disable-line camelcase
    }
}

function shiftQueue() {
    if (queue.length > 0) {
        let cmd;
        const [fullName, cloneUrl] = queue.shift();
        if (fs.existsSync(path.join(config.path, fullName, '.git'))) {
            spinner.start('pull  ' + fullName);
            cmd = 'git -C ' + path.join(config.path, fullName) + ' pull';
        } else {
            spinner.start('clone ' + fullName);
            const userPath = path.join(config.path, fullName.split('/')[0]);
            if (!fs.existsSync(userPath)) {
                mkdirp.sync(userPath);
            }
            cmd = 'git clone ' + cloneUrl + ' ' + path.join(config.path, fullName);
        }
        exec(cmd, err => {
            if (err) {
                spinner.fail(err.message);
            } else {
                spinner.succeed();
            }
            setImmediate(shiftQueue);
        });
    } else {
        spinner.succeed();
    }
}
