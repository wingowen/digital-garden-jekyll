客户方像调用本地方法一样去调用远程接口方法，RPC 框架提供接口的代理实现，实际的调用将委托给代理 RpcProxy 。代理封装调用信息并将调用转交给 RpcInvoker 去实际执行。在客户端的RpcInvoker 通过连接器 RpcConnector 去维持与服务端的通道 RpcChannel，并使用 RpcProtocol 执行协议编码 encode 并将编码后的请求消息通过通道发送给服务方。


> Invoker 反射是 Java 提供的一种强大的功能，允许程序在运行时检查或修改类的行为、方法和属性。通过反射，你可以在运行时调用方法、构造对象、修改字段等，而不需要在编译时知道这些类的具体信息。

![](assets/images/RPC-1.png)

> Java RPC 框架 Dubbo 是阿里巴巴内部的 [[SOA]] 服务化治理方案的核心框架。


