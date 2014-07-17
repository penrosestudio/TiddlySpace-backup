var fs = require('fs'),
    path = require('path'),
    config = JSON.parse(fs.readFileSync(path.join(__dirname,'config.json'), 'utf8')),
    backup = require('./backup');
    
backup.backup(config);