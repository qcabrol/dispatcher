'use strict';

var _ = require('lodash');
var util = require('../util/util');
var config = require('../configs/config');
var debug = require('debug')('filter');

var Filter = exports = module.exports = function Filter() {
    this.config = config;
};

Filter.prototype.flattenEntries = function (entries) {
    if (!Array.isArray(entries)) {
        return flattenEntry(entries);
    }
    var r = new Array(entries.length);
    for (var i = 0; i < entries.length; i++) {
        r[i] = flattenEntry(entries[i])
    }
    return r;
};

function flattenEntry(entry) {
    var r = {};
    for (var key in entry) {
        if (key !== 'parameters') {
            r[key] = entry[key];
        } else {
            for (var k in entry.parameters) {
                r[k] = entry.parameters[k];
            }
        }
    }
    return r;
}

Filter.prototype.deepenEntries = function (entries) {
    if (!Array.isArray(entries)) {
        return deepenEntry(entries);
    }
    var r = new Array(entries.length);
    for (var i = 0; i < entries.length; i++) {
        r[i] = deepenEntry(entries[i]);
    }
    return r;
};

function deepenEntry(entry) {
    var keys = getKeys([entry]);
    var e = {parameters: entry.parameters || {}};
    for (var key in entry) {
        if (keys.indexOf(key) > -1) {
            e.parameters[key] = entry[key];
        } else {
            e[key] = entry[key];
        }
    }
    return e;
}

Filter.prototype.visualizer = function (entries) {

    var filtered = {};

    for (var id in entries) {
        var dev = this.visualizerDevice(id, entries[id]);
        if (dev) {
            filtered[id] = dev;
        }
    }

    return filtered;
};

Filter.prototype.visualizerDevice = function (id, entry) {
    var filtered = {};
    if (!entry || !entry.parameters) {
        return null;
    }
    filtered.parameters = [];
    filtered.epoch = entry.epoch;
    filtered.deviceId = entry.deviceId;
    // Find the device in the config by id

    var device = this.config.findDeviceById(id);
    for (var key in device.parameters) {
        if (!entry.parameters.hasOwnProperty(key)) continue;
        filtered.parameters.push({
            name: key,
            mappedName: device.parameters[key] ? device.parameters[key].name : 'NA',
            value: normalizeParameterValue(device, key, entry.parameters[key]),
            label: device.parameters[key] ? device.parameters[key].label : 'NA'
        });
    }
    return filtered;
};

Filter.prototype.visualizerChart = function (id, entries) {
    var that = this;
    var chart = {
        type: 'chart',
        value: {
            title: 'data',
            data: []
        }
    };

    var filteredEntries = _.map(entries, function (val) {
        return that.visualizerDevice(id, val);
    });


    for (var key in filteredEntries[0].parameters) {
        var x = [];
        var y = [];
        for (var i = 0; i < filteredEntries.length; i++) {
            x.push(filteredEntries[i].epoch);
            y.push(filteredEntries[i].parameters[key]);
        }
        chart.value.data.push(
            {
                x: x,
                y: _.pluck(y, 'value')
            }
        );
    }


    return chart;
};

Filter.prototype.chartFromDatabaseEntries = function (dbEntries, deviceId) {
    var device = this.config.findDeviceById(deviceId);

    if (!(dbEntries instanceof Array)) {
        dbEntries = [dbEntries];
    }
    // Check if those are normal or mean values
    var isMean = _(dbEntries[0]).keys().any(function (key) {
        return key.indexOf('mean') > -1;
    });

    if (isMean) {
        return chartFromMeanDbEntries(dbEntries, device);
    }
    else {
        return chartFromDbEntries(dbEntries, device);
    }
};

