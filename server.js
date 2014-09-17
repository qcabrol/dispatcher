var debug = require('debug')('main'),
    argv = require('minimist')(process.argv.slice(2)),
    network = require('./util/network'),
    SerialQueueManager = require('./lib/SerialQueueManager'),
    EpochManager = require('./scheduler/epoch'),
    CacheDatabase = require('./db/CacheDatabase'),
    Filter = require('./lib/filter'),
    Cache = require('./scheduler/cache'),
    database = require('./db/database'),
    express = require('express'),
    middleware = require('./middleware/common'),
    appconfig = require('./appconfig.json'),
    _ = require('lodash'),
    app = express(),
    path = require('path'),
    fs = require('fs');




// Load configuration file
var configName = (argv.config && (typeof argv.config === 'string')) ? argv.config : 'default';
debug('config name:', configName);
var config = require('./configs/config').load(configName);
var devices = config.devices;



var requestManager = new SerialQueueManager(config);
requestManager.init();
var epochManager = new EpochManager(requestManager);
epochManager.start();

// Cache and Cache database
var cache = new Cache(requestManager);
if(config.sqlite) {
    var cacheDatabase = new CacheDatabase(cache);
    cacheDatabase.start();
}
cache.start();


// Middleware
var validateFilter = middleware.validateParameters( {type: 'filter', name: 'filter'});
var validateDevice = middleware.validateParameters({type: 'device', name: 'device'});

// The static directory is where all the statically served files go
// Like jpg, js, css etc...
app.use(express.static(__dirname + '/static'));

app.use('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

var ipaddress = appconfig.ipaddress || '';
var ipValid = network.validateIp(ipaddress);
app.set("port", appconfig.port || 80);
app.set("ipaddr", ipValid ? appconfig.ipaddress : network.getMyIp() || '127.0.0.1');

var http = require("http").createServer(app);
http.listen(app.get("port"), app.get("ipaddr"), function() {
    console.log('Server launched. Go to ', "http://" + app.get("ipaddr") + ":" + app.get("port"));
});


// The root element redirects to the default visualizer view
var view = '/visualizer/index.html?config=/configs/default.json&viewURL=/views/' + (argv.view || 'dispatcher') + '.json';
app.get('/', function(req, res) {
    res.redirect(301, view);
});

app.get('/status', function(req, res) {
    return res.json(cache.data.status);
});

app.get('/status/:device',
    validateDevice,
    function(req, res) {
        // get parameter from cache
        var device = res.locals.parameters.device;
        return res.json(cache.data.status[device]);
    });

app.get('/param/:device',
    validateDevice,
    function(req, res) {
        var device = res.locals.parameters.device;
        return res.json(cache.data.param[device]);
    }
);

app.get('/param/:device/:param',
    middleware.validateParameters([{name: 'device', type: 'device'}, {name: 'param'}]),
    function(req, res) {
        var device = res.locals.parameters.device;
        var param = res.locals.parameters.param;
        return res.json(cache.data.param[device][param]);
    }
);

app.get('/save',
    middleware.validateParameters([{name: 'device', type: 'device'}, {name: 'param'}, {name: 'value'}]),
    function(req, res) {
        var idx = _.findIndex(config.devices, { 'id': res.locals.parameters.device });
        var devPrefix = config.devices[idx].prefix;
        var cmd = devPrefix + res.locals.parameters.param + res.locals.parameters.value;
        requestManager.addRequest(cmd).then(function() {
            return res.json({ok: true});
        }, function() {
            return res.status(500, {ok: false});
        });
    });

var filter = new Filter();
app.get('/all/:filter', validateFilter, function(req, res) {
    // visualizer filter converts object to an array
    // for easy display in a table
    var entry = cache.get('entry');
    var all = {
        config: devices,
        entry: filter[res.locals.parameters.filter](entry),
        status: cache.data.status
    };

    res.json(all);
});

app.get('/command/:device/:command',
    middleware.validateParameters([{name: 'device', type: 'device'}, {name: 'command'}]),
    function(req, res) {
        var idx = _.findIndex(characters, { 'id': res.locals.parameters.device });
        var prefix = devices[idx].prefix;
        requestManager.addRequest(prefix+res.locals.parameters.command).then(function(entries) {
            return res.json(entries);
        }, function() {
            return res.status(500);
        });
    });

app.post('/command',
    middleware.validateParameters([{name: 'command'}]),
    function(req, res) {
        var cmd = res.locals.parameters.command;
        requestManager.addRequest(cmd).then(function(result) {
            return res.send(result);
        }, function() {
            return res.status(500);
        });
    });

app.get('/database/all/:filter', validateFilter, function(req, res) {
    var all = {};
});

var queryValidator = middleware.validateParameters([
    {name: 'fields', required: false},
    {name: 'device', type: 'device', required: true},
    {name: 'limit', required: false},
    {name: 'mean', required: false}
]);


app.get('/database/:device', queryValidator, function(req, res) {
    var deviceId = cache.data.deviceIds[res.locals.parameters.device];
    var fields = res.locals.parameters.fields || '*';
    var mean = res.locals.parameters.mean || 'entry';
    var limit = res.locals.parameters.limit || 10;
    var options = {
        limit: limit,
        fields: fields.split(','),
        mean: mean
    };

    database.get(deviceId, options).then(function(result) {
        var chart = filter.visualizerChart(res.locals.parameters.device, result);
        return res.status(200).json(chart);
    }).catch(function(err) {
        console.log('Error: ', err);
        console.log('Error stack', err.stack);
        return res.status(400).json('Database error');
    });
});

app.get('/navview/list', middleware.validateParameters({ name: 'dir', required: false}), function(req, res){
    var dir = './static/views';
    if(res.locals.parameters.dir) {
        if(res.locals.parameters.dir.indexOf('..') > -1) {
            return res.status(400).json();
        }
        dir = path.join(dir, res.locals.parameters.dir);
        console.log('dir: ', dir);
    }
    console.log('get directories');
    var list = getDirectories(dir, res.locals.parameters.dir);
    if(!list) {
        return res.status(404).json();
    }
    list.map(function(el) {
        el.rel = res.locals.parameters.dir ? path.normalize(res.locals.parameters.dir) + '/' :  './';
        return el;
    });
    return res.status(200).json(list);
});

function getDirectories(dir, relDir) {
    try{
        console.log(dir, relDir);
        return fs.readdirSync(dir).filter(function(file) {
            return file[0] !== '.';
        }).map(function (file) {
            return {
                name: file,
                isDir: fs.statSync(path.join(dir, file)).isDirectory(),
                rel: dir,
                url: path.join('/views/', relDir || '', file)
            };
        });
    }
    catch(err) {
        console.log(err);
        return null;
    }

}