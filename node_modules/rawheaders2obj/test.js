const test = require('tape')
const { getObjFromRawHeaders } = require('./index')

test('simple', function (t) {
    const rawHeaders = [
        'Server', 'Github.com',
        'Server', 'Gitlab.com',
        'A', 'c',
        'A', 'd',
        'date', 'Tue',
        'date', 'Fri',
        'cookie', 'a=b; b=c',
        'Set-Cookie', 'a=b',
        'Set-Cookie', 'b=c',
        'referer', 'https://github.com',
        'referer', 'https://gitlab.com',
        'Connection', 'close',
        'Content-Length', '2'
    ]

    const rawHeadersObj = {
        Server: 'Github.com',
        A: 'c, d',
        date: 'Tue, Fri',
        cookie: 'a=b; b=c',
        'Set-Cookie': ['a=b', 'b=c'],
        referer: 'https://github.com',
        Connection: 'close',
        'Content-Length': '2'
    }
    const transformObj = getObjFromRawHeaders(rawHeaders)
    t.deepEqual(
        transformObj, rawHeadersObj
    )
    t.end()
})