'use strict';

// Performs sqlite database operation
// e.g. save a new device entry

var PromiseWrapper = require('../util/PromiseWrapper'),
    Promise = require('bluebird'),
    sqlite = require('sqlite3'),
    _ = require('lodash'),
    debug = require('debug')('database'),
    path = require('path'),
    Timer = require('../util/Timer');


var dbs = [];

exports = module.exports = {
    drop: drop,
    save: save,
    saveFast: saveNew,
    get: get,
    query: query,
    status: status,
    getLastId: getLastId,
    test: test
};

// epoch value is in seconds
// We set this to 1 year (from 1970)
var minEpochValue = 356 * 24 * 3600;
var saveCount = 0, cleanPeriod = 100;

var means = [
    {
        name: 'minute',
        modulo: 60
    },
    {
        name: 'hour',
        modulo: 3600
    },
    {
        name: 'day',
        modulo: 86400
    }
];


function mapMeanCol(col) {
    return [
        col+'_min',
        col+'_max',
        col+'_sum',
        col+'_nb'
    ];
}

function createTables(wdb) {
    return function() {
        var promises = [];
        promises.push(wdb.run('CREATE TABLE IF NOT EXISTS entry(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'epoch INTEGER NOT NULL,' +
            'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);'));

        for(var i=0; i<means.length; i++) {
            promises.push(wdb.run('CREATE TABLE IF NOT EXISTS ' + means[i].name + '(epoch INTEGER PRIMARY KEY NOT NULL);'));
        }

        return Promise.all(promises);
    }
}

function createTables1(wdb) {
    return function() {
        var promises = [];
        promises.push(wdb.run('CREATE TABLE IF NOT EXISTS entry(' +
            'id INTEGER PRIMARY KEY NOT NULL,' +
            'epoch INTEGER NOT NULL,' +
            'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,' +
            'event INTEGER,' +
            'eventParam INTEGER);'));

        for(var i=0; i<means.length; i++) {
            promises.push(wdb.run('CREATE TABLE IF NOT EXISTS ' + means[i].name + '(epoch INTEGER PRIMARY KEY NOT NULL);'));
        }

        return Promise.all(promises);
    }
}

function createIndexes(wdb) {
    return function() {
        var promises = [];

        promises.push(wdb.run('CREATE INDEX IF NOT EXISTS entry_epoch_idx ON entry(epoch)'));
        for(var i=0; i<means.length; i++) {
            promises.push(wdb.run('CREATE INDEX IF NOT EXISTS ' + means[i].name + '_epoch ON minute(epoch)'));
        }

        return Promise.all(promises);
    }
}


function getTableInfo(wdb) {
    return function() {
        var promises = [];
        promises.push(wdb.all("PRAGMA table_info(entry);"));

        for(var i=0; i<means.length; i++) {
            promises.push(wdb.all("PRAGMA table_info(" + means[i].name + ");"));
        }

        return Promise.all(promises);
    }
}


function createMissingColumns(wdb, wantedColumns) {
    return function(res) {
        // result comes from getTableInfo
        // expected length of res is 4
        var names = _.pluck(means, 'name');
        var existingColumns = _.pluck(res[0], 'name');
        var missingColumns = _.difference(wantedColumns, existingColumns);

        var promises = [];
        var i;

        for(i=0; i<missingColumns.length; i++) {
//            promises.push(wdb.run('ALTER TABLE entry ADD COLUMN $col INT;', {
//                $col: missingColumns[i]
//            }));
            promises.push(wdb.run('ALTER TABLE entry ADD COLUMN "' + missingColumns[i] + '" INT;'))
        }

        var meanWantedColumns = _.chain(wantedColumns).map(mapMeanCol).flatten().value();



        for(i=0; i<names.length; i++) {
            var ecol = _.pluck(res[i+1], 'name');
            var mcol = _.difference(meanWantedColumns, ecol);

            for(var j=0; j<mcol.length; j++) {
                /*promises.push(wdb.run('ALTER TABLE $name ADD COLUMN $col INT;', {
                 $name: names[i],
                 $col: mcol[j]
                 }));*/
                promises.push(wdb.run('ALTER TABLE ' + names[i] + ' ADD COLUMN "' + mcol[j] + '" INT;'));
            }
        }
        return Promise.all(promises);
    }
}

