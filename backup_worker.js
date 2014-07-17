var worker = require('node_helper'),
    config = worker.config,
    backup = require('./backup');

backup.backup(config);