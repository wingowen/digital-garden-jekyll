---
tags:
  - DW
---

Hive 基本介绍及简单使用。

<!-- more -->

### MRS

对接项目中使用华为的 MRS，底层为 Hive，验证其是否支持批量 Update 数据。

```SQL
set hive.support.concurrency = true;
set hive.exec.dynamic.partition.mode = nonstrict;
set hive.txn.manager = org.apache.hadoop.hive.ql.lockmgr.DbTxnManager;

DROP TABLE users_acid;
-- 清理事务日志
DELETE FROM TXN_COMPONENTS WHERE TC_TABLE = 'users_acid';
DELETE FROM COMPLETED_TXN_COMPONENTS WHERE CTC_TABLE = 'users_acid';
DELETE FROM HIVE_LOCKS WHERE HL_TABLE = 'users_acid';
DELETE FROM NEXT_TXN_ID;
-- 清理元数据
DELETE FROM TAB_COL_STATS WHERE TABLE_NAME = 'users_acid';
DELETE FROM PART_COL_STATS WHERE TABLE_NAME = 'users_acid';
-- 创建 ACID 表
CREATE TABLE users_acid (
user_id INT,
username STRING,
email STRING
)
CLUSTERED BY (user_id) INTO 3 BUCKETS
STORED AS ORC
TBLPROPERTIES ('transactional'='true');

INSERT INTO TABLE users_acid VALUES
(1, 'alice', 'alice@example.com'),
(2, 'bob', 'bob@example.com'),
(3, 'charlie', 'charlie@example.com'),
(4, 'dave', 'dave@example.com'),
(5, 'eve', 'eve@example.com');
-- update 成功
UPDATE users_acid SET user_id = user_id + 10 where user_id in (1,3);
```

Hive 的 ACID 事务使用写时复制（Copy-On-Write）策略来实现行级别的更新和删除。当执行更新或删除操作时，Hive 不会直接修改现有的 ORC 文件，而是创建一个新的文件来存储更新后的数据。原始文件保持不变，直到事务提交。在查询时，Hive 会合并基础文件和增量文件，以提供最新的数据视图。

### 基本概念

Hive 是基于 Hadoop 的一个数据仓库工具，可以将结构化的数据文件映射为一张表，并提供类 SQL 查询功能。

> 本质上是将 HQL 转化为 MapReduce 程序。

![](assets/images/Hive01.png)

> Hive 处理的数据存储在 HDFS；
> Hive 分析数据底层的实现是 MapReduce；
> 执行程序运行在 Yarn 上

#### HQL VS SQL

|              | Hive      | RDBMS    |
| ------------ | --------- | -------- |
| 查询语言     | HQL       | SQL      |
| 数据存储     | HDFS      | LOCAL FS |
| 执行         | MapReduce | Executor |
| 执行延迟     | 高        | 低       |
| 处理数据规模 | 大        | 小       |
| 索引         | 位图索引  | 复杂索引 |

![](assets/images/Hive02.png)

用户接口 Client：
CLI（hive shell）、JDBC / ODBC（java 访问 hive）、WEBUI（浏览器访问 hive）。

元数据 Metastore：
元数据包括表名、表所属的数据（默认是 default）、表的拥有者、列 / 分区字段、表的类型（是否是外部表）、表的数据所在目录等；默认存储在自带的 derby 数据库中，推荐使用 MySQL 存储 Metastore。

Hadoop
使用 HDFS 进行存储，使用 MapReduce 进行计算。

驱动器 Driver
	解析器 SQL Parser：将 SQL 字符串转换成抽象语法树 AST；
	编译器 Physical Plan： 将 AST 编译生成逻辑执行计划；
	优化器 Query Optimizer：对逻辑执行计划进行优化；
	执行器 Execution：把逻辑执行计划转换成可以运行的物理计划。对于 Hive 来 说，就是 MR / Spark。

![](assets/images/Hive03.png)

Hive 通过给用户提供的一系列交互接口，接收到用户的指令（SQL），使用自己的 Driver， 结合元数据（MetaStore），将这些指令翻译成 MapReduce，提交到 Hadoop 中执行，最后，将执行返回的结果输出到用户交互接口。

#### 安装配置

```shell
# hive 安装
tar -zxvf apache-hive-1.2.1-bin.tar.gz -C /opt/module/
mv apache-hive-1.2.1-bin/ hive
mv hive-env.sh.template hive-env.sh
vi hive-env.sh
	# export HADOOP_HOME=/opt/module/hadoop-2.7.2
	# export HIVE_CONF_DIR=/opt/module/hive/conf
# 启动 hive 前必须启动集群
sbin/start-dfs.sh
sbin/start-yarn.sh
# 创建目录
bin/hadoop fs -mkdir -p /user/hive/warehouse
bin/hadoop fs -chmod g+w /user/hive/warehouse
# 或者直接在配置文件中关闭权限检查
```

```xml
<!-- hdfs-site.xml -->

<property>
    <name>dfs.permissions.enable</name>
    <value>false</value>
</property>
```

### 基本操作

```shell
bin/hive
# 进入 hive shell
hive> show databases;
hive> use default;
hive> show tables;
hive> create table student(id int, name string);
hive> show tables;
hive> desc student;
hive> insert into student values(1000,"ss");
hive> select * from student;
hive> quit;
```

#### 文件导入

```shell
# 将 /opt/module/datas/student.txt 文件导入 hive 的 student(id int, name string) 表中

hive> create table student(id int, name string) ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t';
hive> load data local inpath '/opt/module/datas/student.txt' into table student;
```

> 再打开一个客户端窗口启动 hive，会产生 java.sql.SQLException 异常。原因是，Metastore 默认存储在自带的 derby 数据库中，推荐使用 MySQL 存储 Metastore。

