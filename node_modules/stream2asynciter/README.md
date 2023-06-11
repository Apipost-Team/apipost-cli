# stream2asyncIter

Example code which convert nodejs's stream to async iterator:

```javascript
const stream2asynciter = require('stream2asynciter');

const asyncIterator = stream2asynciter(
    // any readable stream!
    process.stdin
);

(async () => {
    for await (const line of asyncIterator) {
        console.log('readed', line.length / 1024, 'Kb');
    }
})().then(() => {
    console.log('ok!');
    process.exit();
}, err => {
    console.log('err', err);
    process.exit();
});
```

exec

```bash
cat somefile.txt | node test.js
```

and get:

```bash
readed 64 Kb
readed 64 Kb
readed 64 Kb
readed 64 Kb
readed 64 Kb
readed 64 Kb
readed 64 Kb
readed 64 Kb
readed 64 Kb
readed 64 Kb
readed 64 Kb
readed 3.4736328125 Kb
ok!
```
