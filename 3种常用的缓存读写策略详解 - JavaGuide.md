[跳至主要內容](#main-content)

[![](https://javaguide.cn/database/redis/3-commonly-used-cache-read-and-write-strategies.html/logo.png)JavaGuide](/)

[面试指南](/home.html)

[开源项目](/open-source-project/)

[技术书籍](/books/)

[程序人生](/high-quality-technical-articles/)

知识星球

- [星球介绍](/about-the-author/zhishixingqiu-two-years.html)
- [星球专属优质专栏](/zhuanlan/)
- [星球优质主题汇总](https://www.yuque.com/snailclimb/rpkqw1/ncxpnfmlng08wlf1)

网站相关

- [关于作者](/about-the-author/)
- [更新历史](/timeline/)

[](https://github.com/Snailclimb/JavaGuide)

- 项目介绍
    
- 面试准备（必看）
    
- Java
    
- 计算机基础
    
- 数据库
    
    - 基础
        
        - [数据库基础知识总结](/database/basis.html)
        - [NoSQL基础知识总结](/database/nosql.html)
        - [字符集详解](/database/character-set.html)
        - SQL
            
        
    - MySQL
        
        - [MySQL常见面试题总结](/database/mysql/mysql-questions-01.html)
        - [MySQL高性能优化规范建议总结](/database/mysql/mysql-high-performance-optimization-specification-recommendations.html)
        - 重要知识点
            
        
    - Redis
        
        - [缓存基础常见面试题总结(付费)](/database/redis/cache-basics.html)
        - [Redis常见面试题总结(上)](/database/redis/redis-questions-01.html)
        - [Redis常见面试题总结(下)](/database/redis/redis-questions-02.html)
        - 重要知识点
            
            - [如何基于Redis实现延时任务](/database/redis/redis-delayed-task.html)
            - [3种常用的缓存读写策略详解](/database/redis/3-commonly-used-cache-read-and-write-strategies.html)
            - [Redis 5 种基本数据类型详解](/database/redis/redis-data-structures-01.html)
            - [Redis 3 种特殊数据类型详解](/database/redis/redis-data-structures-02.html)
            - [Redis为什么用跳表实现有序集合](/database/redis/redis-skiplist.html)
            - [Redis持久化机制详解](/database/redis/redis-persistence.html)
            - [Redis内存碎片详解](/database/redis/redis-memory-fragmentation.html)
            - [Redis常见阻塞原因总结](/database/redis/redis-common-blocking-problems-summary.html)
            - [Redis集群详解(付费)](/database/redis/redis-cluster.html)
            
        
    - Elasticsearch
        
    - MongoDB
        
    
- 开发工具
    
- 常用框架
    
- 系统设计
    
- 分布式
    
- 高性能
    
- 高可用
    

# 3种常用的缓存读写策略详解

[Guide](https://javaguide.cn/article/)数据库Redis约 1640 字大约 5 分钟

---

此页内容

- [Cache Aside Pattern（旁路缓存模式）](#cache-aside-pattern-旁路缓存模式)
- [Read/Write Through Pattern（读写穿透）](#read-write-through-pattern-读写穿透)
- [Write Behind Pattern（异步缓存写入）](#write-behind-pattern-异步缓存写入)

看到很多小伙伴简历上写了“**熟练使用缓存**”，但是被我问到“**缓存常用的 3 种读写策略**”的时候却一脸懵逼。

在我看来，造成这个问题的原因是我们在学习 Redis 的时候，可能只是简单写了一些 Demo，并没有去关注缓存的读写策略，或者说压根不知道这回事。

但是，搞懂 3 种常见的缓存读写策略对于实际工作中使用缓存以及面试中被问到缓存都是非常有帮助的！

**下面介绍到的三种模式各有优劣，不存在最佳模式，根据具体的业务场景选择适合自己的缓存读写模式。**

### [Cache Aside Pattern（旁路缓存模式）](#cache-aside-pattern-旁路缓存模式)

**Cache Aside Pattern 是我们平时使用比较多的一个缓存读写模式，比较适合读请求比较多的场景。**

Cache Aside Pattern 中服务端需要同时维系 db 和 cache，并且是以 db 的结果为准。

下面我们来看一下这个策略模式下的缓存读写步骤。

**写**：

- 先更新 db
- 然后直接删除 cache 。

简单画了一张图帮助大家理解写的步骤。

![](https://oss.javaguide.cn/github/javaguide/database/redis/cache-aside-write.png)

**读** :

- 从 cache 中读取数据，读取到就直接返回
- cache 中读取不到的话，就从 db 中读取数据返回
- 再把数据放到 cache 中。

简单画了一张图帮助大家理解读的步骤。

![](https://oss.javaguide.cn/github/javaguide/database/redis/cache-aside-read.png)

你仅仅了解了上面这些内容的话是远远不够的，我们还要搞懂其中的原理。

比如说面试官很可能会追问：“**在写数据的过程中，可以先删除 cache ，后更新 db 么？**”

**答案：** 那肯定是不行的！因为这样可能会造成 **数据库（db）和缓存（Cache）数据不一致**的问题。

举例：请求 1 先写数据 A，请求 2 随后读数据 A 的话，就很有可能产生数据不一致性的问题。

这个过程可以简单描述为：

> 请求 1 先把 cache 中的 A 数据删除 -> 请求 2 从 db 中读取数据->请求 1 再把 db 中的 A 数据更新

当你这样回答之后，面试官可能会紧接着就追问：“**在写数据的过程中，先更新 db，后删除 cache 就没有问题了么？**”

**答案：** 理论上来说还是可能会出现数据不一致性的问题，不过概率非常小，因为缓存的写入速度是比数据库的写入速度快很多。

举例：请求 1 先读数据 A，请求 2 随后写数据 A，并且数据 A 在请求 1 请求之前不在缓存中的话，也有可能产生数据不一致性的问题。

这个过程可以简单描述为：

> 请求 1 从 db 读数据 A-> 请求 2 更新 db 中的数据 A（此时缓存中无数据 A ，故不用执行删除缓存操作 ） -> 请求 1 将数据 A 写入 cache

现在我们再来分析一下 **Cache Aside Pattern 的缺陷**。

**缺陷 1：首次请求数据一定不在 cache 的问题**

解决办法：可以将热点数据可以提前放入 cache 中。

**缺陷 2：写操作比较频繁的话导致 cache 中的数据会被频繁被删除，这样会影响缓存命中率 。**

解决办法：

- 数据库和缓存数据强一致场景：更新 db 的时候同样更新 cache，不过我们需要加一个锁/分布式锁来保证更新 cache 的时候不存在线程安全问题。
- 可以短暂地允许数据库和缓存数据不一致的场景：更新 db 的时候同样更新 cache，但是给缓存加一个比较短的过期时间，这样的话就可以保证即使数据不一致的话影响也比较小。

### [Read/Write Through Pattern（读写穿透）](#read-write-through-pattern-读写穿透)

Read/Write Through Pattern 中服务端把 cache 视为主要数据存储，从中读取数据并将数据写入其中。cache 服务负责将此数据读取和写入 db，从而减轻了应用程序的职责。

这种缓存读写策略小伙伴们应该也发现了在平时在开发过程中非常少见。抛去性能方面的影响，大概率是因为我们经常使用的分布式缓存 Redis 并没有提供 cache 将数据写入 db 的功能。

**写（Write Through）：**

- 先查 cache，cache 中不存在，直接更新 db。
- cache 中存在，则先更新 cache，然后 cache 服务自己更新 db（**同步更新 cache 和 db**）。

简单画了一张图帮助大家理解写的步骤。

![](https://oss.javaguide.cn/github/javaguide/database/redis/write-through.png)

**读(Read Through)：**

- 从 cache 中读取数据，读取到就直接返回 。
- 读取不到的话，先从 db 加载，写入到 cache 后返回响应。

简单画了一张图帮助大家理解读的步骤。

![](https://oss.javaguide.cn/github/javaguide/database/redis/read-through.png)

Read-Through Pattern 实际只是在 Cache-Aside Pattern 之上进行了封装。在 Cache-Aside Pattern 下，发生读请求的时候，如果 cache 中不存在对应的数据，是由客户端自己负责把数据写入 cache，而 Read Through Pattern 则是 cache 服务自己来写入缓存的，这对客户端是透明的。

和 Cache Aside Pattern 一样， Read-Through Pattern 也有首次请求数据一定不再 cache 的问题，对于热点数据可以提前放入缓存中。

### [Write Behind Pattern（异步缓存写入）](#write-behind-pattern-异步缓存写入)

Write Behind Pattern 和 Read/Write Through Pattern 很相似，两者都是由 cache 服务来负责 cache 和 db 的读写。

但是，两个又有很大的不同：**Read/Write Through 是同步更新 cache 和 db，而 Write Behind 则是只更新缓存，不直接更新 db，而是改为异步批量的方式来更新 db。**

很明显，这种方式对数据一致性带来了更大的挑战，比如 cache 数据可能还没异步更新 db 的话，cache 服务可能就就挂掉了。

这种策略在我们平时开发过程中也非常非常少见，但是不代表它的应用场景少，比如消息队列中消息的异步写入磁盘、MySQL 的 Innodb Buffer Pool 机制都用到了这种策略。

Write Behind Pattern 下 db 的写性能非常高，非常适合一些数据经常变化又对数据一致性要求没那么高的场景，比如浏览量、点赞量。

![JavaGuide 官方公众号](https://oss.javaguide.cn/github/javaguide/gongzhonghaoxuanchuan.png)

[编辑此页](https://github.com/Snailclimb/JavaGuide/edit/main/docs/database/redis/3-commonly-used-cache-read-and-write-strategies.md)

上次编辑于: 2024/2/16 11:07:49

贡献者: guide,zhangzhe,Guide,Mr.Hope,ShimenTian

[

上一页

如何基于Redis实现延时任务

](/database/redis/redis-delayed-task.html)[

下一页

Redis 5 种基本数据类型详解

](/database/redis/redis-data-structures-01.html)

[鄂ICP备2020015769号-1](https://beian.miit.gov.cn/)

Copyright © 2025 Guide