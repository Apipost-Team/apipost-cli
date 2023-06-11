const _ = require('lodash'),
    libUrl = require('url-parse'),
    libCookie = require('cookie');

function isvalid(url, cookie) {
    const _uri = new libUrl(url);

    // domain
    let _cookieDomain = cookie.domain;

    if (_.isString(_cookieDomain)) {
        _cookieDomain = _cookieDomain.split(':')[0];
    }
    if (_.trim(_cookieDomain) && !_.endsWith(_uri.hostname, _.trim(_cookieDomain))) {
        return false;
    }

    // path
    if (_.trim(cookie.path) && !_.startsWith((_.endsWith(_uri.pathname, '/') ? _uri.pathname : `${_uri.pathname}/`),
        cookie.path)) {
        return false;
    }

    // expire
    if (cookie.expires) {
        const expires = new Date(cookie.expires);
        if (_.isDate(expires) && String(expires) != 'Invalid Date' && _.lt(expires, new Date())) {
            return false;
        }
    }

    // secure
    if (cookie.secure && _uri.protocol != 'https:') {
        return false;
    }

    return {
        cookie: libCookie.serialize(cookie.name, cookie.value, {
            encode: encodeURI,
        }),
        //         cookie: libCookie.serialize(cookie.name, cookie.value)
    };
}

module.exports = isvalid;
module.exports.isvalid = isvalid;
