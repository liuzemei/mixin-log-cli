### 1. 安装
```
npm install -g mixin-log-cli
```
### 2.  参数介绍
| 参数 | 是否必须 | 含义 |
| - | ---- | ----------------- |
| -f | 是 | `filepath`:要监听的文件路径 |
| -t | 否 | `keystore`:keystore的json格式的文件路径 |
| -k | 否 | `keystore`:keystore的json格式的文件路径 |
| -r | 否 | `recipient_id`:获取 log 的 user_id |
| -w | 否 | `keyword`:要监听的关键词，以 `,` 隔开 |
| -s | 否 | `filesize`:监听文件大小（单位为 KB） |
| -i | 否 | `interval`:log的时间间隔只对监听文件大小生效（单位为分钟，默认60） |
> 注意： 
> 1. `-t` 和 `-k` 至少得指定一个。
> 2. 如果指定 `-k` ，则必须指定 `-r`。
> 3. `-w` 和 `-s` 至少得指定一个。

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
1. 只指定 token 。获取 token 方法，请添加机器人 `7000000012` 获取
```cmd
mixin-log-cli -f ./log/err.log -t jeeQLRBBBjutOGas4al2OYXumcVpQMomG544c2rZmdvzbjql6EK1WKY5EdrLNv0e -w server,error
```

2. 只指定 keystore 和 receipient_id
```cmd
mixin-log-cli -f ./log/err.log -k ./config/keystore.json -r e8e8cd79-cd40-4796-8c54-3a13cfe50115  -w server,error
```

3. 也可以同时指定。会分别发送。

