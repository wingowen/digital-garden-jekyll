---
title: Go 骞跺彂缂栫▼
date: 2025-09-01
lastmod: 2025-09-01
tags: [缂栫▼璇█, Go, 骞跺彂]
---

# 绠￠亾

```go
// 蹇呴』閫氳繃 make 澹版槑
// 婊′簡浼氭姤閿?// chan 鍙０鏄庡彧璇诲彧鍐?var chanIn chan<- int
var chanOut ->chan int

// 澶氶€氶亾閫夋嫨
select {
case <-channel1:
    // 褰?channel1 鏈夋暟鎹彲鎺ユ敹鏃舵墽琛岀殑浠ｇ爜
case channel2 <- value:
    // 褰撳彲浠ュ悜 channel2 鍙戦€佹暟鎹椂鎵ц鐨勪唬鐮?default:
    // 褰撴病鏈夐€氶亾鎿嶄綔鍙互绔嬪嵆鎵ц鏃舵墽琛岀殑浠ｇ爜
}
```

# 鍗忕▼涓庣閬?
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
        // 绛夊湪鍗忕▼鐨勯€€鍑轰俊鍙?    if <-exitChan {
        return
    }
    fmt.Println("=== 涓荤嚎绋嬮€€鍑?===")
}

func writeData(intChan chan int) {
    // 鏇挎崲宸插純鐢ㄧ殑 rand.Seed 璋冪敤锛屼娇鐢?rand.New 鍜?rand.NewSource 鍒涘缓鏈湴闅忔満鏁扮敓鎴愬櫒
    rand.New(rand.NewSource(time.Now().UnixNano()))
    for i: = 1;
    i < 50;
    i++{
        var tempInt int
        tempInt = rand.Intn(4) + 10
        fmt.Printf("绗?%v 娆″啓鍏ユ暟鎹?>>> writeData 鍐欏叆鏁版嵁 %v 
", i, tempInt)
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
        fmt.Printf("绗?%v 娆¤鍙栨暟鎹?>>> readData 璇诲彇鏁版嵁 %v 
", count, val)
    }
    exitChan < -true
    close(exitChan)
}
```

# 骞惰鎵捐川鏁?
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
		// 寮€鍚叓涓崗绋嬪苟琛岃绠?		go isPrime(intChan, primeChan, exitChan)
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
		fmt.Println("绱犳暟: ", res)
	}

	// label:
	//
	//	for {
	//		select {
	//		case res := <-primeChan:
	//			fmt.Println("绱犳暟: ", res)
	//		default:
	//			break label
	//		}
	//	} TODO 杩欐浠ｇ爜涓嶇煡閬撲负浠€涔堢粨鏋滀笉瀵癸紵
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
		// 鍒ゆ柇鏄惁璐ㄦ暟
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