##### MySQL 安装

```shell
# 检查环境
rpm -qa|grep mysql
rpm -e --nodeps
unzip mysql-libs.zip
	# MySQL-client-5.6.24-1.el6.x86_64.rpm
	# mysql-connector-java-5.1.27.tar.gz 驱动包
	# MySQL-server-5.6.24-1.el6.x86_64.rpm
# 安装服务
rpm -ivh MySQL-server-5.6.24-1.el6.x86_64.rpm
# 获取随机密码
cat /root/.mysql_secret
# 检查服务状态
service mysql status
service mysql start
# 安装客户端
rpm -ivh MySQL-client-5.6.24-1.el6.x86_64.rpm
# 利用好随机密码进行登录
mysql -uroot -pOEXaQuS8IWkG19Xs
# 修改密码
mysql>SET PASSWORD=PASSWORD('000000');
# 修改 user 表中的主机配置
mysql>show databases;
mysql>use mysql;
mysql>show tables;
mysql>desc user;
mysql>select User, Host, Password from user;
mysql>update user set host='%' where host='localhost';
mysql>delete from user where Host='127.0.0.1';
mysql>delete from user where Host='::1';
# 配置生效
mysql>flush privileges;
mysql>quit;
```

##### 元数据配置

```shell
# 拷贝所需驱动
cp mysql-connector-java-5.1.27-bin.jar /opt/module/hive/lib/
```

```xml
<!-- 在 /opt/module/hive/conf 目录下创建一个 hive-site.xml -->
<!-- 拷贝官方文档的配置参数 -->

<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
    <property>
        <name>javax.jdo.option.ConnectionURL</name>
        <value>jdbc:mysql://[ip_address]:3306/metastore?createDatabaseIfNotExist=true</value>
        <description>JDBC connect string for a JDBC metastore</description>
    </property>
    <property>
        <name>javax.jdo.option.ConnectionDriverName</name>
        <value>com.mysql.jdbc.Driver</value>
        <description>Driver class name for a JDBC metastore</description>
    </property>
    <property>
        <name>javax.jdo.option.ConnectionUserName</name>
        <value>root</value>
        <description>username to use against metastore database</description>
    </property>
    <property>
        <name>javax.jdo.option.ConnectionPassword</name>
        <value>000000</value>
        <description>password to use against metastore database</description>
    </property>
</configuration>
```

> 查看 MySQL 数据库，显示增加了 metastore 数据库。

#### 交互命令

```shell
# 查看帮助
bin/hive -help
# 不进入 hive 的交互窗口执行 sql 语句
bin/hive -e "select id from student;"
# 执行脚本中 sql 语句
bin/hive -f /opt/module/datas/hivef.sql
# 执行脚本，并写出结果
bin/hive -f /opt/module/datas/hivef.sql > /opt/module/datas/hive_result.txt
# 在 hive cli 命令窗口中查看 hdfs 文件系统
hive(default)>dfs -ls /;
# 在 hive cli 命令窗口中查看本地文件系统
hive(default)>! ls /opt/module/datas;
# 查看在 hive 中输入的所有历史命令，用户家目录下
cat .hivehistory
```

### 属性配置

#### 仓库路径

Default 数据仓库的最原始位置是在 hdfs 上的：/user/hive/warehouse 路径下；

在仓库目录下，没有对默认的数据库 default 创建文件夹。如果某张表属于 default 数据库，直接在数据仓库目录下创建一个文件夹。 

改 default 数据仓库原始位置（将 hive-default.xml.template 如下配置信息拷贝到 hive-site.xml 文件中）

```xml
<property>
    <name>hive.metastore.warehouse.dir</name>
    <value>/user/hive/warehouse</value>
    <description>location of default database for the warehouse</description>
</property>

<!-- 显示数据表头信息 -->
<property>
    <name>hive.cli.print.header</name>
    <value>true</value>
</property>
<!-- 显示当前数据库名称信息 -->
<property>
    <name>hive.cli.print.current.db</name>
    <value>true</value>
</property>
```

```shell
# 配置同组用户有执行权限
bin/hdfs dfs -chmod g+w /user/hive/warehouse
```

#### 日志信息

```shell
# 方式一
mv hive-log4j.properties.template hive-log4j.properties
vi hive-log4j.properties
	# hive.log.dir=/opt/module/hive/logs
# 方式二，仅对本次 hive 启动有效
bin/hive -hiveconf hive.log.dir=/opt/module/hive/logs
# 方式三，仅对本次 hive 启动有效
hive (default)> set hive.log.dir=/opt/module/hive/logs;
# 查看所有参数配置
hive (default)> set [某一参数]
```

### 数据类型

#### 简单类型

| 类型      | 描述                               | 示例         |
| --------- | ---------------------------------- | ------------ |
| boolean   | true / false                       | TRUE         |
| tinyint   | 1 字节的有符号整数                 | -128~127 1Y  |
| smallint  | 2 个字节的有符号整数，-32768~32767 | 1S           |
| int       | 4 个字节的带符号整数               | 1            |
| bigint    | 8 字节带符号整数                   | 1L           |
| float     | 4 字节单精度浮点数                 | 1.0          |
| double    | 8 字节双精度浮点数                 | 1.0          |
| deicimal  | 任意精度的带符号小数               | 1.0          |
| String    | 字符串，变长                       | “a”,’b’      |
| varchar   | 变长字符串                         | “a”,’b’      |
| char      | 固定长度字符串                     | “a”,’b’      |
| binary    | 字节数组                           | 无法表示     |
| timestamp | 时间戳，纳秒精度                   | 122327493795 |
| date      | 日期                               | ‘2018-04-07’ |

#### 复杂类型

