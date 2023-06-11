<p align="center">
  <a href="https://adesign.apipost.cn/" target="_blank">
    <img alt="A-Design Logo" width="360" src="https://img.cdn.apipost.cn/cdn/opensource/apipost-opensource.svg" />
  </a>
</p>

# 🚀 check-valid-cookie
Verify whether a cookie is available for a URL. 
## Install

```
$ npm install check-valid-cookie
```

##  Usage

```javascript
const validCookie = require('check-valid-cookie');
const cookie1 = {
        name: 'foo',
        value: 'bar',
        path: '/site',
        expires: new Date('Tue Jul 01 2025 06:01:11 GMT-0400 (EDT)'),
        maxAge: 1000,
        domain: '.example.com',
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
    },
    cookie2 = {
        name: 'foo',
        value: 'bar',
        path: '/site',
        expires: new Date('Tue Jul 01 1979 06:01:11 GMT-0400 (EDT)'),
        maxAge: 1000,
        domain: '.example.com',
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
    },
    cookie3 = {
        name: 'foo',
        value: 'bar',
        path: '/site',
        expires: new Date('Tue Jul 01 2025 06:01:11 GMT-0400 (EDT)'),
        maxAge: 1000,
        domain: '.not-example.com',
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
    },
    cookie4 = {
        name: 'foo',
        value: 'bar',
        path: '/no-site',
        expires: new Date('Tue Jul 01 2025 06:01:11 GMT-0400 (EDT)'),
        maxAge: 1000,
        domain: '.not-example.com',
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
    };
validCookie.isvalid('https://www.example.com/site', cookie1) //满足， 返回
/*
{
    "cookie": "foo=bar",
    "set-cookie": "foo=bar; Max-Age=1000; Domain=www.example.com; Path=/site/; Expires=Tue, 01 Jul 2025 10:01:11 GMT; HttpOnly; Secure; SameSite=Lax"
}
*/

validCookie.isvalid('https://www.example.com/site', cookie2) //不满足， 返回false
validCookie.isvalid('https://www.example.com/site', cookie3) //不满足， 返回false
validCookie.isvalid('https://www.example.com/site', cookie4) //不满足， 返回false
```
