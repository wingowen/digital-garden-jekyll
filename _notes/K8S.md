---
---

[[Docker]]

比较常用的控制器，如 pod 控制器、deployment 控制器、service 控制器、replicaset 控制器等。这些控制器一部分是由 kube controller manager 这个管理器实现和管理，而像 route 控制器和 service 控制器，则由 cloud controller manager 实现。

# 集群网络

在 Kubernetes 集群中，CIDR（无类别域间路由）用于定义集群的 IP 地址范围，而 podCIDR 则是为每个节点分配的子网段，用于为该节点上的 Pod 分配 IP 地址。

VPC（Virtual Private Cloud）是云计算环境中的一种网络服务，允许用户在云提供商的基础设施上创建一个隔离的虚拟网络。

flannel 方案。

![](assets/images/K8S01.png)
![](assets/images/K8S-1.png)

# 集群伸缩

手动。

自动 Cluster Autoscaler。