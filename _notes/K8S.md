---
---
# Docker

Docker 或者容器和传统虚拟化最大的区别，就是虚拟化的封装是系统级的封装，docker 或者其他容器是进程级的封装。

Docker 底层技术主要包括 Namespaces，Cgroups 和 rootfs。
- Namespace 的作用是访问隔离，Linux Namespaces 机制提供 种资源隔离方案。每个 Namespace 下的资源，对于其他 Namespace 下的资源都是不可见的。
- Cgroup 主要用来资源控制，CPU MEM 宽带等。提供的一种可以限制、记录、隔离进程组所使用的物理资源机制，实现进程资源控制。
- rootfs 的作用是文件系统隔离。

# 控制器

比较常用的控制器，如 pod 控制器、deployment 控制器、service 控制器、replicaset 控制器等。这些控制器一部分是由 kube controller manager 这个管理器实现和管理，而像 route 控制器和 service 控制器，则由 cloud controller manager 实现。

# 集群网络

在一个典型的 Kubernetes 集群中，每个节点上的容器网络可能会使用以下方式配置：
- cni0: 作为节点上的一个桥接接口，连接所有在该节点上运行的容器。
- veth pair: 每个容器会有一个 veth 接口对，其中一个接口在容器的网络命名空间中，另一个接口连接到 cni0 桥接接口。
- eth0: 节点的物理网络接口，用于连接到外部网络，如互联网或其他网络。

数据流示例，假设有一个容器需要访问外部网络：
1. 容器内的应用程序发送数据包到容器的 veth 接口。
2. 数据包通过 veth 接口对中的另一个接口到达 cni0 桥接接口。
3. cni0 桥接接口将数据包转发到主机的 eth0 接口。
4. eth0 接口将数据包发送到外部网络。

在 Kubernetes 集群中，CIDR（无类别域间路由）用于定义集群的 IP 地址范围，而 podCIDR 则是为每个节点分配的子网段，用于为该节点上的 Pod 分配 IP 地址。

VPC（Virtual Private Cloud）是云计算环境中的一种网络服务，允许用户在云提供商的基础设施上创建一个隔离的虚拟网络。

flannel 方案。

![](assets/images/K8S01.png)
![](assets/images/K8S-1.png)

# 集群伸缩

手动。

自动 Cluster Autoscaler。