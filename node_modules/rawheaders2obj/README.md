# rawheaders2obj

Parse http rawHeaders to object without lowercase.

## Installation

```
npm install rawheaders2obj
```

## Example

### Input

```javascript
const { getObjFromRawHeaders } = require("./index")
const rawHeadersObj = [
  "Server",
  "Github.com",
  "Server",
  "Gitlab.com",
  "A",
  "c",
  "A",
  "d",
  "date",
  "Tue",
  "date",
  "Fri",
  "cookie",
  "a=b; b=c",
  "set-cookie",
  "a=b",
  "set-cookie",
  "b=c",
  "referer",
  "https://github.com",
  "referer",
  "https://gitlab.com",
  "Connection",
  "close",
  "Content-Length",
  "2"
]
const transformObj = getObjFromRawHeaders(rawHeaders)

console.log(transformObj)
```

### Output

```
{
    Server: 'Github.com',
    A: 'c, d',
    date: 'Tue, Fri',
    cookie: 'a=b; b=c',
    'set-cookie': [ 'a=b', 'b=c' ],
    referer: 'https://github.com',
    Connection: 'close',
    'Content-Length': '2'
}
```

## License

MIT
