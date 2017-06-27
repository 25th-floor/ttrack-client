const rest = require('rest');
const mime = require('rest/interceptor/mime');
const mimeReg = require('rest/mime/registry');
const errorCode = require('rest/interceptor/errorCode');
const Immutable = require('immutable');

const myro = require('myro');

mimeReg.register(
    'application/json',
    {
        read(str) {
            return Immutable.fromJS(JSON.parse(str));
        },

        write(obj) {
            return JSON.stringify(obj.toJS());
        },
    },
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
        req.canceled = true; // eslint-disable-line no-param-reassign
    } else {
        throw new Error('unexpected request state');
    }
}

function save(method, uri, obj) {
    return client({ method, path: uri, entity: obj, headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
            console.info('response', response);
            return response.entity;
        });
}

function collection(uri) {
    const route = myro({ [uri]: 'uri' });
    let data = new Immutable.List();
    let req = null;
    return {
        load() {
            if (req) cancelRequest(req);
            req = { path: uri };
            return fetch(req).then((entity) => {
                data = entity;
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

        list: () => data,
    };
}

function single(uri) {
    const route = myro({ [uri]: 'uri' });
    let data = new Immutable.Map();
    let req = null;
    return {
        load(params) {
            if (req) cancelRequest(req);
            req = { path: route.uri(params) };
            return fetch(req).then((entity) => {
                data = entity;
                req = null;
            });
        },

        cancel() {
            if (req) cancelRequest(req);
            req = null;
        },

        get: () => data,

        save(obj) {
            return save('put', route.uri(obj.toJS()), obj);
        },

        remove(params) {
            return client({
                method: 'delete',
                path: route.uri(params),
                headers: { 'Content-Type': 'application/json' },
            })
                .then((response) => {
                    console.info('delete response', response);
                    return response;
                });
        },
    };
}

module.exports = { collection, single };
