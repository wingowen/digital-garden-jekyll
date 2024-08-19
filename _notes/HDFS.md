---
name: HDFS
---
Namenode 是一个中心服务器，负责管理文件系统的命名空间以及文件的访问控制。执行文件系统的命名空间操作，比如打开、关闭、重命名文件或目录。它也负责确定数据块到具体 Datanode 设备的映射。为了保证文件系统的高可靠，往往需要另一个 Standby 的 Namenode 在 Actived Namenode 出现问题后，立刻接管文件系统。

Datanode一般是一个设备上部署一个，负责管理它所在节点上的存储。负责处理文件系统客户端的读写请求。在 Namenod e的统一调度下进行数据块的创建、删除和复制。


![](assets/images/HDFS-1.png)

Zookeeper 负责接受 NameNode 的心跳，当 Actived NameNode 不向 Zookeeper 报告心跳时，Standby NameNode 的监控进程会收到这个消息，从而激活 Standby NameNode 并接管 Active NameNode 的工作。

NFS 负责为 2 个 NameNode 存储 EditLog 文件。NameNode 在执行 HDFS 客户端提交的创建文件或者移动文件这样的写操作时，会首先把这些操作记录在 EditLog 文件之中，然后再更新内存中的文件系统镜像，最终再刷新到磁盘。 EditLog 只是在数据恢复的时候起作用。记录在 EditLog 之中的每一个操作又称为一个事务，每个事务有一个整数形式的事务 id 作为编号。EditLog 会被切割为很多段，每一段称为一个 Segment。当发生 NameNode 切换的情况时，Standby NameNode 接管后，会根据 EditLog 中把未完成的写操作继续下去并开使向 EditLog 写入新的写操作记录。(此外，hadoop 还提供了另一种 QJM 的 EditLog 方案)

DNS&NTP 分布负责整个系统的域名服务和时间服务。这个在集群部署中是非常有必要的两个存在。首先说一下 DNS 的必要性。
- Hadoop 是极力提倡用机器名作为在 HDFS 环境中的标识。当然可以在 /etc/hosts 文件中去标明机器名和 IP 的映射关系，可是请想想如果在一个数千台设备的集群中添加一个设备时，负责系统维护的伙伴会不会骂集群的设计者呢？
- 其次是 NTP 的必要性，在刚刚开始接触 Hadoop 集群时我遇到的大概 90% 的问题是由于各个设备时间不一致导致的。各个设备的时间同步是数据一致性和管理一致性的一个基本保障。