# MongoDB

## 文档型数据库(和mysql对应关系)
SQL术语|MongoDB术语/概念|解释/说明
---|---|---
database|database|数据库
table|collection|数据库表/集合
row|document|数据记录行/文档
column|field|数据字段/域
index|index|索引
table joins| | 表链接,MongoDB不支持
||嵌入文档|MongoDB通过嵌入式文档来替代多表链接
primary key|primary key | 主键,MongoDB自动将_id字段设置为主键

<!-- more -->

## 安装配置
1. 配置数据库目录 mongod --dbpath=../data/db
2. 配置环境变量(mac) .bash_profile 中添加 export PATH=${PATH}:/usr/local/MongoDB/bin  source .bash_profile 立即生效
3. 配置相关信息

## 数据类型
类型|类型值
---|---
Double|1
String|2
Object|3
Array|4
Binary data|5
Object id|7
Date|8
Null|9
Regular expression|10
JavaScript code|11
Symbol|13
JavaScript code with scope|14
32-bit integer|16
Timestamp|6
64-bit integer|17
Timestamp|18
Min key|255
Max key|127

## 常用命令
命令|解释
---|---
mongo --host=${ip地址}|链接数据库
show dbs|展示数据库|
use ${dbname}|创建或选择数据库,没有数据库则创建
db.dropDatabase()| 删除当前数据库
默认库admin|'root'数据库，要是将一个用户添加到这个库，这个用户自动继承所有数据库权限，一些特定的服务器命令只能从这个数据库运行，比如列出所有的数据库或关闭数据库
默认库local|这个数据永远不好被复制，可以用来存储限于本地单台服务器的任意集合
默认库config|当mongo用于分片设置时，config数据库在内部使用，用于保存分片的相关信息
db|数据库类 可以调用方法，用法类似类似js
db.createCollection('${集合名称}')|创建集合
show collections|查看集合
db.${集合名称}.drop()|删除集合
...|...|
插入数据| `db.${集合名称}.insert({json格式数据})`
插入多条数据|`db.${集合名称}.insertMany([{},{}])`
查询集合数据|`db.${集合名称}.find({查询条件})`
查询一条|`db.${集合名称}.findOne({查询条件})`
查询部分字段|`db.${集合名称}.find({查询条件},{_id:0})`  // 0表示去除字段
批量插入可以添加try|`try{...}catch(err){print(err)}`
清空集合|`db.${集合名称}.drop()`
...|...|
覆盖修改数据（覆盖更新,用新的数据替换原来的）|`db.${集合名称}.update({查询条件},{更新信息})`
局部修改|`db.${集合名称}.update({查询条件},{$set:{更新信息}})`
批量修改|`db.${集合名称}.update({查询条件},{$set:{更新信息}},{multi:true})`
增加列| `db.${集合名称}.update({查询条件},{$inc:{likenum:Number(1)}})`
...|...|
删除文档|`db.${集合名称}.remove({查询条件})` // 查询条件为空表示删除所有数据
统计查询|`db.${集合名称}.count({查询条件})` // 查询条件为空表示查询所有
分页列表查询|`db.${集合名称}.limit(2).skip(2)` // limit:查询条数 skip:第几条开始查
排序查询|`db.${集合名称}.find({查询条件}).sort({id:1/-1,num:1/-1,...})` // shor 1:升序 -1降序
正则复杂条件查询(js正则表达式)|`db.${集合名称}.find({name:/.../})`
比较查询|`db.${集合名称}.find({name:{$gt:Number(100)}})` // $gt 大于 $lt 小于 $gte大于等于 $lte 小于等于 $ne 不等于
包含查询|`db.${集合名称}.find({name:{$in:[" "," "]}})`
条件链接查询|`db.${集合名称}.find({$and:[{num:{$gt:Number(100)}},{num:{$gt:Number(100)}}]})` // $and并且 $or或者