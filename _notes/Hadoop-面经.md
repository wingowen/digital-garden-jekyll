# 介绍下 Hadoop

Hadoop 是一个开源的分布式存储和计算框架，最初由 Apache 软件基金会开发。
处理大规模数据集，通过在计算机集群上分布式处理数据来实现高吞吐量的数据访问。
Hadoop 的核心思想是将大数据集分割成小块，然后在集群的多个节点上并行处理这些小块数据。

# Hadoop 的特点

- **高可靠性**：通过数据冗余和错误恢复机制来保证数据的可靠性。
- **高扩展性**：可以方便地扩展集群规模，以处理更多的数据。
- **高效性**：通过并行处理大规模数据集来提高处理速度。
- **高容错性**：自动处理节点故障，保证作业的连续运行。
- **低成本**：使用廉价的硬件构建集群，降低成本。

# Hadoop 生态圈组件及其作用

- **HDFS** Hadoop Distributed File System：分布式文件系统，用于存储大数据。
- **YARN** Yet Another Resource Negotiator：资源管理器，负责集群资源的管理和调度。
- **MapReduce**：编程模型，用于大规模数据集的并行处理。
- **Hive**：数据仓库工具，提供 SQL-like 语言进行数据查询。
- **Pig**：高级数据流语言，用于分析大数据集。
- **HBase**：分布式NoSQL数据库，提供实时读写访问。
- **Spark**：快速通用的大数据处理引擎。
- **Flume**：日志收集工具，用于高效收集、聚合和移动大量日志数据。
- **Kafka**：分布式流处理平台，用于高性能数据管道、流分析等。
- **ZooKeeper**：分布式应用程序协调服务。

# Hadoop 主要分哪几个部分?他们有什么作用?

- **HDFS**：存储层，负责数据的分布式存储。
- **YARN**：资源管理层，负责集群资源的分配和管理。
- **MapReduce**：计算层，负责数据的并行处理。

# Hadoop 1.x，2.x，3.x的区别

- **Hadoop 1.x**：主要包含 HDFS 和 MapReduce。
- **Hadoop 2.x**：引入了 YARN，将资源管理和作业调度分离，支持多种计算框架。
- **Hadoop 3.x**：进一步优化性能，支持更多功能，如多NameNode支持、容器重用、GPU 和 FPGA等。

# Hadoop 集群工作时启动哪些进程?它们有什么作用?

- **NameNode**：管理 HDFS 的命名空间，维护文件系统树及整个树内所有的文件和目录。
- **DataNode**：存储实际的数据块，执行数据块的读/写操作。
- **ResourceManager**：YARN 的资源管理器，负责整个系统的资源管理和分配。
- **NodeManager**：YARN 的节点管理器，负责单个节点的资源管理和使用。
- **JobHistoryServer**：记录作业的历史信息。
- **SecondaryNameNode**：辅助 NameNode，定期合并编辑日志和文件系统镜像，减轻 NameNode 的负担。

# 在集群计算的时候，什么是集群的主要瓶颈

集群的主要瓶颈通常是网络带宽和磁盘 I/O。随着集群规模的扩大，网络通信和数据传输可能会成为性能的限制因素。

# 搭建 Hadoop 集群的 xml 文件有哪些?

- **core-site.xml**：配置 Hadoop 核心参数，如 HDFS 和 MapReduce 常用的 I/O 设置。
- **hdfs-site.xml**：配置 HDFS 参数，如副本因子、数据块大小等。
- **mapred-site.xml**：配置 MapReduce 参数，如作业调度器、任务内存设置等。
- **yarn-site.xml**：配置 YARN 参数，如资源管理器地址、节点管理器配置等。

# Hadoop 的 checkpoint 流程

Hadoop 的 checkpoint 流程是指 SecondaryNameNode 定期将 NameNode 的编辑日志和文件系统镜像合并，生成新的文件系统镜像，以减轻 NameNode 的内存压力，并提供故障恢复。

文件系统镜像 FSImage 是一个二进制文件，包含了 HDFS 中所有目录和文件的元数据信息。

# Hadoop的默认块大小是多少?为什么要设置这么大?

Hadoop 的默认块大小是 128MB。设置这么大是为了减少 NameNode 的内存消耗（维护块的元数据），提高数据本地性，减少寻道时间，从而提高数据读取效率。

# Block 划分的原因

Block 划分是为了将大文件分割成小块，便于在集群的多个节点上并行处理，提高数据处理的效率和可靠性。

# Hadoop 常见的压缩算法?

常见的压缩算法包括：
- **Gzip** 压缩比高。
- **Bzip2** 压缩比更高。
- **Snappy** 速度快。
- **LZO** 速度中，支持索引可实现快速访问。
- **LZ4** 速度快，压缩比比 Snappy 高。

