Flink 是一个分布式流处理框架，具有高吞吐量、低延迟和容错性强的特点。
# Flink 架构

- **JobManager**：负责协调分布式执行，包括任务调度、失败恢复等。
- **TaskManager**：负责执行具体的任务，管理任务的内存。
- **Dispatcher**：提供一个 REST 接口来提交应用程序，并为每个提交的应用程序启动一个新的 JobManager。
- **ResourceManager**：负责资源的管理，包括任务槽（Task Slots）的管理。

# Flink 窗口

- **滚动窗口（Tumbling Windows）**：固定大小，无重叠。
- **滑动窗口（Sliding Windows）**：固定大小，有重叠。
- **会话窗口（Session Windows）**：基于活动的间隙，无固定大小。
- **全局窗口（Global Windows）**：将所有数据分配到一个窗口中。

**Flink 窗口函数**
- **ReduceFunction**：对窗口中的元素进行聚合。
- **AggregateFunction**：更复杂的聚合操作。
- **ProcessWindowFunction**：提供窗口的元数据信息，进行更复杂的处理。

# Flink 的时间语义

- **事件时间（Event Time）**：事件实际发生的时间。
- **摄入时间（Ingestion Time）**：事件进入 Flink 系统的时间。
- **处理时间（Processing Time）**：事件被处理的时间。

# Flink 的 Watermark

Watermark 水位线。

在 Flink 中，Watermark 是一种重要的机制，用于处理基于事件时间的乱序数据。通过生成合适的 Watermark，Flink 可以确保基于事件时间的窗口计算能够正确进行。用户可以选择内置的 Watermark 生成策略，也可以自定义生成逻辑，以适应不同的业务需求。

**水印类型**
- **周期性水印（Periodic Watermarks）**：定期生成水印。
- **间断性水印（Punctuated Watermarks）**：根据事件生成水印。

**Watermark 的生成**
- **固定延迟生成器（Fixed Delay Generator）**：生成一个固定延迟的 Watermark。例如，如果设置延迟为 5 秒，那么Watermark将比当前最大事件时间小 5 秒。
- **单调递增生成器（Monotonously Increasing Generator）**：生成的 Watermark 总是等于当前最大事件时间。这种策略适用于数据几乎不乱序的场景。
- **自定义生成器（Custom Generator）**：用户可以实现 `AssignerWithPeriodicWatermarks` 或 `AssignerWithPunctuatedWatermarks` 接口，自定义Watermark的生成逻辑。

# Flink CEP

Flink CEP（Complex Event Processing）是 Flink 提供的一个库，用于从事件流中检测复杂的事件模式。

Flink CEP 的步骤：定义一个模式（Pattern）；将 Pattern 应用到 DataStream 上，检测满足规则的复杂事件，得到一个 PatternStream；对 PatternStream 进行转换处理，将检测到的复杂事件提取出来，包装成报警信息输出。

# 数据流

- 无界数据流 DataStream API。
- 有界数据流 DataSet API。

# Flink Checkpoint

分布式快照
1. **Checkpoint Coordinator 触发快照**：Checkpoint Coordinator 决定创建一个分布式快照，并向所有任务发送 Barrier。
2. **Barrier 的发送**：Flink 会向数据流中插入特殊的 Barrier 标记，这些 Barrier 会随着数据流一起流动。
3. **Barrier 的对齐**：当算子接收到来自所有输入流的 Barrier 时，它会暂停处理新的数据，直到所有 Barrier 都被接收。
4. **状态的快照**：在 Barrier 对齐后，算子会将其状态快照发送到持久化存储系统中。
5. **Checkpoint 的确认**：一旦所有算子的状态快照都被成功存储，Checkpoint 就被认为是成功的。

**Savepoint**

Savepoint 是 Apache Flink 中的一种特殊类型的 Checkpoint，它为用户提供了一种手动触发的方式来创建作业状态的完整快照。与常规的 Checkpoint 不同，Savepoint 通常用于计划内的操作，如作业的更新、迁移或升级。
- **状态的快照**：Flink 会创建作业状态的完整快照，并将其存储在指定的路径。
- **Savepoint 的确认**：一旦状态快照被成功存储，Savepoint 就被认为是成功的。
- **重启作业**：Flink 会从指定的 Savepoint 路径加载状态，并重启作业。
- **继续处理**：作业从 Savepoint 的状态继续处理数据。

**Flink 的 Checkpoint 流程**
1. JobManager 发送 Checkpoint 触发请求。
2. TaskManager 接收到请求后，执行本地状态快照。
3. TaskManager 将快照数据发送到持久化存储。
4. JobManager 确认 Checkpoint 完成。

**Checkpoint 超时可能由以下原因导致**
- 状态过大，快照时间过长。
- 网络延迟，快照数据传输时间过长。
- 资源不足，任务执行缓慢。

# Flink Exactly-Once

