var fs = require('fs'),
    path = require('path'),
    knox = require('knox'),
    request = require('request'),
    JSZip = require('jszip'),
    zip = new JSZip(),
    async = require('async'),
    moment = require('moment');

function backup(config) {
    var urlStem = 'http://tiddlyspace.com/bags/',
        options = {
            headers: {
                'X-ControlView': false
            },
            json: true,
            auth: {
                user: config.username,
                pass: config.password
            }
        };
    
    // step 1 - go get the tiddlydata
    async.each(config.bags, function(bag, callback) {
        options.url = urlStem + bag + '/tiddlers.json?fat=1';
        request.get(options, function(err, response, json) {
            if(err) {
                throw err;
            }
            zip.file(bag + '.json', JSON.stringify(json));
            callback();
        });
    }, function(err) {
        if(err) {
            throw err;
        }
        // step 2 - zip it up
        var buffer = zip.generate({type: 'nodebuffer'}),
            timestamp = moment().format('YYYY-MM-DD-HH-mm-ss'),
            fileExtension = '.zip',
            fileName = 'backup-'+timestamp+fileExtension,
            filePath = path.join(__dirname, fileName);
        fs.writeFile(filePath, buffer, function(err) {
            if (err) {
                throw err;
            }
            console.log('written zip file '+fileName);
            console.log('zip size', buffer.length);
            // step 4 - if s3 creds exist, go put the zip to s3
            if(config.s3_api_key) {   
                var client = knox.createClient({
                        key: config.s3_api_key,
                        secret: config.s3_api_secret,
                        bucket: config.s3_bucket,
                        region: config.s3_region
                    }),
                    s = client.putFile(fileName, '/'+fileName, function(err, res){
                        // Always either do something with `res` or at least call `res.resume()`.
                        if(err) {
                            throw err;
                        }
                        res.resume();
                        if(res.statusCode!==200) {
                            throw new Error('S3 returned bad statusCode: '+res.statusCode+', for url: '+res.req.url);
                        }
                    });
                s.on('progress', function() {
                    console.log('s3 upload progress', arguments);
                });
            }
        });
    });
}

module.exports = {
    backup: backup
};