Filter.prototype.normalizeData = function (dbEntries, deviceId) {
    var device = this.config.findDeviceById(deviceId);
    if (!(dbEntries instanceof Array)) {
        dbEntries = [dbEntries];
    }
    // Check if those are normal or mean values
    var isMean = _(dbEntries[0]).keys().any(function (key) {
        return key.indexOf('mean') > -1;
    });

    if (!isMean) {
        return normalizeDataFromEntries(dbEntries, device);
    }
    else {
        return normalizeDataFromMeanEntries(dbEntries, device);
    }
};

function normalizeDataFromEntries(dbEntries, device) {
    debug('normalize data from entries');
    var keys = getKeys(dbEntries);
    var normalized = _.map(dbEntries, function (val) {
        var obj = {};
        obj.epoch = val.epoch * 1000;
        obj.id = val.id;
        for (var i = 0; i < keys.length; i++) {
            obj[keys[i]] = normalizeParameterValue(device, keys[i], val[keys[i]]);
        }
        return obj;
    });

    return normalized;
}

function normalizeDataFromMeanEntries(dbEntries, device) {
    debug('normalize data from mean entries');
    var keys = getMeanKeys(dbEntries);
    var normalized = _.map(dbEntries, function (val) {
        var obj = {};
        obj.epoch = val.epoch * 1000;
        for (var i = 0; i < keys.length; i++) {
            var paramName = keys[i].replace('_mean', '');
            obj[paramName] = normalizeParameterValue(device, paramName, val[keys[i]]);
            obj[paramName + '_min'] = normalizeParameterValue(device, paramName, val[paramName + '_min']);
            obj[paramName + '_max'] = normalizeParameterValue(device, paramName, val[paramName + '_max']);
        }
        return obj;
    });

    return normalized;
}

function normalizeParameterValue(device, paramName, value) {
    if (value === null) return null;
    var factor = device.parameters[paramName].factor || 1;
    var calibFactor = device.parameters[paramName].calibFactor || 1;
    var calibOffset = device.parameters[paramName].calibOffset || 0;
    var offset = device.parameters[paramName].offset || 0;
    return calibFactor * (value + offset) * (+factor) + calibOffset;
}

function getMeanKeys(dbEntries) {
    return _(dbEntries[0]).keys().filter(function (key) {
        return key.match(/^[A-Z]{1,2}_mean$/);
    }).value();
}

function getKeys(dbEntries) {
    return _(dbEntries[0]).keys().filter(function (key) {
        return key.match(/^[A-Z]{1,2}$/);
    }).value();
}

function chartFromMeanDbEntries(dbEntries, device) {
    var chart = {
        type: 'chart',
        value: {
            title: 'data',
            data: []
        }
    };

    var keys = getMeanKeys(dbEntries);


    for (var i = 0; i < keys.length; i++) {
        var x = [], y = [], min = [], max = [];
        for (var j = 0; j < dbEntries.length; j++) {
            x.push(dbEntries[j].epoch * 1000);
            y.push(normalizeParameterValue(device, keys[i][0], dbEntries[j][keys[i]]));
            min.push(normalizeParameterValue(device, keys[i][0], dbEntries[j][keys[i].replace('_mean', '_min')]));
            max.push(normalizeParameterValue(device, keys[i][0], dbEntries[j][keys[i].replace('_mean', '_max')]));
        }
        chart.value.data.push({x: x, y: y});
        chart.value.data.push({serieType: 'zone', x: x, yMin: min, yMax: max});
    }

    return chart;
}

function chartFromDbEntries(dbEntries, device) {
    var chart = {
        type: 'chart',
        value: {
            title: 'data',
            data: []
        }
    };

    var keys = getKeys(dbEntries);

    for (var i = 0; i < keys.length; i++) {
        var x = [];
        var y = [];
        for (var j = 0; j < dbEntries.length; j++) {
            x.push(dbEntries[j].epoch * 1000);
            y.push(normalizeParameterValue(device, keys[i], dbEntries[j][keys[i]]));
        }
        chart.value.data.push({x: x, y: y});
    }
    return chart;
}

