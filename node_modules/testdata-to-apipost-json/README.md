testData-to-ApiPost-json 将ApiPost流程测试中文件数据转为ApiPost可辨识的JSON格式

# 🎉 特性

- 支持格式 
- txt/csv
```
name,age
join,18
```

- json

```
[
    {"name": "join","age":"18"},
    {"name": "tom"},
    {"name": "cat","age": "20"}
]
```


# 安装

```shell
npm i testdata-to-apipost-json
```

# 基础使用

推荐使用 Webpack 或 Rollup 等支持 tree-shaking 特性的构建工具，无需额外配置即可实现组件按需引入：

```js
import { str2testData } from 'testdata-to-apipost-json';
let json=str2testData(`name,age\r\njoin,18`);
```


# 开源协议

testData-to-ApiPost-json 遵循 [MIT 协议](https://github.com/Apipost-Team/testdata-to-apipost-json)。
