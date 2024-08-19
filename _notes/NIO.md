[Java NIO](https://jenkov.com/tutorials/java-nio/overview.html)

Core Components `Channels` `Buffers` `Selector`。
-  From the `Channel` data can be read into a `Buffer`. Data can also be written from a `Buffer` into a `Channel`.
- A `Selector` allows a single thread to handle multiple Channel's. To use a `Selector` you register the `Channel`'s with it. Then you call it's `select()` method. This method will block until there is an event ready for one of the registered channels. Once the method returns, the thread can then process these events.

A `Buffer` has three properties you need to be familiar with: capacity position limit.

Scatter / Gather
- A "scattering read" reads data from a single channel into multiple buffers.
- A "gathering write" writes data from multiple buffers into a single channel.

TODO......

[[Netty]]
