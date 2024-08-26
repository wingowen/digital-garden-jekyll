# 介绍下 HBase

HBase 是一个开源的、分布式的、可扩展的大数据存储系统，它基于 Google 的 Bigtable 模型设计，运行在 Hadoop 和 HDFS 之上。HBase 提供了对大数据的随机、实时读/写访问，适用于需要存储数十亿行和数百万列的表。

# HBase 优缺点

**优点**：
- 高可靠性：通过副本机制和自动故障转移实现。
- 高可扩展性：可以线性扩展存储和处理能力。
- 强一致性：提供行级别的原子性操作。
- 灵活的数据模型：支持稀疏存储，适用于半结构化和非结构化数据。

**缺点**：
- 不支持复杂的事务：只支持单行事务。
- 不支持 SQL 查询：需要通过 API 或 MapReduce 进行数据操作。
- 运维复杂：需要专业的运维团队进行管理和调优。
- **没有数据类型，都以二进制的方式存储**。

# 说下 HBase 原理

HBase 的原理基于 Google 的 Bigtable 论文，它使用 HDFS 作为底层存储，并通过 ZooKeeper 进行协调和状态管理。HBase 将数据存储在表中，表由行和列组成，每个表都有一个 RowKey 作为唯一标识。数据按 RowKey 的字典顺序存储，并分布在多个 Region 中，每个 Region 由一个 RegionServer 管理。

# 介绍下 HBase 架构

HBase 架构包括以下组件：
- **HMaster**：负责管理 RegionServer，分配 Region，处理 RegionServer 的故障转移。
- **RegionServer**：负责存储和处理实际的数据，管理 Region 的读写请求。
	- WAL Write Ahead Logging 预写日志。
- **ZooKeeper**：用于协调 HBase 集群，维护集群状态，处理 Leader 选举。
- **HDFS**：作为底层存储系统，存储 HBase 的数据文件。

# HBase 读写数据流程

**写流程**：
- 客户端通过 ZooKeeper 找到对应的 RegionServer；
- 客户端向 RegionServer 发送写请求；
- RegionServer 将数据写入 MemStore；
- 当 MemStore 满时，数据被刷写到磁盘上的 HFile。

**读流程**：
- 客户端通过 ZooKeeper 找到对应的 RegionServer；
- 客户端向 RegionServer 发送读请求；
- RegionServer 首先检查 MemStore，然后检查 BlockCache（读缓存），最后检查 HFile。

# HBase RegionServer 读写缓存

- **MemStore**：写缓存，存储在内存中，当满时刷写到 HFile。一个列族对应一个 MemStore，写入 Hfile 时顺序写入，避免寻址速度快。
- **BlockCache**：读缓存，存储在内存中，用于加速读操作。

**读合并**
1. 读取 BlockCache
2. 读取 MemStore（写缓存，包含最新版本的数据）
3. 都未命中则读取 Hfile

# HBase 的删除数据

在 HBase 中，删除操作并不会立即删除数据。而是标记数据为删除状态，并在后续的合并（Compaction）过程中，这些被标记的数据才会被物理删除。

# HBase 的二级索引

HBase 本身不直接支持二级索引，但可以通过协处理器（Coprocessor）或外部索引服务（如 Phoenix）来实现二级索引。

# HBase 的 RegionServer 宕机恢复

当 RegionServer 宕机时，ZooKeeper 会检测到并通知 HMaster。HMaster 会将宕机 RegionServer 上的 Region 重新分配给其他存活的 RegionServer，并触发这些 Region 的恢复过程。

# HBase Region

Region 是 HBase 表的一个连续部分，包含表中的一部分行。每个 region 包含一个行键（row key）范围，从开始键（start key）到结束键（end key）。Region 的默认大小是 1G，包含 8 个 Hfile 的数据文件，每个数据文件是 128MB。

- **Start Key** 和 **End Key**：定义 Region 的范围。
- **MemStore**：内存中的写缓存。
- **HFile**：磁盘上的数据文件。

# Hfile

HFile的存储结构是基于列式存储的，但它并不是传统意义上的列存储数据库。HBase是一个基于列族（column family）的存储系统，每个列族在物理上存储在一起，而列族中的列（qualifier）则存储在同一列族中。这种存储模型使得 HBase 能够高效地存储和访问大规模的结构化数据，同时支持灵活的查询和过滤操作。
- 行：查找 Rowkey 位置，然后找到 Rowkey 对应的所有块，Rowkey 顺序存储，使用二分查找。
- 列：列族顺序查找，顺序读取。


# HBase 高可用怎么实现的?

