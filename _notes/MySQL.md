# 什么是MySQL？

MySQL 是一种关系型数据库，主要用于持久化存储我们的系统中的一些数据比如用户信息。

MySQL 字段类型可以简单分为三大类：

- **数值类型**：整型（TINYINT、SMALLINT、MEDIUMINT、INT 和 BIGINT）、浮点型（FLOAT 和 DOUBLE）、定点型（DECIMAL）
- **字符串类型**：CHAR、VARCHAR、TINYTEXT、TEXT、MEDIUMTEXT、LONGTEXT、TINYBLOB、BLOB、MEDIUMBLOB 和 LONGBLOB 等，最常用的是 CHAR 和 VARCHAR。
- **日期时间类型**：YEAR、TIME、DATE、DATETIME 和 TIMESTAMP 等。

**UNSIGNED**

MySQL 中的整数类型可以使用可选的 UNSIGNED 属性来表示不允许负值的无符号整数。使用 UNSIGNED 属性可以将正整数的上限提高一倍，因为它不需要存储负数值。

**CHAR 和 CARCHAR 的区别**

CHAR 和 VARCHAR 是最常用到的字符串类型，两者的主要区别在于：**CHAR 是定长字符串，VARCHAR 是变长字符串。**
CHAR 在存储时会在右边填充空格以达到指定的长度，检索时会去掉空格；VARCHAR 在存储时需要使用 1 或 2 个额外字节记录字符串的长度，检索时不需要处理。
CHAR(M) 和 VARCHAR(M) 的 M 都代表能够保存的字符数的最大值，无论是字母、数字还是中文，每个都只占用一个字符。

**DECIMAL 和 FLOAT/DOUBLE 的区别**

DECIMAL 和 FLOAT 的区别是：**DECIMAL 是定点数，FLOAT/DOUBLE 是浮点数。DECIMAL 可以存储精确的小数值，FLOAT/DOUBLE 只能存储近似的小数值。**

DECIMAL 用于存储具有精度要求的小数，例如与货币相关的数据，可以避免浮点数带来的精度损失。

在 Java 中，MySQL 的 DECIMAL 类型对应的是 Java 类 `java.math.BigDecimal`。

**TEXT 和 BOLB**

TEXT 能存储更长的字符串；BLOB 类型主要用于存储二进制大对象，例如图片、音视频等文件。

**DATETIME 和 TIMESTAMP**

DATETIME 类型没有时区信息，TIMESTAMP 和时区有关。
TIMESTAMP 只需要使用 4 个字节的存储空间，但是 DATETIME 需要耗费 8 个字节的存储空间。但是，这样同样造成了一个问题，Timestamp 表示的时间范围更小。

**NULL 和 ''**

`NULL` 代表缺失或未知的数据，而 `''` 表示一个已知存在的空字符串。

**对于 NULL 需要注意**

`SELECT NULL = NULL` 的结果是 `NULL`，而不是 `true` 或 `false`。任何值与 NULL 进行比较结果都为 NULL。
`DISTINCT`,`GROUP BY`,`ORDER BY`。需要注意的是，这些操作将 `NULL` 值视为相同的类别进行处理，并不意味着 `NULL` 值之间是相等的。
大多数聚合函数（例如 `SUM`, `AVG`, `MIN`, `MAX`）会忽略 `NULL` 值。`COUNT(*)` 会统计所有行数，包括包含 `NULL` 值的行。`COUNT(列名)` 会统计指定列中非 `NULL` 值的行数。

MySQL 中没有专门的布尔类型，而是用 TINYINT(1) 类型来表示布尔值。TINYINT(1) 类型可以存储 0 或 1，分别对应 false 或 true。

# MySQL 基础架构

![[assets/images/MySQL-1.png]]
- **连接器：** 身份认证和权限相关(登录 MySQL 的时候)。
- **查询缓存：** 执行查询语句的时候，会先查询缓存（MySQL 8.0 版本后移除，因为这个功能不太实用）。
- **分析器：** 没有命中缓存的话，SQL 语句就会经过分析器，分析器说白了就是要先看你的 SQL 语句要干嘛，再检查你的 SQL 语句语法是否正确。
- **优化器：** 按照 MySQL 认为最优的方案去执行。
- **执行器：** 执行语句，然后从存储引擎返回数据。 执行语句之前会先判断是否有权限，如果没有权限的话，就会报错。
- **插件式存储引擎**：主要负责数据的存储和读取，采用的是插件式架构，支持 InnoDB、MyISAM、Memory 等多种存储引擎。InnoDB 是 MySQL 的默认存储引擎，绝大部分场景使用 InnoDB 就是最好的选择。

# 存储引擎

MySQL 5.5.5 之前，MyISAM 是 MySQL 的默认存储引擎。5.5.5 版本之后，InnoDB 是 MySQL 的默认存储引擎。



## 索引

索引本质是一种排好序的数据结构。

数据结构
- 二叉树，可能退化成链表，特别是自增数据。
- 红黑树，二叉平衡数，有自我平衡的功能，效率上好于单纯的二叉树，但还是有可能存在层数过多的问题。
- BTree，存储索引和数据，一个节点可以存储多个索引。
- B+Tree，非叶子节点都是冗余索引，直接存内存；非叶子节点保存索引和数据信息（不同引擎数据存储方式不同）。  

聚集 / 非聚集
- 非聚集索引 MyISAM，索引和数据分开存储，分别存在 MYI 和 MYD 文件。
- 聚集索引 InnoDB，合并存储。

为什么 InnoDB 建议有整型的主键，为何要自增？
- 需要索引建立 B+Tree 结构。
- 用于比大小，整型比较快。
- 自增插入不会导致节点分裂，直接顺序插入到最后。

联合索引
- 查询是否走索引，按照最左前缀原则（因为前面的字段有序，后面的字段才会有序）。

## 事务



