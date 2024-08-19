一个典型的 MR 作业。
1. Map 阶段：Map 任务处理输入数据，并将中间结果写入本地磁盘（LocalWrite）。一个 Map 函数就是对一些独立元素组成的概念上的列表的每一个元素进行指定的操作，Map 每个元素都是被独立操作的，而原始列表没有被更改，因为这里创建了一个新的列表来保存操作结果。这就是说，Map操作是可以高度并行的
2. Shuffle 阶段：Map 任务的中间结果通过网络传输到 Reduce 任务节点。
3. Reduce 阶段：Reduce 任务从多个 Map 任务节点读取中间结果（RemoteRead），并进行合并和处理，最终生成输出结果。

![](MapReduce-1.png)

LocalWrite 指的是 Map 任务将其输出数据写入本地磁盘。在 MapReduce 作业中，Map 任务通常会在本地节点上处理输入数据，并将中间结果写入本地磁盘。（本地磁盘 IO 速度 > 网络 IO 速度）

RemoteRead 指的是 Reduce 任务从远程节点读取 Map 任务的输出数据。在 MapReduce 作业中，Reduce 任务通常会在不同的节点上运行，并从多个 Map 任务节点读取中间结果。