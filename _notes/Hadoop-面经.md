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
- **SecondaryNameNode**：辅助 NameNode，定期合并编辑日志 edits 和文件系统镜像 fsimage，减轻 NameNode 的负担。
- **Client**：与 HDFS 交互的客户端。

# HDFS 启动过程

1. Loading fsimage：加载元信息文件，元信息记录了数据块的位置，获取整个 HDFS 中数据块的分布信息。元信息中不包含 HDFS 的状态信息。
2. Loading edits：加载日志信息，日志中记录了 HDFS 的最新状态。
3. Saving checkpoints：触发一个检查点，以最高优先级唤醒 Secondary NamNode，开启合并最新状态信息 edits 到镜像文件 fsimage 的过程。
4. Safe mode：进入安全模式，检查数据块的完整性。（安全模式下不能写只能查）

# HDFS 高级特性

- 回收站
- 名称 / 空间配额
- 目录级别快照
- 安全模式
- 权限管理

# HDFS 的容错机制

- **数据冗余**：默认情况下，每个数据块有三个副本，分布在不同的 DataNode 上。
- **自动故障检测**：DataNode 定期向 NameNode 发送心跳和块报告，NameNode 检测 DataNode 是否存活。
- **自动恢复**：当 DataNode 故障时，NameNode 会自动复制数据块到其他 DataNode，以保持副本数。

# HDFS ViewFS

- **统一命名空间**：在一个大型组织中，可能有多个 HDFS 集群，每个集群都有自己的命名空间。使用 `viewfs`，可以创建一个统一的命名空间，使得用户和应用程序可以像访问单个文件系统一样访问这些集群。
- **简化管理**：通过 `viewfs`，管理员可以更容易地管理跨多个集群的文件和目录，而不需要用户了解每个集群的具体配置。
- **灵活的挂载点配置**：`viewfs` 允许管理员配置挂载点，将特定的路径映射到不同的文件系统，从而实现灵活的数据访问和管理。

# HDFS NameNode HA

- **Active NameNode**：负责处理所有客户端请求。
- **Standby NameNode**：同步 Active NameNode 的状态，并在 Active NameNode 故障时接管服务。
- **ZooKeeper**：用于协调 Active 和 Standby NameNode 的状态。
- **JournalNode**：存储 EditLog，确保 Active 和 Standby NameNode 的状态同步。

# Hadoop 2.x HDFS 快照

Hadoop 2.x 引入了 HDFS 快照功能，允许用户对文件系统目录创建快照，以便在数据损坏或误删除时恢复数据。快照是文件系统目录在某个时间点的只读副本。

# MapReduce 架构

- **JobTracker** 负责作业调度和任务管理。JobTracker 负责调度 Map 和 Reduce 任务，并记录每个 Map 任务的输出位置。Reduce 任务启动时，JobTracker 会通知它从哪些 Map 任务的输出位置拉取数据。
- **TaskTracker** 负责执行具体的 Map 和 Reduce 任务。
- **HDFS** 用于存储输入和输出数据。

# MapReduce 工作原理

1. **输入数据分割**：输入数据被分割成多个数据块，每个数据块由一个 Map 任务处理。
2. **Map 阶段**：Map 任务读取输入数据，并生成键值对。
3. **Shuffle 阶段**：将 Map 任务的输出进行排序和分区，发送给相应的 Reduce 任务。
4. **Reduce 阶段**：Reduce 任务接收键值对，进行合并和聚合，生成最终结果。
5. **输出结果**：Reduce 任务的输出被写入 HDFS。

# Shuffle 过程

1. **Map 端输出**：Map 任务将输出结果写入环型缓冲区。
2. **溢写到磁盘**：当环型缓冲区满时，数据被溢写到磁盘。
3. **合并溢写文件**：将多个溢写文件合并成一个文件。
4. **分区**：对合并后的文件进行分区。
5. **排序**：对每个分区的数据进行排序。（内存做快排，磁盘做归并）
6. **传输到 Reduce**：将排序后的数据传输到相应的 Reduce 任务。

优化措施

- **Combiner**：在 Map 端进行预聚合。
- **压缩**：对数据进行压缩，减少网络传输开销。
- **优化分区**：合理设置分区数，避免数据倾斜。

# MapReduce Join

Reduce Side Join
1. mapper 分别读取不同的数据集；
2. mapper 的输出中，通常以 join 的字段作为输出的key；
3. 不同数据集的数据经过 shuffle，key 一样的会被分到同一分组处理；
4. 在 reduce 中根据业务需求把数据进行关联整合汇总，最终输出。

