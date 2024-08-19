# RDD

`RDD` 全称为 Resilient Distributed Datasets，是 Spark 最基本的数据抽象，它是只读的、分区记录的集合，支持并行操作，可以由外部数据集或其他 RDD 转换而来。
- `RDD` 由一个或多个 `Partitions`  组成，每个分区会被一个计算任务所处理，用户可以在创建 `RDD` 时指定其分区个数，如果没有指定，则默认采用程序所分配到的 CPU 的核心数；`K-V RDD` 拥有 `Partitioner`。
- `RDD` 保存彼此依赖关系，可重新计算丢失部分而不必对所有分区进行重新计算；

```
// RDD[T] 抽象类部分代码
// 由子类实现以计算给定分区
def compute(split: Partition, context: TaskContext): Iterator[T]
// 获取所有分区
protected def getPartitions: Array[Partition]
// 获取所有依赖关系
protected def getDependencies: Seq[Dependency[_]] = deps
// 获取优先位置列表
protected def getPreferredLocations(split: Partition): Seq[String] = Nil
// 分区器 由子类重写以指定它们的分区方式
@transient val partitioner: Option[Partitioner] = None
```

`RDD` 操作
- transformations：转换，从现有数据集创建新数据集。
- actions：在数据集上运行计算后将值返回到驱动程序。
`RDD` 中的所有转换操作都是惰性的，它们只是记住这些转换操作，但不会立即执行，只有遇到 action 操作后才会真正的进行计算，这类似于函数式编程中的惰性求值。

`RDD` 缓存
- 设置缓存级别；
- 移除缓存。Spark 会自动监视每个节点上的缓存使用情况，并按照最近最少使用（LRU）的规则删除旧数据分区。

在 Spark 中，一个任务对应一个分区，通常不会跨分区操作数据。但如果遇到 `reduceByKey` 等操作，Spark 必须从所有分区读取数据，并查找所有键的所有值，然后汇总在一起以计算每个键的最终结果 ，这称为 Shuffle。

Shuffle 是一项昂贵的操作，因为它通常会跨节点操作数据，这会涉及磁盘 IO，网络 IO，和数据序列化。某些 Shuffle 操作还会消耗大量的堆内存，因为它们使用堆内存来临时存储需要网络传输的数据。Shuffle 还会在磁盘上生成大量中间文件，从 Spark 1.3 开始，这些文件将被保留，直到相应的 RDD 不再使用并进行垃圾回收，这样做是为了避免在计算时重复创建 Shuffle 文件。如果应用程序长期保留对这些 RDD 的引用，则垃圾回收可能在很长一段时间后才会发生，这意味着长时间运行的 Spark 作业可能会占用大量磁盘空间，通常可以使用 `spark.local.dir` 参数来指定这些临时文件的存储目录。

宽依赖和窄依赖
- **窄依赖 (narrow dependency)**：父 RDDs 的一个分区最多被子 RDDs 一个分区所依赖；
- **宽依赖 (wide dependency)**：父 RDDs 的一个分区可以被子 RDDs 的多个子分区所依赖。

RDD(s) 及其之间的依赖关系组成了 DAG(有向无环图)，DAG 定义了这些 RDD(s) 之间的 Lineage(血统) 关系，通过血统关系，如果一个 RDD 的部分或者全部计算结果丢失了，也可以重新进行计算。

# Spark SQL

RDD VS. DataFrame
- 如果你想使用函数式编程而不是 DataFrame API，则使用 RDDs；
- 如果你的数据是非结构化的 (比如流媒体或者字符流)，则使用 RDDs；
- 如果你的数据是结构化的 (如 RDBMS 中的数据) 或者半结构化的 (如日志)，出于性能上的考虑，应优先使用 DataFrame。

![](assets/images/Spark-1.png)

Dataset：集成了 RDD 和 DataFrame 的优点，具备强类型的特点，同时支持 Lambda 函数，但只能在 Scala 和 Java 语言中使用。

# Spark Streaming

Storm 和 Flink 都是真正意义上的流计算框架，但 Spark Streaming 只是将数据流进行极小粒度的拆分，拆分为多个批处理，使得其能够得到接近于流处理的效果，但其本质上还是批处理（或微批处理）。




