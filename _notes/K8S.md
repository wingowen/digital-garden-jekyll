---
---
[[Docker]]

[Kubernetes指南](https://www.bookstack.cn/read/feiskyer-kubernetes-handbook-202005/README.md)
# 简介

## 基本概念

- Container
- Pod：Pod 是一组紧密关联的容器集合，它们共享 PID、IPC、Network 和 UTS namespace，是 Kubernetes 调度的基本单位。
- Node：是 Pod 真正运行的主机。为了管理 Pod，每个 Node 节点上至少要运行 container runtime（比如 docker 或者 rkt）、`kubelet` 和 `kube-proxy` 服务。
- Namespace：是对一组资源和对象的抽象集合，比如可以用来将系统内部的对象划分为不同的项目组或用户组。
- Service：Service 是应用服务的抽象，通过 labels 为应用提供负载均衡和服务发现。匹配 labels 的 Pod IP 和端口列表组成 endpoints，由 kube-proxy 负责将服务 IP 负载均衡到这些 endpoints 上。
- Label：是识别 Kubernetes 对象的标签，以 key/value 的方式附加到对象上。
- Annotation

### pod

Pod 是一组紧密关联的容器集合，它们共享 PID、IPC、Network 和 UTS namespace，是 Kubernetes 调度的基本单位。Pod 内的多个容器共享网络和文件系统，可以通过进程间通信和文件共享这种简单高效的方式组合完成服务。
- **PID namespace**：容器之间可以看到彼此的进程（可选，取决于配置）。
- **IPC namespace**：容器之间可以通过进程间通信（如共享内存）进行通信。
- **Network namespace**：所有容器共享同一个网络栈，包括 IP 地址和端口空间，因此它们可以通过 `localhost` 互相通信。
- **UTS namespace**：容器共享主机名。

IPC 是 **Inter-Process Communication**（进程间通信）的缩写，指操作系统为用户态进程提供的**数据交换与同步手段**。它让两个或多个彼此独立的进程能够：
- 交换数据（消息、字节流、共享对象）
- 同步执行（锁、信号、事件）
- 共享资源（内存、文件描述符、信号量等）

### Serevice

```yml
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  ports:
    - port: 8078 
      name: http
      targetPort: 80
      protocol: TCP
  selector:
    app: nginx
```
### 核心组成

Kubernetes 主要由以下几个核心组件组成：
- etcd 保存了整个集群的状态；
- apiserver 提供了资源操作的唯一入口，并提供认证、授权、访问控制、API 注册和发现等机制；
- controller manager 负责维护集群的状态，比如故障检测、自动扩展、滚动更新等；
- scheduler 负责资源的调度，按照预定的调度策略将 Pod 调度到相应的机器上；
- kubelet 负责维护容器的生命周期，同时也负责 Volume（CVI）和网络（CNI）的管理；
- Container runtime 负责镜像管理以及 Pod 和容器的真正运行（CRI）；
- kube-proxy 负责为 Service 提供 cluster 内部的服务发现和负载均衡。



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