# 协程与管道

```go
package main

import (
    "fmt"
    "math/rand"
    "time"
)

var intChan chan int

func main() {
    intChan = make(chan int, 150)
    exitChan: = make(chan bool, 1)
    go writeData(intChan)
    go readData(intChan, exitChan)
        // 等在协程的退出信号
    if <-exitChan {
        return
    }
    fmt.Println("=== 主线程退出 ===")
}

func writeData(intChan chan int) {
    // 替换已弃用的 rand.Seed 调用，使用 rand.New 和 rand.NewSource 创建本地随机数生成器
    rand.New(rand.NewSource(time.Now().UnixNano()))
    for i: = 1;
    i < 50;
    i++{
        var tempInt int
        tempInt = rand.Intn(4) + 10
        fmt.Printf("第 %v 次写入数据 >>> writeData 写入数据 %v \n", i, tempInt)
        intChan < -tempInt
    }
    close(intChan)
}

func readData(intChan chan int, exitChan chan bool) {
    var count int
    for {
        val, ok: = < -intChan
        count++
        if !ok {
            break
        }
        fmt.Printf("第 %v 次读取数据 >>> readData 读取数据 %v \n", count, val)
    }
    exitChan < -true
    close(exitChan)
}
```