Map Side Join（大小表）
1. 首先分析 join 处理的数据集，使用分布式缓存技术将小的数据集进行分布式缓存；
2. MapReduce 框架在执行的时候会自动将缓存的数据分发到各个 maptask 运行的机器上；
3. 程序只运行 mapper，在 mapper 初始化的时候从分布式缓存中读取小数据集数据，然后和自己读取的大数据集进行 join 关联，输出最终的结果；
4. 整个 join 的过程没有 shuffle，没有 reducer。

> map 端 join 最大的优势减少 shuffle 时候的数据传输成本。并且 mapper 的并行度可以根据输入数据量自动调整，充分发挥分布式计算的优势。

# 分片分区

Map 的分片大小通常由输入数据的大小和 HDFS 的块大小决定。默认情况下，Map 的分片大小等于 HDFS 的块大小（128MB）。MapTask 的数量由输入数据的分片数决定。输入数据被分割成多个数据块，每个数据块由一个 Map 任务处理。默认情况下，MapTask 的数量等于输入数据的分片数。

MapReduce 分区是将 Map 任务的输出结果按 key 分配到不同的 Reduce 任务。

# MapReduce GC

选择合适的 JVM 垃圾回收器可以提高 MapReduce 的吞吐量。常见的选择包括：
- **G1 GC**：适用于大内存的场景，可以减少停顿时间。
- **Parallel GC**：适用于高吞吐量的场景，可以并行处理垃圾回收。
- **CMS GC**：适用于低延迟的场景，可以减少停顿时间。

# 什么是 YARN

YARN（Yet Another Resource Negotiator）是 Hadoop 的资源管理器，负责集群资源的管理和作业调度。它将资源管理和作业调度/监控分离，使得 Hadoop 可以支持多种计算框架，如 MapReduce、Spark、Flink 等。YARN 的核心思想是将 JobTracker 的两个主要功能（资源管理和作业调度/监控）分离成两个独立的守护进程：ResourceManager 和 NodeManager。

# YARN 有几个模块

- **ResourceManager (RM)**：负责整个系统的资源管理和分配。
- **NodeManager (NM)**：负责单个节点的资源管理和使用。
- **ApplicationMaster (AM)**：负责应用程序的管理，包括任务的监控和容错。
- **Container**：YARN 中的资源抽象，包括内存、CPU 等。

# YARN 工作机制

1. **客户端提交作业**：客户端将作业提交给 ResourceManager。
2. **ResourceManager 分配资源**：ResourceManager 分配一个 Container 给 ApplicationMaster，并在该 Container 中启动 ApplicationMaster。
3. **ApplicationMaster 注册**：ApplicationMaster 向 ResourceManager 注册，并请求资源以运行任务。
4. **NodeManager 启动任务**：ResourceManager 将资源分配给 NodeManager，NodeManager 在 Container 中启动任务。
5. **任务执行**：任务在 Container 中执行，ApplicationMaster 监控任务的进度和状态。
6. **任务完成**：任务完成后，ApplicationMaster 向 ResourceManager 注销，并释放资源。

# YARN 的优势以及解决的问题

优势
- **支持多种计算框架**：YARN 可以支持多种计算框架，如 MapReduce、Spark、Flink 等。
- **资源利用率高**：YARN 可以更有效地管理和利用集群资源。
- **可扩展性好**：YARN 的设计使其更容易扩展到大规模集群。
- **容错性好**：YARN 提供了更好的容错机制，确保作业的连续运行。

解决问题
- **资源管理问题**：YARN 提供了更细粒度的资源管理，提高了资源利用率。
- **作业调度问题**：YARN 提供了更灵活的作业调度机制，支持多种调度策略。
- **多租户问题**：YARN 支持多租户，允许多个用户或团队共享同一个集群。

# YARN 容错机制

- **ResourceManager 高可用**：通过多个 ResourceManager 实例实现高可用。使用 ZooKeeper 协调 ResourceManager 的主备切换。
- **NodeManager 自动恢复**：NodeManager 可以自动恢复失败的容器和任务。
- **ApplicationMaster 重试**：ApplicationMaster 可以重试失败的任务。

# YARN 调度器

- **FIFO Scheduler**：先进先出调度器。
- **Capacity Scheduler**：容量调度器，支持多租户和资源共享。
- **Fair Scheduler**：公平调度器，支持资源公平分配。

# Hadoop 3.x YARN

- **资源本地化改进**：提高了资源本地化的效率。
- **容器重用**：支持容器的重用，减少了容器启动时间。
- **GPU 和 FPGA 支持**：支持 GPU 和 FPGA 等硬件资源的管理。
- **改进的调度器**：提供了更灵活和高效的调度器。

### YARN 监控

- **ResourceManager Web UI**：通过 ResourceManager 的 Web 界面监控集群状态和作业进度。
- **Metrics 和 JMX**：通过收集 YARN 的 Metrics 和 JMX 数据进行监控。
- **第三方监控工具**：使用第三方监控工具（如 Prometheus、Ganglia 等）进行监控。