# Hadoop 作业提交到 YARN 的流程?

1. 客户端提交作业到 ResourceManager。
2. ResourceManager 分配容器并在 NodeManager 上启动 ApplicationMaster。
3. ApplicationMaster 向 ResourceManager 注册，并请求资源。
4. ResourceManager 分配资源，ApplicationMaster 在 NodeManager 上启动任务容器。
5. 任务在容器中执行，ApplicationMaster 监控任务进度。
6. 任务完成后，ApplicationMaster 向 ResourceManager 报告，并释放资源。

![](assets/images/大数据开发工程师面经-1.png)

# Hadoop 的 Combiner 的作用

Combiner 是一个本地化的 Reducer，它在 Map 任务结束后对输出结果进行预聚合，减少数据传输量，从而减轻网络负载和 Reducer 的计算压力，提高整个 MapReduce 作业的效率。

# Hadoop 序列化和反序列化

Hadoop 序列化是指将对象转换为字节流以便于存储或传输，反序列化则是将字节流转换回对象。Hadoop 使用自己的序列化框架，称为 Writable，它比 Java 的序列化更紧凑、更高效。

# Hadoop 的运行模式

- 本地模式：单机运行，不使用 HDFS，主要用于开发和测试。
- 伪分布式模式：单机模拟分布式环境，使用 HDFS 和 YARN，用于测试 Hadoop 集群的功能。
- 完全分布式模式：多节点集群运行，用于生产环境。

# Hadoop 小文件处理问题

Hadoop 对小文件处理效率不高，因为==每个文件在 HDFS 中至少占用一个块==，而 NameNode 需要为每个文件维护元数据，这会导致 NameNode 内存消耗过大。处理方法包括：
- 使用 Hadoop 的 CombineFileInputFormat 将多个小文件合并成一个 Map 任务处理。
- 使用 HBase 或其他 NoSQL 数据库存储小文件。
- 使用 SequenceFile、MapFile 等格式将小文件打包存储。

# HDFS 文件写入和读出

**写入流程**：

1. 客户端调用 `DistributedFileSystem.create()` 创建文件。
2. `DistributedFileSystem` 向 NameNode 发送创建文件请求。
3. NameNode 检查文件是否存在，以及客户端是否有权限创建文件。
4. 如果检查通过，NameNode 返回一个 `FSDataOutputStream` 给客户端。
5. 客户端开始写数据，数据被分成数据包（packet），并通过 `DataStreamer` 请求 NameNode 分配 DataNode。
6. NameNode 返回 DataNode 列表，数据包被发送到第一个 DataNode，然后被转发到第二个 DataNode，最后到第三个 DataNode。
7. 每个 DataNode 写完数据后，向客户端发送确认。
8. 客户端收到所有 DataNode 的确认后，发送确认给 NameNode。
9. 文件写入完成。

**读取流程**：

1. 客户端调用 `DistributedFileSystem.open()` 打开文件。
2. `DistributedFileSystem` 向 NameNode 发送打开文件请求。
3. NameNode 返回文件的元数据，包括数据块的位置。
4. 客户端通过 `FSDataInputStream` 读取数据。
5. `FSDataInputStream` 连接到最近的 DataNode，读取数据块。
6. 数据块读取完成后，`FSDataInputStream` 关闭连接，并连接到下一个数据块的 DataNode。
7. 重复上述步骤，直到文件读取完成。

# HDFS 组成架构

- **NameNode**：管理文件系统的命名空间，维护文件系统树及整个树内所有的文件和目录。
- **DataNode**：存储实际的数据块，执行数据块的读/写操作。
- **SecondaryNameNode**：辅助 NameNode，定期合并编辑日志和文件系统镜像，减轻 NameNode 的负担。
- **Client**：与 HDFS 交互的客户端。

# HDFS 的容错机制

- **数据冗余**：默认情况下，每个数据块有三个副本，分布在不同的 DataNode 上。
- **自动故障检测**：DataNode 定期向 NameNode 发送心跳和块报告，NameNode 检测 DataNode 是否存活。
- **自动恢复**：当 DataNode 故障时，NameNode 会自动复制数据块到其他 DataNode，以保持副本数。

# HDFS NameNode HA

- **Active NameNode**：负责处理所有客户端请求。
- **Standby NameNode**：同步 Active NameNode 的状态，并在 Active NameNode 故障时接管服务。
- **ZooKeeper**：用于协调 Active 和 Standby NameNode 的状态。
- **JournalNode**：存储 EditLog，确保 Active 和 Standby NameNode 的状态同步。

# Hadoop 2.x HDFS 快照

Hadoop 2.x 引入了 HDFS 快照功能，允许用户对文件系统目录创建快照，以便在数据损坏或误删除时恢复数据。快照是文件系统目录在某个时间点的只读副本。