function getAllEntryIds(wdb) {
    return function() {
        return wdb.all('SELECT id FROM entry;');
    }
}

function getLastEntryId(wdb) {
    return function() {
        return wdb.get('SELECT id FROM entry ORDER BY id DESC');
    }
}

function getAllEntries(wdb) {
    return function() {
        return wdb.all('SELECT * FROM entry');
    }
}

function getEntries(wdb, options) {
    return function() {
        var conditions = [];
        var fields = options.fields;

        if(options.epochFrom) {
            conditions.push('epoch>=' + options.epochFrom);
        }
        if(options.epochTo) {
            conditions.push('epoch<=' + options.epochTo);
        }

        if(options.from) {
            conditions.push('id>=' + options.from);
        }
        if(options.to) {
            conditions.push('id<=' + options.to);
        }


        var condition = (conditions.length) === 0 ? '' : ' WHERE ' + conditions.join(' AND ');
        var query;
        if(fields.indexOf('*') === -1) {
            fields.push('id', 'epoch');
            fields = _.unique(fields);
            query = 'SELECT "' + fields.join('","') + '" FROM entry';
        }
        else {
            query = 'SELECT * FROM entry';
        }
        query += condition;
        query += ' ORDER BY epoch ' + options.order;
        query += ' LIMIT ' + options.limit;
        debug('Get entries');
        return wdb.all(query);
    };
}

function getMeanEntries(wdb, options) {
    return function() {
        var conditions = [];
        var fields = options.fields;
        if(!options.fields) fields = ['*'];
        else {
            fields = _.chain(fields).map(function(c) {return [c+'_min', c + '_max']}).push(
                _.map(fields, function(c) {return c + '_sum' +  '/' + c + '_nb as ' + c + '_mean'})
            ).flatten().value();
        }

        if(options.epochFrom) {
            conditions.push('epoch>=' + options.epochFrom);
        }
        if(options.epochTo) {
            conditions.push('epoch<=' + options.epochTo);
        }


        var condition = (conditions.length) === 0 ? '' : ' WHERE ' + conditions.join(' AND ');
        var query;
        if(fields.indexOf('*') > -1) {
            query = 'SELECT * FROM ' + options.mean;
        }
        else {
            fields.push('epoch');
            fields = _.unique(fields);
            query = 'SELECT ' + fields.join(',') + ' FROM ' + options.mean;
        }

        query += condition;
        query += ' ORDER BY epoch ' + options.order;
        query += ' LIMIT '  + options.limit;
        return wdb.all(query);
    };

}

function keepRecentIds(wdb, maxIds) {
    return function(res) {
        var ids = _.pluck(res, 'id');
        ids.sort().reverse();
        if(ids.length > maxIds) {
            return wdb.run('DELETE FROM entry WHERE id<=' + ids[maxIds]);
        }
        else return true;
    }
}

function getAllMeanEpoch(wdb) {
    return function() {
        var promises = [];
        for(var i=0; i<means.length; i++) {
            promises.push(wdb.all("SELECT epoch FROM " + means[i].name + " ORDER BY epoch DESC"));
        }

        return Promise.all(promises);
    }
}

function keepRecentMeanEpoch(wdb, maxNb) {
    return function(res) {
        var promises = [];
        if(!(maxNb instanceof Array)) {
            maxNb = _.times(means.length, function() { return maxNb; });
        }

        if(maxNb.length !== means.length) {
            throw new Error('Unexpected length of parameter maxNb');
        }
        for(var i=0; i<means.length; i++) {
            if(res[i].length > maxNb) {
                promises.push(wdb.run('DELETE FROM ' + means[i].name + ' where epoch<=' + res[i][maxNb[i]].epoch))
            }
        }
        return Promise.all(promises);
    }
}

