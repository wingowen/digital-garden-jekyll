# 管道

```go
// 必须通过 make 声明
// 满了会报错
// chan 可声明只读只写
var chanIn chan<- int
var chanOut ->chan int

// 多通道选择
select {
case <-channel1:
    // 当 channel1 有数据可接收时执行的代码
case channel2 <- value:
    // 当可以向 channel2 发送数据时执行的代码
default:
    // 当没有通道操作可以立即执行时执行的代码
}
```

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

# 并行找质数

```go
package main

import (
	"fmt"
)

var intChan chan int = make(chan int, 100)

func main() {

	var primeChan chan int = make(chan int, 100)
	var exitChan chan bool = make(chan bool, 8)

	go initChan(100)

	for range 8 {
		// 开启八个协程并行计算
		go isPrime(intChan, primeChan, exitChan)
	}

	go func() {
		for range 8 {
			<-exitChan
		}
		close(primeChan)
	}()

	for {
		res, ok := <-primeChan
		if !ok {
			break
		}
		fmt.Println("素数: ", res)
	}

	// label:
	//
	//	for {
	//		select {
	//		case res := <-primeChan:
	//			fmt.Println("素数: ", res)
	//		default:
	//			break label
	//		}
	//	} TODO 这段代码不知道为什么结果不对？
}

func initChan(num int) {
	for i := 1; i <= num; i++ {
		intChan <- i
	}
	close(intChan)
}

func isPrime(intChan chan int, primeChan chan int, exitChan chan bool) {
	var flag bool
	for {
		flag = true
		num, ok := <-intChan
		if !ok {
			break
		}
		// 判断是否质数
		for j := 2; j < num; j++ {
			if num%j == 0 {
				flag = false
				break
			}
		}
		if flag {
			primeChan <- num
		}
	}
	exitChan <- true
}
```