**两阶段提交协议（Two-Phase Commit Protocol）**
1. **准备阶段**：Flink 的算子（如 Sink 算子）在接收到 Barrier 后，会准备提交其状态到外部系统。这通常包括将数据写入外部系统的临时区域，但不会提交事务。
2. **提交阶段**：一旦所有算子的状态快照都被成功存储，Flink 的协调者（JobManager）会通知所有算子提交事务。算子会将其在准备阶段写入的数据正式提交到外部系统。

# Flink 的优点

- 低延迟和高吞吐量。
- 支持事件时间和处理时间语义。
- 强大的状态管理和容错机制。
- 灵活的窗口和时间处理。

# Flink 和 Spark 的区别

- Flink 是真正的流处理框架，而 Spark 是微批处理框架。
- Flink 提供低延迟和高吞吐量，而 Spark 在批处理方面表现更好。

# Flink 的使用场景

Flink 适用于需要低延迟和高吞吐量的实时处理场景，如实时分析、实时监控、实时推荐等。

# Flink 的反压机制

反压机制的核心思想是：当下游处理节点无法及时处理上游发送的数据时，它会向上游发送一个信号（输出缓冲区填满），请求上游减慢数据发送的速度。这样，上游节点会根据下游节点的处理能力调整其发送速率，从而避免数据积压和系统崩溃。

Flink 通过其网络栈实现反压机制。具体来说，Flink 的网络栈包括以下组件：
- **Buffer Pool**：每个算子都有一个输出缓冲区，用于存储待发送的数据包。
- **Credit-Based Flow Control**：Flink 使用一种基于信用的流控制机制来实现反压。每个下游算子会向上游算子发送信用（Credit），表示它可以接收的数据包数量。当信用耗尽时，上游算子会停止发送数据包。

# Flink 数据延迟

- Flink 通过 Watermark 和窗口机制解决数据延迟问题：窗口会根据水位线来划分时间，一旦水位线达到窗口的结束时间，窗口就会被触发。这样可以确保即使数据到达的顺序是乱序的，也能在合适的时机触发窗口操作。
- **允许延迟**：如果设置了允许延迟，Flink 会在窗口关闭后继续接收延迟数据，并重新触发窗口计算。
- **侧输出（Side Output）**：Flink 可以将延迟数据输出到一个侧输出流，供后续处理。

# Flink 消费 Kafka

- Flink 消费 Kafka 分区的数据时，Flink 任务的并行度应与 Kafka 分区的数量相匹配。
- 通常使用 Flink 的 Kafka Connector 来消费 Kafka 数据。

# 动态修改 Flink 配置

可以通过 Flink 的 REST API 动态修改配置，无需重启 Flink。

# Flink 流批一体

Flink 支持流批一体的处理模式，即同一套 API 可以用于流处理和批处理。

# Flink 的 Check 和 Barrier

Check 是指 Flink 的 Checkpoint 机制，Barrier 是 Checkpoint 过程中用于同步的标记。

# Flink 状态机制

记录各个算子之前已经计算过值的结果，当有新数据来的时候，直接在这个结果上计算更新。这个就是**状态**。

![](assets/images/Flink-面经-1.png)

Flink 的状态机制允许用户在流处理过程中维护和管理状态。

**状态类型**
- **键控状态（Keyed State）**：与特定键相关联的状态，只能在 `KeyedStream` 上使用。键控状态可以有多种形式，如值状态（ValueState）、列表状态（ListState）、映射状态（MapState）等。
- **算子状态（Operator State）**：与算子实例相关联的状态，每个算子实例都有一个状态。算子状态通常用于源（Source）和接收器（Sink）等算子。

**状态的存储**
- **内存（Memory）**：状态存储在 JVM 堆内存中，适用于开发和调试，不适用于生产环境。
- **文件系统（FileSystem）**：状态存储在文件系统中，如 HDFS、S3 等。
- **RocksDB**：状态存储在 RocksDB 数据库中，适用于大规模状态存储，支持增量快照。

# Flink 广播流

广播流（Broadcast Stream）是一种特殊的流处理模式，它允许将一个数据流广播到所有并行实例中，以便每个实例都可以访问相同的数据。广播流通常用于配置更新、规则变更、全局状态共享等场景。

# Flink 实时 TopN

1. **数据源**：从数据源读取数据流。
2. **数据处理**：对数据流进行必要的转换和处理。
3. **状态管理**：使用 Flink 的状态管理功能维护 TopN 的状态。
4. **窗口操作**：使用窗口操作对数据进行分组和聚合。
5. **排序和截取**：对聚合结果进行排序，并截取 TopN 结果。
6. **输出结果**：将 TopN 结果输出到外部系统或打印到控制台。

# Flink SQL

# Flink on YARN 

- 内存集中管理模式：提前分配一个 Flink Session，资源持续占有不释放。只有一个 Session，会存在 Job 抢占资源的情况。
- 内存 Job 管理模式：每个 Job 独立申请 Flink Session，Job 完成后释放资源。

# Flink 数据不丢失

Flink 通过 Checkpoint 和状态管理确保数据不丢失。