function getValues(entry) {
    var values = [];
    for(var key in entry.parameters) {
        var value = entry.parameters[key];
        if(typeof value === 'string') value = "'" + value + "'";
        if(entry.parameters[key] === null) {
            values.push('NULL');
        }
        else {
            values.push(entry.parameters[key]);
        }
    }
    return values;
}

function insertEntries(wdb, entries) {
    return function() {
        if(!entries.length) {
            return Promise.resolve();
        }
        var keys = _.keys(entries[0].parameters);
        var values = new Array(entries.length);

        for (var i = 0; i < entries.length; i++) {
            values[i] = getValues(entries[i]);
        }

        var command = 'INSERT INTO entry (epoch, "' + keys.join('","') + '")' +
            ' values ';
        for(var i = 0; i < values.length; i++) {
            values[i] = '(' + entries[i].epoch + ',' + values[i].join(',') + ')';
        }
        command += values.join(',') + ';';
        return wdb.run(command);
    };
}

function insertEntry(wdb, entry) {
    return function() {
        var keys = _.keys(entry.parameters);
        var values = getValues(entry);
        var command = 'INSERT INTO entry (epoch, "' + keys.join('","') + '")' +
            ' values (' + entry.epoch + ',' + values.join(',') + ')';
        return wdb.run(command);
    }
}


function insertEntry1(wdb, entry) {
    return function() {
        var keys = _.keys(entry.parameters);
        var values = [];
        for(var i=0; i<keys.length; i++) {
            var value = entry.parameters[keys[i]];
            if(typeof value === 'string') value = "'" + value + "'";
            if(entry.parameters[keys[i]] === null) {
                values.push('NULL');
            }
            else {
                values.push(entry.parameters[keys[i]]);
            }
        }


        var command = 'INSERT INTO entry (id, epoch, "' + keys.join('","') + '")' +
            ' values(' + entry.id + ',' + entry.epoch + ',' + values.join(',') + ')';
        return wdb.run(command);
    }
}

function setJoin(s, txt) {
    var r = '';
    var count = 0;
    for(var el of s) {
        r += el;
        count++;
        if(count !== s.size) {
            r += txt;
        }
    }
    return r;
}

function getEntryMean(wdb, entry) {
    return function() {

        var promises = [];
        for(var i=0; i<means.length; i++) {
            var epoch = entry.epoch-(entry.epoch%means[i].modulo);
            promises.push(wdb.all('SELECT * FROM ' + means[i].name + ' WHERE epoch=' + epoch));
        }

        return Promise.all(promises);
    }
}

function getEntriesMean(wdb, entries) {
    return function() {
        var promises = [];
        for(var i = 0; i < means.length; i++) {
            var epochs = new Set();
            for(var j = 0; j<entries.length; j++) {
                epochs.add(entries[j].epoch - (entries[j].epoch % means[i].modulo));
            }
            var command = 'SELECT * FROM ' + means[i].name + ' WHERE epoch=' + setJoin(epochs, ' OR epoch=') + ' ORDER BY epoch ASC;';
            if(epochs.size) promises.push(wdb.all(command));
        }
        return Promise.all(promises);
    }
}



