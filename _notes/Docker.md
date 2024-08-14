docker 或者容器和传统虚拟化最大的区别，就是虚拟化的封装是系统级的封装，docker 或者其他容器是进程级的封装。

Docker 底层技术主要包括 Namespaces，Cgroups 和 rootfs。
- Namespace 的作用是访问隔离，Linux Namespaces 机制提供 种资源隔离方案。每个 Namespace 下的资源，对于其他 Namespace 下的资源都是不可见的。
- Cgroup 主要用来资源控制，CPU MEM 宽带等。提供的一种可以限制、记录、隔离进程组所使用的物理资源机制，实现进程资源控制。
- rootfs 的作用是文件系统隔离。