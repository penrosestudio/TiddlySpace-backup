TiddlySpace Backup script
==========================

Backup script for TiddlySpace (optionally run as an iron.io worker). Downloads the contents of a space (public and private bags), zips it up and stores the zip on S3 (optional). Can run as an iron.io worker.

Prerequisites
-------------

    node (tested with v0.10.16)
    npm (tested with v1.3.8)
    
Download the dependencies using `npm install` from the root folder.

Config file format
------------------

The config file format is the same whether the script is running locally or as an IronWorker. Create a file called `config.json` and either follow the format below or copy `config-sample.json`.

    {
        "username": "jonny", // TiddlySpace username that has permission to access the private bags of the space(s) you want to archive
        "password": "biggs123", // TiddlySpace password
        "bags": ["mySpace_public", "mySpace_private"], // an array of TiddlySpace bags to archive
        "s3_api_key": "5Ample5Ample5Ample", // S3 API key / access key
        "s3_api_secret": "n0nsensen0nsensen0nsense" // S3 secret
    }

Usage as a local script
-----------------------

    node app.js

Usage as an IronWorker script
-----------------------------

You need to have `iron_worker` installed locally and an `iron.json` file with your credentials in it. See the iron.io [Node.js documentation](http://dev.iron.io/worker/languages/nodejs/) for setup details.

Testing locally:

    iron_worker run backup --worker-config config.json

Uploading to IronWorker:

    iron_worker upload backup --worker-config config.json