function insertEntryMean(wdb, entry) {
    return function(res) {
        // res contains mean values from database
        var queries = new Array(means.length);
        var columns = _.chain(entry.parameters)
            .keys()
            .map(mapMeanCol)
            .flatten().value();

        for(var i=0; i<means.length; i++) {
            var epoch = entry.epoch-(entry.epoch%means[i].modulo);
            var values;
            if(res[i].length === 0) {
                values = _.chain(entry.parameters)
                    .keys()
                    // Order is min, max, sum, nb
                    .map(function(col) {
                        return [
                            entry.parameters[col], entry.parameters[col], entry.parameters[col], 1
                        ]
                    })
                    .flatten().value();

            }
            else {
                values = _.chain(entry.parameters)
                    .keys()
                    .map(function(col) {
                        var meanCol = _.chain(col).map(mapMeanCol).flatten().value();
                        return [
                            Math.min(res[i][0][meanCol[0]], entry.parameters[col]), Math.max(res[i][0][meanCol[1]], entry.parameters[col]), res[i][0][meanCol[2]] + entry.parameters[col], res[i][0][meanCol[3]] + 1
                        ];
                    })
                    .flatten().map(function(val) {
                        if(val === null) {
                            return 'NULL'
                        }
                        return val;
                    }).value();
            }


            queries[i] = wdb.run("INSERT OR REPLACE INTO " + means[i].name + "(epoch," + columns.join(',') + ")" + " VALUES(" + epoch + "," + values.join(',') + ");");
            //promises.push(wdb.run("INSERT OR REPLACE INTO " + means[i].name + "(epoch," + columns.join(',') + ")" + " VALUES(" + epoch + "," + values.join(',') + ");"));
        }
        return Promise.all(queries);
    }
}

function insertEntriesMean(wdb, entries) {
    return function(res) {
        var queries = [];
        var columns = _.chain(entries[0].parameters)
            .keys()
            .map(mapMeanCol)
            .flatten().value();

        var parameters = Object.keys(entries[0].parameters);

        var idxEntries = new Array(means.length);
        for(var i=0; i<means.length; i++) {
            idxEntries[i] = {};
            for(var j=0; j<entries.length; j++) {
                var epoch = entries[j].epoch - (entries[j].epoch % means[i].modulo);
                var values = _.chain(parameters).map(function(param) {
                    var val = entries[j].parameters[param];
                    return [val, val, val, 1];
                }).flatten().value();
                if(idxEntries[i][epoch]) {
                    idxEntries[i][epoch].push(values);
                } else {
                    idxEntries[i][epoch] = [values];
                }
            }
        }


        for(var i=0; i<means.length; i++) {
            var oldMean = res[i];
            var epochs = _.pluck(oldMean, 'epoch').map(function(v) {
                return v.toString();
            });
            for(var key in idxEntries[i]) {
                var idx = epochs.indexOf(key);
                if(idx > -1) {
                    idxEntries[i][key].push(columns.map(function(col) {
                        return oldMean[idx][col];
                    }));
                }
                idxEntries[i][key] = idxEntries[i][key].reduce(function(prev, current) {
                    var result = current;
                    if(!prev) {
                        return result;
                    }
                    for(var k=0; k<current.length; k++) {
                        switch(k % 4) {
                            case 0:
                                result[k] = Math.min(prev[k], current[k]);
                                break;
                            case 1:
                                result[k] = Math.max(prev[k], current[k]);
                                break;
                            case 2: case 3:
                                result[k] = prev[k] + current[k];
                                break;
                        }
                    }
                    return result;
                });

                idxEntries[i][key].unshift(key);
            }
            var keys = Object.keys(idxEntries[i]);
            var arr = new Array(keys.length);
            for(var j=0; j<keys.length; j++) {
                arr[j] = idxEntries[i][keys[j]];
            }
            var command = "INSERT OR REPLACE INTO " + means[i].name + "(epoch," + columns.join(',') + ")" + " VALUES(" + arr.join('),(') + ");";
            queries.push(wdb.run(command));
        }

        return Promise.all(queries);
    };
}

function handleError(err) {
    debug('Error: ', err);
}

function test() {
    var wdb = getWrappedDB('1000');
    return Promise.resolve()
        .then(createTables1(wdb));
}