| 类型   | 描述                                              | 示例                                                         |
| ------ | ------------------------------------------------- | ------------------------------------------------------------ |
| array  | 有序的的同类型的集合                              | array(1,2)                                                   |
| map    | key-value，key 必须为原始类型，value 可以任意类型 | map(‘a’,1,’b’,2)                                             |
| struct | 字段集合,类型可以不同                             | struct(‘1’,1,1.0), named_stract(‘col1’,’1’,’col2’,1,’clo3’,1.0) |

#### 实例操作

```json
{
    "name": "songsong",
    "friends": ["bingbing" , "lili"] , // 列表 Array
    "children": { // 键值 Map
        "xiao song": 18 ,
        "xiaoxiao song": 19
    }
    "address": { // 结构 Struct,
    "street": "hui long guan" ,
    "city": "beijing"
}
}
```

> 基于上述数据结构，我们在 Hive 里创建对应的表，并导入数据。

```txt
songsong,bingbing_lili,xiao song:18_xiaoxiao song:19,hui long guan_beijing // 第一条 JSON
yangyang,caicai_susu,xiao yang:18_xiaoxiao yang:19,chao yang_beijing // 第二条 JSON
```

> MAP，STRUCT 和 ARRAY 里的元素间关系都可以用同一个字符表示，这里用 “_”。

```sql
create table test(
    name string,
    friends array<string>,
    children map<string, int>,
    address struct<street:string, city:string>
)
row format delimited
fields terminated by ','
collection items terminated by '_'
map keys terminated by ':'
lines terminated by '\n';
```

```shell
# 导入数据
hive (default)> load data local inpath ‘/opt/module/datas/test.txt’ into table test
# 访问三种集合列里的数据，以下分别是 ARRAY，MAP，STRUCT 的访问方式
select friends[1],children['xiao song'],address.city from test where name="songsong";
OK
_c0 _c1 city
lili 18 beijing
Time taken: 0.076 seconds, Fetched: 1 row(s)
```

#### 类型转化

Hive 的原子数据类型是可以进行隐式转换的，类似于 Java 的类型转换，例如某表达式 使用 INT 类型，TINYINT 会自动转换为 INT 类型，但是 Hive 不会进行反向转化，例如， 某表达式使用 TINYINT 类型，INT 不会自动转换为 TINYINT 类型，它会返回错误，除非使用 CAST 操作。

隐式类型转换规则：

> 任何整数类型都可以隐式地转换为一个范围更广的类型，如 TINYINT 可以转换成 INT，INT 可以转换成 BIGINT；
> 所有整数类型、FLOAT 和 STRING 类型都可以隐式地转换成 DOUBLE；
> TINYINT、SMALLINT、INT 都可以转换为 FLOAT；
> BOOLEAN 类型不可以转换为任何其它的类型。

可以使用 CAST 操作显示进行数据类型转换

> 例如 CAST('1' AS INT) 将把字符串 '1'  转换成整数 1；如果强制类型转换失败，如执行 CAST('X' AS INT)，表达式返回空值 NULL。

### DDL

> Data Definition Language 数据定义。

#### 库操作

##### 创建

