# 计算过程

一个典型的 MR 作业。

1. Map 阶段：Map 任务处理输入数据，并将中间结果写入本地磁盘（LocalWrite）。一个 Map 函数就是对一些独立元素组成的概念上的列表的每一个元素进行指定的操作，Map 每个元素都是被独立操作的，而原始列表没有被更改，因为这里创建了一个新的列表来保存操作结果。这就是说，Map 操作是可以高度并行的；一个 Map 函数可以针对一部分数据进行运算，这样就可以将一个大数据切分成很多块，MapReduce 计算框架为每个块分配一个 Map 函数去计算，从而实现大数据的分布式计算。
2. Shuffle 阶段：Map 任务的中间结果通过网络传输到 Reduce 任务节点。Map 任务快要计算完成的时候，MapReduce 计算框架会启动 Shuffle 过程，在 Map 端调用一个 Partitioner 接口，对 Map 产生的每个 <key , value> 进行 Reduce 分区选择，然后通过 Http 通信发送给对应的 Reduce 进程。
4. Reduce 阶段：Reduce 任务从多个 Map 任务节点读取中间结果（RemoteRead），并进行合并和处理，最终生成输出结果。

LocalWrite 指的是 Map 任务将其输出数据写入本地磁盘。在 MapReduce 作业中，Map 任务通常会在本地节点上处理输入数据，并将中间结果写入本地磁盘。（本地磁盘 IO 速度 > 网络 IO 速度）

RemoteRead 指的是 Reduce 任务从远程节点读取 Map 任务的输出数据。在 MapReduce 作业中，Reduce 任务通常会在不同的节点上运行，并从多个 Map 任务节点读取中间结果。
![](assets/images/MapReduce-1.png)

![](assets/images/MapReduce-2.png)

# 作业启动

![](assets/images/MapReduce-3.png)

大数据应用进程：启动用户 MapReduce 程序的主入口，主要指定 Map 和 Reduce 类、输入输出文件路径等，并提交作业给 Hadoop 集群。

JobTracker 进程：根据要处理的输入数据量启动相应数量的 map 和 reduce 进程任务，并管理整个作业生命周期的任务调度和监控。JobTracker 进程在整个 Hadoop 集群全局唯一。

TaskTracker 进程：负责启动和管理 map 进程以及 reduce 进程。因为需要每个数据块都有对应的 map 函数，TaskTracker 进程通常和 HDFS 的 DataNode 进程启动在同一个服务器，也就是说，Hadoop 集群中绝大多数服务器同时运行 DataNode 进程和 TaskTacker 进程。