function saveNew(entries, options) {
    if(!options.maxRecords) {
        return Promise.reject(new Error('maxRecords option is mandatory'));
    }

    if(!(entries instanceof Array)) {
        entries = [entries];
    }

    entries = entries.filter(function(e) {
        var epochIsOk = e.epoch >= minEpochValue
        if(!epochIsOk) debug('Not saving an entry because epoch to small');
        return epochIsOk;
    });

    if(entries.length === 0) return Promise.resolve();

    var deviceId = entries[0].deviceId;
    var wdb = getWrappedDB(deviceId, options);

    // max records
    var names = _.pluck(means, 'name');
    var maxRecords= [];
    for(var i=0; i<names.length; i++) {
        if(options.maxRecords[names[i]])
            maxRecords.push(options.maxRecords[names[i]])
    }


    var createTablesFn =  createTables;
    var insertEntryFn =  insertEntries;

    function timerStep(msg) {
        return function(arg) {
            debug(msg + ' ' + timer.step('ms'));
            return arg;
        }
    }

    var timer = new Timer();
    timer.start();
    //insertEntryFn = insertEntry;
    var res =  Promise.resolve().then(writeEntries());

    if(saveCount % cleanPeriod === 0) {
        res = res.then(getAllEntryIds(wdb)).then(timerStep('get all entry ids'))
            .then(keepRecentIds(wdb, options.maxRecords.entry)).then(timerStep('keep recent ids'))
            .then(getAllMeanEpoch(wdb, maxRecords)).then(timerStep('get all mean epoch'))
            .then(keepRecentMeanEpoch(wdb, 5)).then(timerStep('keep recent mean epoch'));
    }
    saveCount += 1;

    res.catch(handleError);

    function writeEntries(ok) {
        return function() {
            return Promise.resolve().then(insertEntryFn(wdb, entries)).then(continueEntries, ok ? null : adminDB);
        };
    }

    function continueEntries() {
        timerStep('insert entries');
        return Promise.resolve().then(getEntriesMean(wdb, entries)).then(timerStep('get mean entries'))
            .then(insertEntriesMean(wdb, entries)).then(timerStep('insert mean entries'));
    }

    function adminDB() {
        return Promise.resolve().then(createTablesFn(wdb)).then(timerStep('create tables'))
            .then(createIndexes(wdb)).then(timerStep('create indexes'))
            .then(getTableInfo(wdb)).then(timerStep('get table info'))
            .then(createMissingColumns(wdb, _.keys(entries[0].parameters))).then(timerStep('create missing columns'))
            .then(writeEntries(true));
    }
    return res;
}

function save(entry, options) {


    if(entry instanceof Array) {
        return saveEntryArray(entry, options);
    }

    // Don't save anything that has a small epoch
    // This means the device's epoch has not yet
    // been updated
    if(entry.epoch < minEpochValue) {
        debug('Not saving because small epoch');
        return Promise.resolve();
    }
    var wdb = getWrappedDB(entry.deviceId, options);


    if(!options.maxRecords) {
        return Promise.reject(new Error('maxRecords option is mandatory'));
    }
    var names = _.pluck(means, 'name');
    var maxRecords= [];
    for(var i=0; i<names.length; i++) {
        if(options.maxRecords[names[i]])
            maxRecords.push(options.maxRecords[names[i]])
    }

    if(entry.id) {
        debug('Trying to insert an entry with an id\n' + JSON.stringify(entry));
    }
    var createTablesFn = entry.id ? createTables1 : createTables;
    var insertEntryFn = entry.id ? insertEntry1 : insertEntry;



    function timerStep(msg) {
        return function(arg) {
            debug(msg + ' ' + timer.step('ms'));
            return arg;
        }
    }

    var timer = new Timer();
    timer.start();

    var res =  Promise.resolve().then(writeEntry());

    if(saveCount % cleanPeriod === 0) {
        res = res.then(getAllEntryIds(wdb)).then(timerStep('get all entry ids'))
            .then(keepRecentIds(wdb, options.maxRecords.entry)).then(timerStep('keep recent ids'))
            .then(getAllMeanEpoch(wdb, maxRecords)).then(timerStep('get all mean epoch'))
            .then(keepRecentMeanEpoch(wdb, 5)).then(timerStep('keep recent mean epoch'));
    }
    saveCount += 1;

    res.catch(handleError);

    function writeEntry(ok) {
        return function() {
            return Promise.resolve().then(insertEntryFn(wdb, entry)).then(continueEntry, ok ? null : adminDB);
        };
    }

    function continueEntry() {
        timerStep('insert entry');
        return Promise.resolve().then(getEntryMean(wdb, entry)).then(timerStep('get mean entry'))
            .then(insertEntryMean(wdb, entry)).then(timerStep('insert mean entry'));
    }

    function adminDB() {
        return Promise.resolve().then(createTablesFn(wdb)).then(timerStep('create tables'))
            .then(createIndexes(wdb)).then(timerStep('create indexes'))
            .then(getTableInfo(wdb)).then(timerStep('get table info'))
            .then(createMissingColumns(wdb, _.keys(entry.parameters))).then(timerStep('create missing columns'))
            .then(writeEntry(true));
    }
    return res;
}



