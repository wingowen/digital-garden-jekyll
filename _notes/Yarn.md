![](assets/images/Yarn-1.png)

ResourceManager 是一个全局的资源管理器，负责整个系统的资源管理和分配。它主要由两个组件构成：调度器 Scheduler 和应用程序管理器 Applications Manager。
- 调度器根据容量、队列等限制条件，将系统中的资源分配给各个正在运行的 MapReduce 程序。
- 应用程序管理器负责管理整个系统中所有 MapReduce 程序，包括提交、与调度器协商资源以启动 ApplicationMaster、监控 ApplicationMaster 运行状态并在失败时重新启动它等。

用户提交的每个 MapReduce 程序均包含一个 ApplicationMaster，主要功能包括：与 ResourceManager 调度器协商以获取资源；将得到的任务进一步分配给内部的任务；与 NodeManager 通信以启停任务；监控所有任务运行状态，并在任务运行失败时重新为任务申请资源以重启任务。

NodeManager 是每个设备上的资源和任务管理器，一方面，它会定时地向 ResourceManager 汇报本设备上的资源使用情况和各个 Container 的运行状态；另一方面，它接收并处理来自 ApplicationMaster 的 Container 启停等各种请求。

Container 是 YARN 中的资源抽象，它封装了某个设备上的多维度资源，如内存、CPU、磁盘、网络等，当 AM 向 RM 申请资源时，RM 为 AM 返回的资源便是用 Container 表示。