> 创建一个数据库，数据库在 HDFS 上的默认存储路径是 /user/hive/warehouse/*.db

```shell
create database if not exists db_hive;
# 指定库存储路径
create database db_hive location '/db_hive.db';
```

##### 显示

```shell
# 显示数据库信息
desc database db_hive;
# 显示数据库详细信息 extended
desc database extended db_hive;
# 切换当前数据库
use db_hive;
```

##### 修改

用户可以使用 ALTER DATABASE 命令为某个数据库的 DBPROPERTIES 设置键-值对属性值，来描述这个数据库的属性信息。

> 数据库的其他元数据信息都是不可更改的，包括数据库名和数据库所在的目录位置。修改当前正在使用的数据库，要先退出使用.

```
alter database db_hive set dbproperties('createtime'='20170830');
```

##### 删除

```shell
# 采用 if exists 判断数据库是否存在
drop database if exists [db_name];
# 如果数据库不为空，可以采用 cascade 命令强制删除
drop database [db_name] cascade;
```

#### 表操作

##### 表类型

```shell
CREATE [EXTERNAL] TABLE [IF NOT EXISTS] table_name 
   [(col_name data_type [COMMENT col_comment], ...)] 
   [COMMENT table_comment] 
   [PARTITIONED BY (col_name data_type [COMMENT col_comment], ...)] 
   [CLUSTERED BY (col_name, col_name, ...) 
   [SORTED BY (col_name [ASC|DESC], ...)] INTO num_buckets BUCKETS] 
   [ROW FORMAT row_format] 
   [STORED AS file_format] 
   [LOCATION hdfs_path]

# 重命名
ALTER TABLE table_name RENAME TO new_table_name
```

EXTERNAL 关键字可以让用户创建一个外部表，在建表的同时指定一个指向实际数据的路径（LOCATION）。

> Hive 创建内部表时，会将数据移动到数据仓库指向的路径；若创建外部表，仅记录数据所在的路径，不对数据的位置做任何改变。
> 在删除表的时候，内部表的元数据和数据会被一起删除，而外部表只删除元数据，不删除数据。

PARTITIONED 表示根据某一个 key （不在 create table 里面）对数据进行分区，体现在 HDFS 上就是 table 目录下有 n 个不同的分区文件夹（country=China,country=USA）。

CLUSTERED 对于每一个表（table）或者分区， Hive 可以进一步组织成桶，也就是说桶是更为细粒度的数据范围划分。Hive 也是针对某一列进行桶的组织。Hive 采用对列值哈希，然后除以桶的个数求余的方式决定该条记录存放在哪个桶当中。

> 获得更高的查询处理效率。桶为表加上了额外的结构，Hive 在处理有些查询时能利用这个结构。
> 使取样（sampling）更高效。

ROW FORMAT 用户在建表的时候可以自定义 SerDe 或者使用自带的 SerDe。SerDe 是 Serialize / Deserilize 的简称，目的是用于序列化和反序列化。

STORED AS 指定存储文件类型。常用的存储文件类型：SEQUENCEFILE（二进制序列文件）、TEXTFILE（文本）、 RCFILE（列式存储格式文件） 如果文件数据是纯文本，可以使用 STORED AS TEXTFILE。如果数据需要压缩， 使用 STORED AS SEQUENCEFILE。

LOCATION 指定表在 HDFS 上的存储位置。

LIKE 允许用户复制现有的表结构，但是不复制数据。

###### 内部表

> 默认创建的表都是所谓的管理表，有时也被称为内部表。因为这种表，Hive 会（或多或少地）控制着数据的生命周期。Hive 默认情况下会将这些表的数据存储在由配置项 hive.metastore.warehouse.dir（例如，/user/hive/warehouse）所定义的目录的子目录下。当删除一个管理表时，Hive 也会删除这个表中数据。内部表不适合和其他工具共享数据。

```shell
# 创建内部表
create table if not exists student(
id int, name string
)
row format delimited fields terminated by '\t'
stored as textfile
location '/user/hive/warehouse/student';
# 根据查询结果创建表（查询的结果会添加到新创建的表中）
create table if not exists student01 as select id, name from student;
# 根据已经存在的表结构创建表
create table if not exists student02 like student;
# 查询表的类型
desc formatted student01
```

###### 外部表

> 因为表是外部表，所以 Hive 并非认为其完全拥有这份数据。删除该表并不会删除掉这 份数据，不过描述表的元数据信息会被删除掉。

每天将收集到的网站日志定期流入 HDFS 文本文件。在外部表（原始日志表）的基础 上做大量的统计分析，用到的中间表、结果表使用内部表存储，数据通过 SELECT+INSERT 进入内部表。

```shell
# 创建外部表部门表
create external table if not exists default.dept(
    deptno int,
    dname string,
    loc int
)
row format delimited fields terminated by '\t';
# 创建外部表员工表
create external table if not exists default.emp(
    empno int,
    ename string,
    job string,
    mgr int,
    hiredate string,
    sal double,
    comm double,
    deptno int
)
row format delimited fields terminated by '\t';
# 查询表结构
hive (default)> show tables;
OK
tab_name
dept
emp
# 向外部表中导入数据
hive (default)> load data local inpath '/opt/module/datas/dept.txt' into table default.dept;
hive (default)> load data local inpath '/opt/module/datas/emp.txt' into table default.emp;
# 查询结果
hive (default)> select * from emp;
hive (default)> select * from dept;
# 查看表的类型
hive (default)> desc formatted dept;
Table Type: EXTERNAL_TABLE
```

##### 表转换

> 只能用单引号，严格区分大小写，如果不是完全符合，那么只会添加 K V 而不生效。

```shell
# 查询表的类型
hive (default)> desc formatted student;
Table Type: MANAGED_TABLE
# 修改内部表 student 为外部表
alter table student set tblproperties('EXTERNAL'='TRUE');
hive (default)> desc formatted student;
Table Type: EXTERNAL_TABLE
# 修改外部表 student 为内部表
alter table student set tblproperties('EXTERNAL'='FALSE');
hive (default)> desc formatted student;
Table Type: MANAGED_TABLE
```

##### 分区表

> 分区表实际上就是对应一个 HDFS 文件系统上的独立的文件夹，该文件夹下是该分区所有的数据文件。Hive 中的分区就是分目录，把一个大的数据集根据业务需要分割成小的数据集。在查询时通过 WHERE 子句中的表达式选择查询所需要的指定的分区，这样的查询效率会提高很多。

一级分区

```shell
# 引入分区表（需要根据日期对日志进行管理）
/user/hive/warehouse/log_partition/20170702/20170702.log
/user/hive/warehouse/log_partition/20170703/20170703.log
/user/hive/warehouse/log_partition/20170704/20170704.log
# 创建分区表语法
hive (default)> create table dept_partition(
	deptno int, dname string, loc string
)
partitioned by (month string)
row format delimited fields terminated by '\t';
# 分区域导入数据
hive (default)> load data local inpath '/opt/module/datas/dept.txt' into table
default.dept_partition partition(month='201709');
hive (default)> load data local inpath '/opt/module/datas/dept.txt' into table
default.dept_partition partition(month='201708');
hive (default)> load data local inpath '/opt/module/datas/dept.txt' into table
default.dept_partition partition(month='201707’);
# 单分区查询
hive (default)> select * from dept_partition where month='201709';
# 多分区联合查询 union（排序） or in 三种方式
hive (default)> select * from dept_partition where month='201709'
union
select * from dept_partition where month='201708'
union
select * from dept_partition where month='201707';
# 增加分区
hive (default)> alter table dept_partition add partition(month='201706') ;
# 同时创建多个分区 用空格分开
hive (default)> alter table dept_partition add partition(month='201705') partition(month='201704');
# 删除单个分区
hive (default)> alter table dept_partition drop partition (month='201704');
# 同时删除多个分区 用逗号分开
hive (default)> alter table dept_partition drop partition (month='201705'), partition (month='201706');
# 查看分区表有多少分区
hive> show partitions dept_partition;
# 查看分区表结构
hive> desc formatted dept_partition;
    # Partition Information
    # col_name data_type 
    # comment month string
```

二级分区

```shell
# 创建二级分区表
hive (default)> create table dept_partition2(
	deptno int, dname string, loc string
)
partitioned by (month string, day string)
row format delimited fields terminated by '\t';
# 加载数据到二级分区表中
hive (default)> load data local inpath '/opt/module/datas/dept.txt' into table default.dept_partition2 partition(month='201709', day='13');
hive (default)> select * from dept_partition2 where month='201709' and day='13';
# 把数据直接上传到分区目录上，让分区表和数据产生关联的三种方式
# 方式一：上传数据后修复
# 上传数据
hive (default)> dfs -mkdir -p /user/hive/warehouse/dept_partition2/month=201709/day=12;
hive (default)> dfs -put /opt/module/datas/dept.txt /user/hive/warehouse/dept_partition2/month=201709/day=12; 
# 查询数据（查询不到刚上传的数据）
hive (default)> select * from dept_partition2 where month='201709' and day='12'; 
# 执行修复命令
hive> msck repair table dept_partition2; 
# 再次查询数据
hive (default)> select * from dept_partition2 where month='201709' and day='12';
# 方式二：上传数据后添加分区
# 上传数据
hive (default)> dfs -mkdir -p /user/hive/warehouse/dept_partition2/month=201709/day=11;
hive (default)> dfs -put /opt/module/datas/dept.txt /user/hive/warehouse/dept_partition2/month=201709/day=11; 
# 执行添加分区
hive (default)> alter table dept_partition2 add partition(month='201709',day='11'); 
# 查询数据
hive (default)> select * from dept_partition2 where month='201709' and day='11';
# 方式三：上传数据后 load 数据到分区
# 创建目录
hive (default)> dfs -mkdir -p /user/hive/warehouse/dept_partition2/month=201709/day=10; 
# 上传数据
hive (default)> load data local inpath '/opt/module/datas/dept.txt' into table dept_partition2 partition(month='201709',day='10');
# 查询数据
hive (default)> select * from dept_partition2 where month='201709' and day='10';
```

#### 列信息

```shell
# 更新列
ALTER TABLE table_name CHANGE [COLUMN] col_old_name col_new_name column_type [COMMENT col_comment] [FIRST|AFTER column_name]
ALTER TABLE table_name ADD|REPLACE COLUMNS (col_name data_type [COMMENT col_comment], ...)
# ADD 是代表新增一字段，字段位置在所有列后面（partition 列前），REPLACE 则是表示替换表中所有字段

```

#### 删除表

```shell
hive (default)> drop table [table_name];
```

### DML

#### 数据导入

```shell
# 创建一张表
hive (default)> create table student(id string, name string) row format delimited fields terminated by '\t';
# 加载本地文件到 hive
hive (default)> load data local inpath '/opt/module/datas/student.txt' into table default.student;
# 加载 HDFS 文件到 hive 中
# 上传文件到 HDFS
hive (default)> dfs -put /opt/module/datas/student.txt /user/atguigu/hive;
# 加载 HDFS 上的数据
hive (default)> load data inpath '/user/atguigu/hive/student.txt' into table default.student;
```

> 加载数据覆盖表中已有的数据。

```shell
# 上传文件到 HDFS
hive (default)> dfs -put /opt/module/datas/student.txt /user/atguigu/hive;
# 加载数据覆盖表中已有的数据
hive (default)> load data inpath '/user/atguigu/hive/student.txt' overwrite into table default.student;
```

> 通过查询语句向表中插入数据（Insert）。

```shell
# 创建一张分区表
hive (default)> create table student(id int, name string) partitioned by (month string) row format delimited fields terminated by '\t';
# 基本插入数据
hive (default)> insert into table student partition(month='201709') values(1,'wangwu');
# 基本模式插入（根据单张表查询结果）
hive (default)> insert overwrite table student partition(month='201708') 
	select id, name from student where month='201709';
# 多插入模式（根据多张表查询结果）
hive (default)> from student
	insert overwrite table student partition(month='201707')
	select id, name where month='201709'
	insert overwrite table student partition(month='201706')
	select id, name where month='201709';
```

> 查询语句中创建表并加载数据（As Select）。

```shell
# 根据查询结果创建表（查询的结果会添加到新创建的表中）
create table if not exists student_new as select id, name from student;
```

> 创建表时通过 Location 指定加载数据路径.

```shell
# 创建表，并指定在 hdfs 上的位置
hive (default)> create table if not exists student(
	id int, name string
)
row format delimited fields terminated by '\t'
location '/user/hive/warehouse/student';
# 上传数据到 hdfs 上
hive (default)> dfs -put /opt/module/datas/student.txt /user/hive/warehouse/student;
# 查询数据
hive (default)> select * from student;
```

> Import 数据（export 到处的数据）到指定 Hive 表中。

```shell
hive (default)> import table student partition(month='201709') from '/user/hive/warehouse/export/student';
```

#### 数据导出

> Insert 导出。

```shell
# 将查询的结果导出到本地
hive (default)> insert overwrite local directory '/opt/module/datas/export/student' select * from student;
# 将查询的结果格式化导出到本地
hive (default)> insert overwrite local directory '/opt/module/datas/export/student' ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t' select * from student;
# 将查询的结果导出到 HDFS 上（没有 local）
hive (default)> insert overwrite directory '/user/wingo/student' ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t' select * from student;
```

> Hadoop 命令导出到本地。

```shell
hive (default)> dfs -get /user/hive/warehouse/student/month=201709/000000_0 /opt/module/datas/export/student.txt;
```

> Hive Shell 命令导出。

```shell
bin/hive -e 'select * from default.student;' > /opt/module/datas/export/student.txt;
```

> Export 导出到 HDFS 上。

```shell
hive (default) >export table default.student to '/user/hive/warehouse/export/student';
```

#### 清除表

> Truncate 只能删除管理表，不能删除外部表中数据。

```shell
hive (default)> truncate table student;
```

### 查询

> 基本查询

```shell
# 全表查询
hive (default)> select * from emp;
# 选择特定列查询
hive (default)> select empno, ename from emp;
# 列别名
hive (default)> select ename AS name, deptno dn from emp;
```

> 运算符查询

```shell
# 算术运算符：查询出所有员工的薪水后加 1 显示
hive (default)> select sal+1 from emp;
```

> 函数查询

```shell
# 求总行数（count）
hive (default)> select count(*) cnt from emp;
# 求工资的最大值（max）
hive (default)> select max(sal) max_sal from emp;
# 求工资的最小值（min）
hive (default)> select min(sal) min_sal from emp;
# 求工资的总和（sum）
hive (default)> select sum(sal) sum_sal from emp;
# 求工资的平均值（avg）
hive (default)> select avg(sal) avg_sal from emp;
```

> Limit 语句
>
> 典型的查询会返回多行数据。LIMIT 子句用于限制返回的行数。

```shell
hive (default)> select * from emp limit 5;
```

#### Where

```shell
# 查询出薪水大于 1000 的所有员工
hive (default)> select * from emp where sal >1000;
```

> 比较运算符（Between/In/ Is Null），这些操作符同样可以用于 JOIN…ON 和 HAVING 语句中。

```shell
# 查询出薪水等于 5000 的所有员工
hive (default)> select * from emp where sal =5000;
# 查询工资在 500 到 1000 的员工信息
hive (default)> select * from emp where sal between 500 and 1000;
# 查询 comm 为空的所有员工信息
hive (default)> select * from emp where comm is null;
# 查询工资是 1500 和 5000 的员工信息
hive (default)> select * from emp where sal IN (1500, 5000);
```

> Like 和 RLike
>
> % 代表零个或多个字符（任意个字符）；_ 代表一个字符
> RLIKE 子句是 Hive 中这个功能的一个扩展，其可以通过 Java 的正则表达式这个更强大的语言来指定匹配条件。

```shell
# 查找以 2 开头薪水的员工信息
hive (default)> select * from emp where sal LIKE '2%';
# 查找第二个数值为 2 的薪水的员工信息
hive (default)> select * from emp where sal LIKE '_2%';
# 查找薪水中含有 2 的员工信息
hive (default)> select * from emp where sal RLIKE '[2]';
```

> 逻辑运算符（And/Or/Not）

```shell
# 查询薪水大于 1000，部门是 30
hive (default)> select * from emp where sal>1000 and deptno=30;
# 查询薪水大于 1000，或者部门是 30
hive (default)> select * from emp where sal>1000 or deptno=30;
# 查询除了 20 部门和 30 部门以外的员工信息
hive (default)> select * from emp where deptno not IN(30, 20);
```

#### 分组

> GROUP BY 语句通常会和聚合函数一起使用，按照一个或者多个列队结果进行分组，然后对每个组执行聚合操作。

```shell
# 计算 emp 表每个部门的平均工资
hive (default)> select t.deptno, avg(t.sal) avg_sal from emp t group by t.deptno;
# 计算 emp 每个部门中每个岗位的最高薪水
hive (default)> select t.deptno, t.job, max(t.sal) max_sal from emp t group by t.deptno, t.job;
```

> Having 语句
>
> where 针对表中的列发挥作用，查询数据；Having 针对查询结果中的列发挥作用， 筛选数据。

```shell
# 求每个部门的平均薪水大于 2000 的部门
hive (default)> select deptno, avg(sal) avg_sal from emp group by deptno having avg_sal > 2000;
```

#### Join

> 是只支持等值连接，不支持非等值连接

```shell
# 根据员工表和部门表中的部门编号相等，查询员工编号、员工名称和部门编号；
hive (default)> select e.empno, e.ename, d.deptno, d.dname from emp e join dept d on e.deptno = d.deptno;
# 合并员工表和部门表
hive (default)> select e.empno, e.ename, d.deptno from emp e join dept d on e.deptno = d.deptno;
# 内连接：只有进行连接的两个表中都存在与连接条件相匹配的数据才会被保留下来。
hive (default)> select e.empno, e.ename, d.deptno from emp e join dept d on e.deptno = d.deptno;
# 左外连接：JOIN 操作符左边表中符合 WHERE 子句的所有记录将会被返回。
hive (default)> select e.empno, e.ename, d.deptno from emp e left join dept d on e.deptno = d.deptno;
# 右外连接：JOIN 操作符右边表中符合 WHERE 子句的所有记录将会被返回。
hive (default)> select e.empno, e.ename, d.deptno from emp e right join dept d on e.deptno = d.deptno;
# 满外连接：将会返回所有表中符合 WHERE 语句条件的所有记录。如果任一表的指定字段没有符合条件的值的话，那么就使用 NULL 值替代。
hive (default)> select e.empno, e.ename, d.deptno from emp e full join dept d on e.deptno = d.deptno;
```

> 多表连接，大多数情况下，Hive 会对每对 JOIN 连接对象启动一个 MapReduce 任务。Hive 总是按照从左到右的 顺序执行的。

#### 排序

##### 全局排序

> Order By：全局排序，一个 MapReduce。
>
> ASC（ascend）: 升序（默认）；DESC（descend）: 降序。

```shell
# 查询员工信息按工资升序排列
hive (default)> select * from emp order by sal;
# 查询员工信息按工资降序排列
hive (default)> select * from emp order by sal desc;
# 按照别名排序，按照员工薪水的 2 倍排序
hive (default)> select ename, sal*2 twosal from emp order by twosal;
# 按照部门和工资升序排序
hive (default)> select ename, deptno, sal from emp order by deptno, sal ;
```

##### 内部排序

> 每个 MapReduce 内部排序（Sort By）。
>
> Sort By：每个 MapReduce 内部进行排序，对全局结果集来说不是排序。

```shell
# 设置 reduce 个数
hive (default)> set mapreduce.job.reduces=3;
# 查看设置 reduce 个数
hive (default)> set mapreduce.job.reduces;
# 根据部门编号降序查看员工信息
hive (default)> select * from emp sort by empno desc;
hive (default)> insert overwrite local directory '/opt/module/datas/sortby-result' select * from emp sort by deptno desc;
```

##### 分区排序

> Distribute By：类似 MR 中 partition，进行分区，结合 sort by 使用。
>
> Hive 要求 DISTRIBUTE BY 语句要写在 SORT BY 语句之前

```shell
# 先按照部门编号分区，再按照员工编号降序排序。
hive (default)> set mapreduce.job.reduces=3;
hive (default)> insert overwrite local directory '/opt/module/datas/distribute-result' 
	select * from emp distribute by deptno sort by empno desc;
```

> Cluster By 除了具有 Distribute By 的功能外还兼具 Sort By 的功能。但是排序只能是倒序排序，不能指定排序规则为 ASC 或者 DESC。

```shell
hive (default)> select * from emp cluster by deptno;
# 等价于
hive (default)> select * from emp distribute by deptno sort by deptno;
```

#### 桶

> 分区针对的是数据的存储路径；分桶针对的是数据文件。

```shell
# 第一次尝试
# 创建分桶表，按 id 取模
create table stu_buck(id int, name string) 
	clustered by(id) 
	into 4 buckets 
	row format delimited fields terminated by '\t';
# 查看表结构
hive (default)> desc formatted stu_buck;
	# Num Buckets: 4
# 导入数据到分桶表中，直接 load 不会进行分桶，还是一整个文件，那么通过 MR 导入呢？
hive (default)> load data local inpath '/opt/module/datas/student.txt' into table stu_buck;
# 第二次尝试，创建分桶表时，数据通过子查询的方式导入
# 创建用于子查询的表
create table stu(id int, name string)
	row format delimited fields terminated by '\t';
# 向普通的 stu 表中导入数据
load data local inpath '/opt/module/datas/student.txt' into table stu;
# 清空 stu_buck 表中数据
truncate table stu_buck;
select * from stu_buck;
# 导入数据到分桶表，通过子查询的方式
insert into table stu_buck select id, name from stu;
# 发现还是只有一个分桶
# 需要设置一个属性
hive (default)> set hive.enforce.bucketing=true;
hive (default)> set mapreduce.job.reduces=-1;
hive (default)> insert into table stu_buck
	select id, name from stu;
# 查询分桶的数据，分桶成功
hive (default)> select * from stu_buck;
```

##### 分桶抽样查询

> 对于非常大的数据集，有时用户需要使用的是一个具有代表性的查询结果而不是全部结 果。Hive 可以通过对表进行抽样来满足这个需求。

```shell
# 查询表 stu_buck 中的数据
hive (default)> select * from stu_buck tablesample (bucket 1 out of 4 on id);
```

> TABLESAMPLE(BUCKET x OUT OF y) 
>
> y 必须是 table 总 bucket 数的倍数或者因子。hive 根据 y 的大小，决定抽样的比例。
> table 总 bucket 数为 4，tablesample(bucket 1 out of 2)，表示总共抽取（4/2=）2 个 bucket 的数据，抽取第  1(x) 个和第 4(x+y) 个 bucket 的数据。

#### 其它

##### 空字段赋值

```shell
# 如果员工的 comm 为 NULL，则用-1 代替
hive (default)> select nvl(comm,-1) from emp;
```

CASE WHEN

```shell
# 求出不同部门男女各多少人
vi emp_sex.txt
    # 悟空 A 男
    # 大海 A 男
    # 宋宋 B 男
    # 凤姐 A 女
    # 婷姐 B 女
    # 婷婷 B 女
# 创建 hive 表并导入数据
create table emp_sex(
    name string,
    dept_id int,
    sex string
)
row format delimited fields terminated by "\t";
load data local inpath '/opt/module/datas/emp_sex.txt' into table emp_sex;
# 按需求查询数据
select 
	dept_id,
	sum(case sex when '男' then 1 else 0 end) male_count,
	sum(case sex when '女' then 1 else 0 end) female_count
from
	emp_sex
group by
	dept_id;
# 结果
    # A 2 1
    # B 1 2
```

##### 行转列

> CONCAT(string A/col, string B/col…)：返回输入字符串连接后的结果，支持任意个输入 字符串；
>
> CONCAT_WS(separator, str1, str2,...)：它是一个特殊形式的 CONCAT()。第一个参数为参数间的分隔符。分隔符可以是与剩余参数一样的字符串。如果分隔符是 NULL， 返回值也将为 NULL。这个函数会跳过分隔符参数后的任何 NULL 和空字符串。分隔符将被加到被连接的字符串之间；
>
> COLLECT_SET(col)：函数只接受基本数据类型，它的主要作用是将某字段的值进行去重汇总，产生 array 类型字段。

```shell
vi constellation.txt
    # 孙悟空 白羊座 A
    # 大海 射手座 A
    # 宋宋 白羊座 B
    # 猪八戒 白羊座 A
    # 凤姐 射手座 A
# 按数据格式创建表
create table person_info(
    name string,
    constellation string,
    blood_type string
)
row format delimited fields terminated by "\t";
load data local inpath “/opt/module/datas/person_info.txt” into table person_info;
# 按需求查询数据
select
	t1.base, concat_ws('|', collect_set(t1.name)) name
from
	(select
		name,concat(constellation, ",", blood_type) base # 星座,血型
	from
		person_info
	) t1
group by
	t1.base;
# 结果
    # 射手座,A 大海|凤姐
    # 白羊座,A 孙悟空|猪八戒
    # 白羊座,B 宋宋
```

##### 列转行

> EXPLODE(col)：将 hive 一列中复杂的 array 或者 map 结构拆分成多行。 
>
> LATERAL VIEW 用法：LATERAL VIEW udtf(expression) tableAlias AS columnAlias 
> 解释：与 split, explode 等 UDTF 一起使用，它能够将一列数据拆成多行数据，在此基础上可以对拆分后的数据进行聚合。

```shell
# 创建本地 movie.txt，导入数据
vi movie.txt
    # 《疑犯追踪》 悬疑,动作,科幻,剧情
    # 《Lie to me》 悬疑,警匪,动作,心理,剧情
    # 《战狼 2》 战争,动作,灾难
create table movie_info(
    movie string,
    category array<string>
)
row format delimited fields terminated by "\t"
collection items terminated by ",";
load data local inpath "/opt/module/datas/movie.txt" into table movie_info;
# 按需求查询数据
select
	movie,category_name
from
	movie_info 
lateral view 
	explode(category) table_tmp as category_name;
# 结果
    # 《疑犯追踪》 悬疑
    # 《疑犯追踪》 动作
    # 《疑犯追踪》 科幻
    # 《疑犯追踪》 剧情
    # 《Lie to me》 悬疑
    # 《Lie to me》 警匪
    # 《Lie to me》 动作
    # 《Lie to me》 心理
    # 《Lie to me》 剧情
    # 《战狼 2》 战争
    # 《战狼 2》 动作
    # 《战狼 2》 灾难
```

##### 窗口函数

> OVER()：指定分析函数工作的数据窗口大小，这个数据窗口大小可能会随着行的变而变化；
> CURRENT ROW：当前行； 
> n PRECEDING：往前 n 行数据；
> n FOLLOWING：往后 n 行数据；
> UNBOUNDED：起点，UNBOUNDED PRECEDING 表示从前面的起点，UNBOUNDED FOLLOWING 表示到后面的终点； 
> LAG(col,n)：往前第 n 行数据 
> LEAD(col,n)：往后第 n 行数据 
> NTILE(n)：把有序分区中的行分发到指定数据的组中，各个组有编号，编号从 1 开始， 对于每一行，NTILE 返回此行所属的组的编号。注意：n 必须为 int 类型。

```shell
# 数据准备
name,orderdate,cost
jack,2017-01-01,10
tony,2017-01-02,15
jack,2017-02-03,23
tony,2017-01-04,29
jack,2017-01-05,46
jack,2017-04-06,42
tony,2017-01-07,50
jack,2017-01-08,55
mart,2017-04-08,62
mart,2017-04-09,68
neil,2017-05-10,12
mart,2017-04-11,75
neil,2017-06-12,80
mart,2017-04-13,94
```

```shell
# 创建本地 business.txt，导入数据
vi business.txt
# 创建 hive 表并导入数据
create table business(
	name string,
	orderdate
	string,cost int
) 
ROW FORMAT DELIMITED FIELDS TERMINATED BY ',';
load data local inpath "/opt/module/datas/business.txt" into table business;
# 查询在 2017 年 4 月份购买过的顾客及总人数
select name,count(*) over() # group by 统计每一次条件下的数据；over() 开窗把整个数据即开给你用
from business
where substring(orderdate,1,7) = '2017-04'
group by name;
# 查询顾客的购买明细及月购买总额
select name,orderdate,cost,sum(cost) over(partition by month(orderdate)) from business;
# 上述的场景,要将 cost 按照日期进行累加
select name,orderdate,cost,
sum(cost) over() as sample1,-- 所有行相加
sum(cost) over(partition by name) as sample2,-- 按 name 分组，组内数据相加
sum(cost) over(partition by name order by orderdate) as sample3,-- 按 name 分组，组内数据累加
sum(cost) over(partition by name order by orderdate rows between UNBOUNDED PRECEDING
and current row ) as sample4 ,-- 和 sample3 一样,由起点到当前行的聚合
sum(cost) over(partition by name order by orderdate rows between 1 PRECEDING and current
row) as sample5, -- 当前行和前面一行做聚合
sum(cost) over(partition by name order by orderdate rows between 1 PRECEDING AND 1
FOLLOWING ) as sample6,-- 当前行和前边一行及后面一行
sum(cost) over(partition by name order by orderdate rows between current row and
UNBOUNDED FOLLOWING ) as sample7 -- 当前行及后面所有行
from business;
# 查看顾客上次的购买时间
select name,orderdate,cost,
lag(orderdate,1,'1900-01-01') over(partition by name order by orderdate ) as time1,
lag(orderdate,2) over (partition by name order by orderdate) as time2
from business;
# 查询前 20% 时间的订单信息
select * from (
select name,orderdate,cost, ntile(5) over(order by orderdate) sorted from business
) t
where sorted = 1;
```

##### Rank

> RANK() 排序相同时会重复，总数不会变；
> DENSE_RANK()排序相同时会重复，总数会减少；
> ROW_NUMBER() 会根据顺序计算。

```shell
select 
	name,
	subject,
	score,
rank() over(partition by subject order by score desc) rp,
dense_rank() over(partition by subject order by score desc) drp,
row_number() over(partition by subject order by score desc) rmp
from score;
# 结果
name subject score rp drp rmp
宋宋 英语 84 1 1 1
大海 英语 84 1 1 2
婷婷 英语 78 3 2 3
```

### 函数

```shell
# 查看系统自带的函数
hive> show functions;
# 显示自带的函数的用法
hive> desc function upper;
# 详细显示自带的函数的用法
hive> desc function extended upper;
```

#### 自定义函数

[官方文档地址](https://cwiki.apache.org/confluence/display/Hive/HivePlugins)