# urljoins

Trailing-Slash compatible join utility.

# Install

```bash
npm i urljoins
```

# Usage
```typescript
import {urljoins} from "urljoins";

console.log(urljoins("a.test/", "/a", "b")); // a.test/a/b
```

Try on https://npm.runkit.com/urljoins
```javascript
var urljoins = require("urljoins").urljoins;

console.log(urljoins("a.test", {key1: "v1", key2: "v2"})); // a.test?key1=v1&key2=v2
```


# Feature

Trailing-Slash compatible.

```typescript
urljoins("a.test", "/a", "b"); // a.test/a/b
urljoins("a.test/", "/a", "b", "c"); // a.test/a/b/c
```

Spread key-value objects.

```typescript
urljoins("a.test", {key1: "v1", key2: "v2"}); // a.test?key1=v1&key2=v2
urljoins("a.test", {key1: "v1", key2: undefined, key3:"v3"}); // a.test?key1=v1&key2=&key3=v3
urljoins("a.test", {key1: "v1", key2: null, key3: "v3"}); // same as undefined value
urljoins("a.test", {key1: "v1", key2: "v2"}, "/a"); // a.test?key1=v1&key2=v2&/a
urljoins("a.test", {keys: ["v1", "v2"]}); // a.test?keys[]=v1&keys[]=v2
```

Some other trailing (or heading) treatments.

```typescript
urljoins("a.test?", "?a", "b"); // a.test?a&b
```

# Notes
## Parameter Orders
Parameter-Orders are strict.  
When first "?" delimiter is found, all remaining strings are joined as query.

```typescript
/*
 it returns "a.test?key1=v1&/a"
 not "a.test/a?key1=v1"
 */
urljoin("a.test?key1=v1", "/a");
```

## Array(s) of strings

`urljoins` receives Rest Parameter.
So you can spread any string[];

```typescript
const paths = ["a.test", "a", "b"];
urljoins(...paths); // same as urljoins("a.test", "a", "b");
```