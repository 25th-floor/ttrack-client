const _ = require('lodash');
const rest = require('rest');
const mime = require('rest/interceptor/mime');
const mimeReg = require('rest/mime/registry');
const errorCode = require('rest/interceptor/errorCode');
const Immutable = require('immutable');

const myro = require('myro');

mimeReg.register(
    'application/json',
    {
        read(str, opts) {
            return Immutable.fromJS(JSON.parse(str));
        },

        write(obj, opts) {
            return JSON.stringify(obj.toJS());
        },
    }
);

const client = rest.wrap(mime).wrap(errorCode);

function fetch(uri) {
    return client(uri).then(res => res.entity);
}

function cancelRequest(req) {
    // console.log('canceling', req);
    if (req.cancel) {
        req.cancel();
    } else if (req.canceled !== true) {
        // req not initialized -> precancel
        req.canceled = true;
    } else {
        throw new Error('unexpected request state');
    }
}

function save(method, uri, obj) {
    return client({ method, path: uri, entity: obj, headers: { 'Content-Type': 'application/json' } })
        .then(function (response) {
            console.log('response', response);
            return response.entity;
        });
}

function collection(uri) {
    const route = myro({ [uri]: 'uri' });
    let _data = Immutable.List();
    let req = null;
    return {
        load() {
            if (req) cancelRequest(req);
            req = { path: uri };
            return fetch(req).then(entity => {
                _data = entity;
                req = null;
            });
        },

        cancel() {
            if (req) cancelRequest(req);
            req = null;
        },

        save(obj) {
            return save('post', route.uri(obj.toJS()), obj);
        },

        list: () => _data,
    };
}

function single(uri) {
    const route = myro({ [uri]: 'uri' });
    let _data = Immutable.Map();
    let req = null;
    return {
        load(params) {
            if (req) cancelRequest(req);
            req = { path: route.uri(params) };
            return fetch(req).then(entity => {
                _data = entity;
                req = null;
            });
        },

        cancel() {
            if (req) cancelRequest(req);
            req = null;
        },

        get: () => _data,

        save(obj) {
            return save('put', route.uri(obj.toJS()), obj);
        },

        remove(params) {
            return client({ method: 'delete', path: route.uri(params), headers: { 'Content-Type': 'application/json' } })
                .then(function (response) {
                    console.log('delete response', response);
                    return response;
                });
        },
    };
}

module.exports = { collection, single };