HBase 通过以下方式实现高可用：
- **HMaster 高可用**：通过 ZooKeeper 进行 Leader 选举，确保始终有一个活跃的 HMaster。
- **RegionServer 高可用**：通过副本机制和自动故障转移确保数据的高可用性。

# 为什么 HBase 适合写多读少业务?

HBase 适合写多读少的业务，因为它的写入操作是追加式的，非常高效。而读操作需要合并 MemStore 和 HFile，相对较慢。

# 列式数据库

Hbase 非严格列式存储，严格来说是一个二维结构 `列:列修饰符`

**适用场景**：
- 数据仓库和分析型应用。
- 需要快速查询大量数据的场景。

**优势**：
- 高效的列存储和压缩。
- 适合进行列级别的操作。

**特点**：
- 数据按列存储，每列单独存储。
- 支持高吞吐量的数据插入。
- 适合进行列级别的查询和分析。

![](assets/images/HBase-面经-1.png)

# HBase rowkey 设计原则

- **唯一性**：确保每个 RowKey 唯一。
- **散列性**：避免热点问题，均匀分布数据。
- **长度限制**：不宜过长，以减少存储和网络开销。

RowKey 长度有限制是为了减少存储和网络开销。RowKey 需要唯一以确保数据的唯一性。RowKey 过长会增加 HFile 的存储空间，影响查询性能。

RowKey 的设计直接影响数据的分布和查询性能。合理的 RowKey 设计可以避免热点问题，提高查询效率。

# HBase 的大合并、小合并是什么?

- **小合并（Minor Compaction）**：合并几个小的、相邻的 HFile，减少文件数量。
- **大合并（Major Compaction）**：合并一个 Region 中的所有 HFile，删除标记为删除的数据，优化存储结构。

# HBase 数据结构

HBase 的数据结构是基于列族（Column Family）的，每个表由一个或多个列族组成，每个列族包含多个列。数据按 RowKey 的字典顺序存储。

# HBase 为什么随机查询很快?

HBase 的随机查询快是因为数据按 RowKey 的字典顺序存储，并且通过 RowKey 可以直接定位到数据所在的 Region 和 HFile，避免了全表扫描。
- **Hive**：适合进行大规模数据的批量写入和分析查询，但随机查询性能可能受限。
- **HBase**：适合进行实时、随机的读写操作，批量写入和随机查询性能都很高。

# HBase 的 LSM 结构

HBase 使用 LSM（Log-Structured Merge-Tree）结构来存储数据。数据首先写入 MemStore，然后刷写到 HFile。LSM 结构适合写多读少的场景，通过合并操作优化读性能。

# HBase 的 Get 和 Scan 的区别和联系?

**Get**：
- 获取单行数据。
- 通过 RowKey 直接定位数据。
**Scan**：
- 扫描多行数据。
- 通过指定 Start RowKey 和 End RowKey 进行范围查询。

# HBase 数据的存储结构(底层存储结构)

HBase 的底层存储结构是 HFile，HFile 是基于 HDFS 的二进制文件，包含数据块和索引块。数据按 RowKey 的字典顺序存储。

# HBase 数据 compact 流程

HBase 的 Compaction 流程包括小合并和大合并。小合并合并几个小的、相邻的 HFile，大合并合并一个 Region 中的所有 HFile，并删除标记为删除的数据。

# HBase 的预分区

预分区是在创建表时预先划分 Region，以避免后期数据增长导致的热点问题和 Region 分裂。

# HBase 的热点问题

热点问题是指数据访问不均匀，导致某些 RegionServer 负载过高。通过合理的 RowKey 设计和预分区可以避免热点问题。

# HBase 的 memstore 冲刷条件

MemStore 冲刷的条件包括：
- MemStore 达到配置的最大大小。
- RegionServer 的总 MemStore 大小达到配置的最大值。
- 定期冲刷。

# HBase 的 MVCC

HBase 使用 MVCC（Multi-Version Concurrency Control）来实现并发控制。每个数据操作都有一个时间戳，允许多个版本的数据共存。

# HBase 支持 SQL 操作吗

HBase 本身不支持 SQL 操作，但可以通过 Phoenix 等外部工具实现 SQL 接口，Phoenix 是一个建立在 HBase 之上的 SQL 层，提供了 SQL 接口和二级索引功能。

# Region

**Region 分配**

Region 分配是由 HMaster 负责的，HMaster 根据 RegionServer 的负载和 Region 的大小进行 Region 的分配。

**HBase 的 Region 切分**

Region 切分是当一个 Region 的大小超过配置的阈值时，HBase 会自动将该 Region 切分为两个新的 Region。

