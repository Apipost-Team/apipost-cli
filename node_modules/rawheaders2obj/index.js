/*
    // allow duplicate headers
    HTTP_HEADER_AGE: 'age',
    HTTP_HEADER_AUTHORIZATION: 'authorization',
    HTTP_HEADER_CONTENT_LENGTH: 'content-length',
    HTTP_HEADER_CONTENT_TYPE: 'content-type',
    HTTP_HEADER_ETAG: 'etag',
    HTTP_HEADER_EXPIRES: 'expires',
    HTTP_HEADER_FROM: 'from',
    HTTP_HEADER_HOST: 'host',
    HTTP_HEADER_IF_MODIFIED_SINCE: 'if-modified-since',
    HTTP_HEADER_IF_UNMODIFIED_SINCE: 'if-unmodified-since',
    HTTP_HEADER_LAST_MODIFIED: 'last-modified',
    HTTP_HEADER_LOCATION: 'location',
    HTTP_HEADER_MAX_FORWARDS: 'max-forwards',
    HTTP_HEADER_PROXY_AUTHORIZATION: 'proxy-authorization',
    HTTP_HEADER_REFERER: 'referer',
    HTTP_HEADER_RETRY_AFTER: 'retry-after',
    HTTP_HEADER_SERVER: 'server',
    HTTP_HEADER_USER_AGENT: 'user-agent',

    // duplicate headers will be discarded (reserve the first)
    HTTP_HEADER_DATE: 'date',
    HTTP_HEADER_VARY: 'vary',
    HTTP_HEADER_ORIGIN: 'origin',
    HTTP_HEADER_EXPECT: 'expect',
    HTTP_HEADER_ACCEPT: 'accept',
    HTTP_HEADER_UPGRADE: 'upgrade',
    HTTP_HEADER_IF_MATCH: 'if-match',
    HTTP_HEADER_CONNECTION: 'connection',
    HTTP_HEADER_CACHE_CONTROL: 'cache-control',
    HTTP_HEADER_IF_NONE_MATCH: 'if-none-match',
    HTTP_HEADER_ACCEPT_ENCODING: 'accept-encoding',
    HTTP_HEADER_ACCEPT_LANGUAGE: 'accept-language',
    HTTP_HEADER_X_FORWARDED_FOR: 'x-forwarded-for',
    HTTP_HEADER_ENCODING: 'content-encoding',
    HTTP_HEADER_X_FORWARDED_HOST: 'x-forwarded-host',
    HTTP_HEADER_ENCODING: 'transfer-encoding',
    HTTP_HEADER_PROTO: 'x-forwarded-proto',

    // cookie
    HTTP_HEADER_COOKIE: 'cookie',
    // set-cookie
    HTTP_HEADER_SET_COOKIE: 'set-cookie'
*/

function matchKnownFields(field, lowercased) {
  switch (field.length) {
    case 3:
      if (field === 'Age' || field === 'age') return 'age';
      break;
    case 4:
      if (field === 'Host' || field === 'host') return 'host';
      if (field === 'From' || field === 'from') return 'from';
      if (field === 'ETag' || field === 'etag') return 'etag';
      if (field === 'Date' || field === 'date') return '\u0000date';
      if (field === 'Vary' || field === 'vary') return '\u0000vary';
      break;
    case 6:
      if (field === 'Server' || field === 'server') return 'server';
      if (field === 'Cookie' || field === 'cookie') return '\u0002cookie';
      if (field === 'Origin' || field === 'origin') return '\u0000origin';
      if (field === 'Expect' || field === 'expect') return '\u0000expect';
      if (field === 'Accept' || field === 'accept') return '\u0000accept';
      break;
    case 7:
      if (field === 'Referer' || field === 'referer') return 'referer';
      if (field === 'Expires' || field === 'expires') return 'expires';
      if (field === 'Upgrade' || field === 'upgrade') return '\u0000upgrade';
      break;
    case 8:
      if (field === 'Location' || field === 'location')
        return 'location';
      if (field === 'If-Match' || field === 'if-match')
        return '\u0000if-match';
      break;
    case 10:
      if (field === 'User-Agent' || field === 'user-agent')
        return 'user-agent';
      if (field === 'Set-Cookie' || field === 'set-cookie')
        return '\u0001';
      if (field === 'Connection' || field === 'connection')
        return '\u0000connection';
      break;
    case 11:
      if (field === 'Retry-After' || field === 'retry-after')
        return 'retry-after';
      break;
    case 12:
      if (field === 'Content-Type' || field === 'content-type')
        return 'content-type';
      if (field === 'Max-Forwards' || field === 'max-forwards')
        return 'max-forwards';
      break;
    case 13:
      if (field === 'Authorization' || field === 'authorization')
        return 'authorization';
      if (field === 'Last-Modified' || field === 'last-modified')
        return 'last-modified';
      if (field === 'Cache-Control' || field === 'cache-control')
        return '\u0000cache-control';
      if (field === 'If-None-Match' || field === 'if-none-match')
        return '\u0000if-none-match';
      break;
    case 14:
      if (field === 'Content-Length' || field === 'content-length')
        return 'content-length';
      break;
    case 15:
      if (field === 'Accept-Encoding' || field === 'accept-encoding')
        return '\u0000accept-encoding';
      if (field === 'Accept-Language' || field === 'accept-language')
        return '\u0000accept-language';
      if (field === 'X-Forwarded-For' || field === 'x-forwarded-for')
        return '\u0000x-forwarded-for';
      break;
    case 16:
      if (field === 'Content-Encoding' || field === 'content-encoding')
        return '\u0000content-encoding';
      if (field === 'X-Forwarded-Host' || field === 'x-forwarded-host')
        return '\u0000x-forwarded-host';
      break;
    case 17:
      if (field === 'If-Modified-Since' || field === 'if-modified-since')
        return 'if-modified-since';
      if (field === 'Transfer-Encoding' || field === 'transfer-encoding')
        return '\u0000transfer-encoding';
      if (field === 'X-Forwarded-Proto' || field === 'x-forwarded-proto')
        return '\u0000x-forwarded-proto';
      break;
    case 19:
      if (field === 'Proxy-Authorization' || field === 'proxy-authorization')
        return 'proxy-authorization';
      if (field === 'If-Unmodified-Since' || field === 'if-unmodified-since')
        return 'if-unmodified-since';
      break;
  }
  if (lowercased) {
    return '\u0000' + field;
  }
  return matchKnownFields(field.toLowerCase(), true);
}


function getObjFromRawHeaders(rawHeaders) {
  const headersMap = {}
  const n = rawHeaders.length
  for (let i = 0; i < n; i += 2) {
    addHeaderLine(rawHeaders[i], rawHeaders[i + 1], headersMap)
  }
  return headersMap
}

function addHeaderLine(field, value, dest) {
  let transformField = matchKnownFields(field);
  const flag = transformField.charCodeAt(0);
  if (flag === 0 || flag === 2) {
    transformField = transformField.slice(1);
    // Make a delimited list
    if (typeof dest[field] === 'string') {
      dest[field] += (flag === 0 ? ', ' : '; ') + value;
    } else {
      dest[field] = value;
    }
  } else if (flag === 1) {
    // Array header -- only Set-Cookie at the moment
    if (dest[field] !== undefined) {
      dest[field].push(value);
    } else {
      dest[field] = [value];
    }
  } else if (dest[field] === undefined) {
    // Drop duplicates
    dest[field] = value;
  }
}

module.exports = {
  getObjFromRawHeaders
}