function saveEntryArray(entries, options) {
    debug('Save entry array begin');
    var d = new Date().getTime();
    var promise = Promise.resolve();
    for(var i=0; i<entries.length; i++) {
        (function(i) {
            promise = promise.then(function() {
                debug('Save another entry');
                return save(entries[i], options);
            });
        })(i)

    }
    // Log performance when done
    promise.then(function() {
        var delta = new Date().getTime() - d;
    });
    return promise;
}

function get(deviceId, options) {
    if(!deviceId) {
        throw new Error('Invalid device id');
    }
    var defaultOptions = {
        order: 'DESC',
        limit: 500,
        fields: ['*']
    };

    _.defaults(options, defaultOptions);

    var wdb = getWrappedDB(deviceId, options, sqlite.OPEN_READONLY);

    var fn;
    if(options.mean && options.mean !== 'entry') fn = getMeanEntries(wdb, options);
    else fn = getEntries(wdb, options);


    var res =  Promise.resolve()
        .then(fn);


    res.catch(handleError);

    return res;
}

function filterOut(out) {
    if(!(out instanceof Array)) {
        out = [out];
    }
    var paramReg = /^([A-Z]{1,2})(_mean)?$/;

    for(var i=0; i<out.length; i++) {
        out[i].parameters =  {};
        // Unflatten
        for(var key in out[i]) {
            var m = paramReg.exec(key);
            if(m && m[1]) {
                out[i].parameters[m[1]] = out[i][key];
                delete out[i][key];
            }
        }
    }

    if(out.length === 1) {
        return out[0];
    }
    return out;
}

function status(deviceId) {
    var wdb = getWrappedDB(deviceId);
    var first, last;

    var promises = [];
    promises.push(getEntries(wdb, {
        limit: 1,
        order: 'asc',
        fields: ['*']
    })());

    promises.push(getEntries(wdb, {
        limit: 1,
        order: 'desc',
        fields: ['*']
    })());

    promises.push(wdb.run('SELECT count(*) FROM entry'));

    return Promise.all(promises);
}

function getWrappedDB(id, options, mode) {
    options = options || {};
    var dir = options.dir || './sqlite/';

    var file = id + '.sqlite';
    var dbloc = path.join(dir, file);
    var pdb = dbs[id];
    if(!pdb) {
        debug('opening database', dbloc);
        var db = new sqlite.cached.Database(dbloc, mode);
        pdb = new PromiseWrapper(db, ['all', 'run', 'get']);
        pdb.run('PRAGMA synchronous = OFF; PRAGMA journal_mode = MEMORY;');
        dbs[id] = pdb;
    }
    return pdb;
}

function query(id) {
    var wdb = getWrappedDB(id);
    [].shift.apply(arguments);
    return wdb.all.apply(wdb, arguments);
}

function getLastId(deviceId) {
    var wdb = getWrappedDB(deviceId);
    var res = Promise.resolve()
        .then(getLastEntryId(wdb))
        .then(function(res) {
            return res.id;
        });

    res.catch(handleError);
    return res;
}

function drop(deviceId, options) {
    debug('drop table ' + deviceId);
    var wdb = getWrappedDB(deviceId, options);
    var queries = means.map(function(v) {
        var q = 'drop table if exists ' + v.name + ';';
        return wdb.run(q);
    });
    queries.push(wdb.run('drop table if exists entry;'));
    var res = Promise.all(queries);
    res.catch(handleError);
    return res;
}