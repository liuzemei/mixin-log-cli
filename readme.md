### 1. 安装
```
npm install -g mixin-log-cli
```
### 2.  参数介绍
| 参数 | 是否必须 | 含义 |
| - | ---- | ----------------- |
| -k | 是 | keystore的json格式的文件路径 |
| -r | 是 | 获取 log 的 user_id |
| -f | 是 | 要监听的文件路径 |
| -w | 否 | 要监听的关键词，以 `,` 隔开 |
| -s | 否 | 监听文件大小（单位为 KB） |
| -i | 否 | log的时间间隔只对监听文件大小生效（单位为分钟，默认60） |
> 注意： `-w` 和 `-s` 至少得指定一个。

### 3. 使用
举例，文件目录如下：
```
--| log
-----| err.log
-----| out.log
--| src
-----| ...
--| config
-----| keystore.json
--- ...
```
执行如下命令
```cmd
mixin-log-cli -k ./config/keystore.json -r e8e8cd79-cd40-4796-8c54-3a13cfe50115 -f ./err.log -w server,error
```

