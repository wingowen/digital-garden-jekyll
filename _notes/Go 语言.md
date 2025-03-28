参考资料
- [Go 语言圣经](https://gopl-zh.github.io/)
- [Go 语言之旅](https://tour.go-zh.org)

实战项目
- [[Go 高并发秒杀系统]]

# 开发环境

Go 官方下载地址：[The Go Programming Language](https://go.dev/dl/)。

# 基础

Go 语言不需要在语句或者声明的末尾添加分号，除非一行上有多条语句。实际上，编译器会主动把特定符号后的换行符转换为分号，因此换行符添加的位置会影响 Go 代码的正确解析。

自增语句 `i++` 给 `i` 加 `1`；这和 `i+=1` 以及 `i=i+1` 都是等价的。对应的还有 `i--` 给 `i` 减 `1`。它们是语句，而不像 C 系的其它语言那样是表达式。所以 `j=i++` 非法，而且 `++` 和 `--` 都只能放在变量名后面，因此 `--i` 也非法。

Go 语言不允许使用无用的局部变量（local variables），因为这会导致编译错误。

**简短变量声明** `:=` 被广泛用于大部分的局部变量的声明和初始化。**var 形式**的声明语句往往是用于需要显式指定变量类型的地方，或者因为变量稍后会被重新赋值而初始值无关紧要的地方。

一个类型声明语句创建了一个新的类型名称，和现有类型具有相同的底层结构。新命名的类型提供了一个方法，用来分隔不同概念的类型，这样即使它们底层类型相同也是不兼容的。

对于每一个类型T，都有一个对应的类型转换操作T(x)，用于将x转为T类型（译注：如果T是指针类型，可能会需要用小括弧包装T，比如`(*int)(0)`）。只有当两个类型的底层基础类型相同时，才允许这种转型操作，或者是两者都是指向相同底层结构的指针类型，这些转换只改变类型而不会影响值本身

声明语句的作用域对应的是一个源代码的文本区域；它是一个编译时的属性。一个变量的生命周期是指程序运行时变量存在的有效时间段，在此时间区域内它可以被程序的其他部分引用；是一个运行时的概念。

包，每个 Go 程序都由包构成，程序从 main 包开始运行。
- 导入：支持分组导入，即用圆括号将导入的包分成一组。
- 导出：以导出名首字母大小写区分是否包外可见。
	- 首字母大写：包外可见；首字母小写：包外不可见。

函数
- 包含零个或多个参数。
- 当连续两个或多个函数的已命名形参类型相同时，除最后一个类型以外，其它都可以省略。
- 可以返回任意数量的返回值。
- 返回值可被命名，它们会被视作定义在函数顶部的变量。
	- 返回值的命名应当能反应其含义，它可以作为文档使用。
	- 裸语句，即没有参数的 `return` 语句，会直接返回已命名的返回值，应当仅用在短函数中，否则代码可读性较差。

```go
// 入参类型省略
func add(x, y int) int {
	return x + y
}

// 裸返回
func split(sum int) (x, y int) {
	x = sum * 4 / 9
	y = sum - x
	return
}
```

变量
- `var` 语句用于声明一系列变量。和函数的参数列表一样，类型在最后。
- `var` 语句可以出现在包或函数的层级。
- 初始化：变量声明可以包含初始值，每个变量对应一个。如果提供了初始值，则类型可以省略，变量会从初始值中推断出类型。
- 在函数中，短赋值语句 `:=` 可在隐式确定类型的 `var` 声明中使用。函数外的每个语句都**必须**以关键字开始（`var`、`func` 等），因此 `:=` 结构不能在函数外使用。
- 与导入组类似，变量声明也可以分组。
- 没有初始化的变量会被赋予对应类型的**零值**。
	- 数值类型为 `0`，
	- 布尔类型为 `false`，
	- 字符串为 `""`（空字符串）。

```go
// 基本类型
// bool
// string
// int  int8  int16  int32  int64
// uint uint8 uint16 uint32 uint64 uintptr
// byte // uint8 的别名
// rune // int32 的别名，表示一个 Unicode 码位
// float32 float64
// complex64 complex128
```

类型转换
- 表达式 `T(v)` 将值 `v` 转换为类型 `T`。
- Go 在不同类型的项之间赋值时需要显式转换。

类型推断
- 在声明一个变量而不指定其类型时（即使用不带类型的 `:=` 语法 `var =` 表达式语法），变量的类型会通过右值推断出来。

常量 `const`
- 数值常量是高精度值。

# 流程控制

只有一种循环体 `for`
- 初始化语句和后置语句是可选的。

```go
package main

import "fmt"

func main() {
	sum := 1
	for sum < 1000 { // 此时可去掉分号
		sum += sum
	}
	fmt.Println(sum)

	// for {} 无限循环
}
```

if 判断
- `if else` 在 `if` 的简短语句中声明的变量同样可以在对应的任何 `else` 块中使用。

```go
func sqrt(x float64) string {
	if x < 0 {
		return sqrt(-x) + "i"
	}
	return fmt.Sprint(math.Sqrt(x))
}
// 支持简短语句
func pow(x, n, lim float64) float64 {
	if v := math.Pow(x, n); v < lim {
		return v
	} else {
		fmt.Printf("%g >= %g\n", v, lim)
	}
	// can't use v here, though
	return lim
}
```

`switch` 语句是编写一连串 `if - else` 语句的简便方法，它运行第一个 `case` 值等于条件表达式的子句。
- 只会运行选定的 `case`，而非之后所有的 `case`，除非以 `fallthrough` 语句结束，否则分支会自动终止。
- `case` 无需为常量，且取值不限于整数。

```go
package main

import (
	"fmt"
	"runtime"
)

func main() {
	fmt.Print("Go 运行的系统环境：")
	switch os := runtime.GOOS; os {
	case "darwin":
		fmt.Println("macOS.")
	case "linux":
		fmt.Println("Linux.")
	default:
		// freebsd, openbsd,
		// plan9, windows...
		fmt.Printf("%s.\n", os)
	}
}
```

`defer` 语句会将函数推迟到外层函数返回之后执行。推迟调用的函数其参数会立即求值，但直到外层函数返回前该函数都不会被调用。

```go
package main

import "fmt"

func main() {
	defer fmt.Print("world ")
	fmt.Print("hello")
}

// hello world
```

# 指针

- 指针保存了值的内存地址，类型 `*T` 是指向 `T` 类型值的指针，其零值为 `nil`。
- `&` 操作符会生成一个指向其操作数的指针。
- `*` 操作符表示指针指向的底层值。

```go
package main

import "fmt"

func main() {
	i, j := 42, 2701

	p := &i         // 指向 i
	fmt.Println(*p) // 通过指针读取 i 的值
	*p = 21         // 通过指针设置 i 的值
	fmt.Println(i)  // 查看 i 的值

	p = &j         // 指向 j
	*p = *p / 37   // 通过指针对 j 进行除法运算
	fmt.Println(j) // 查看 j 的值
}
// 42 21 73
```

# 结构体

- 一个结构体（`struct`）就是一组字段（field）。
- 结构体字段可通过点号 `.` 来访问。
- 如果我们有一个指向结构体的指针 `p` 那么可以通过 `(*p).X` 来访问其字段 `X`。 不过这么写太啰嗦了，所以语言也允许我们使用隐式解引用，直接写 `p.X` 就可以。
- 使用 `FileName:` 语法可以仅列出部分字段（字段名的顺序无关）。
- 特殊的前缀 `&` 返回一个指向结构体的指针。

```go
package main

import "fmt"

type Vertex struct {
	X, Y int
}

var (
	v1 = Vertex{1, 2}  // 创建一个 Vertex 类型的结构体
	v2 = Vertex{X: 1}  // Y:0 被隐式地赋予零值
	v3 = Vertex{}      // X:0 Y:0
	p  = &Vertex{1, 2} // 创建一个 *Vertex 类型的结构体（指针）
)

func main() {
	fmt.Println(v1, p, v2, v3)
}

// {1 2} &{1 2} {1 0} {0 0}
```

# 数组

类型 `[n]T` 表示一个数组，它拥有 `n` 个类型为 `T` 的值。

```go
package main

import "fmt"

func main() {
	var a [2]string
	a[0] = "Hello"
	a[1] = "World"
	fmt.Println(a[0], a[1])
	fmt.Println(a)

	primes := [6]int{2, 3, 5, 7, 11, 13}
	fmt.Println(primes)
}
```

每个数组的大小都是固定的。而切片则为数组元素提供了动态大小的、灵活的视角。切片通过两个下标来界定，一个下界和一个上界，二者以冒号分隔，它会选出一个半闭半开区间，包括第一个元素，但排除最后一个元素。

```go
a[low : high]

// 这是一个数组字面量
[3]bool{true, true, false}
// 下面这样则会创建一个和上面相同的数组，然后再构建一个引用了它的切片
[]bool{true, true, false}
```

# 切片

切片就像数组的引用，切片并不存储任何数据，它只是描述了底层数组中的一段，更改切片的元素会修改其底层数组中对应的元素，和它共享底层数组的切片都会观测到这些修改。

可以利用切面的默认行为来忽略上下界，切片下界的默认值为 0，上界则是该切片的长度。

```go
var a [10]int
// 等价写法
a[0:10]
a[:10]
a[0:]
a[:]
```

切片操作：
- 切片操作不会修改底层数组，仅调整指针、长度和容量；
- 扩展切片时，长度不能超过当前容量；
- 截取子切片时，新容量为原容量减去起始索引。

`nil` 切片的长度和容量为 0 且没有底层数组。

`make` 函数会分配一个元素为零值的数组并返回一个引用了它的切片。

```go
a := make([]int, 5)  // len(a)=5

b := make([]int, 0, 5) // len(b)=0, cap(b)=5

b = b[:cap(b)] // len(b)=5, cap(b)=5
b = b[1:]      // len(b)=4, cap(b)=4
```

|特性|长度（Length）|容量（Capacity）|
|---|---|---|
|**含义**|当前元素个数|可扩展到的最大元素个数|
|**操作影响**|直接受切片操作影响（如 `s[:n]`）|受切片起始位置影响（如 `s[low:]`）|
|**扩展性**|不能超过容量|允许通过 `append` 扩展底层数组|

`for` 循环的 `range` 形式可遍历切片或映射。当使用 `for` 循环遍历切片时，每次迭代都会返回两个值。 第一个值为当前元素的下标，第二个值为该下标所对应元素的一份副本。

```go
package main

import "fmt"

var pow = []int{1, 2, 4, 8, 16, 32, 64, 128}

func main() {
	for i, v := range pow {
		fmt.Printf("2**%d = %d\n", i, v)
	}
}

// 忽略某一元素
func main() {
	pow := make([]int, 10)
	// 遍历下标
	for i := range pow {
		pow[i] = 1 << uint(i) // == 2**i
	}
	// 遍历元素副本
	for _, value := range pow {
		fmt.Printf("%d\n", value)
	}
}
```

# 映射

- `map` 映射将键映射到值。
- 映射的零值为 `nil` 。`nil` 映射既没有键，也不能添加键。
- `make` 函数会返回给定类型的映射，并将其初始化备用。

```go
package main

import "fmt"

type Vertex struct {
	Lat, Long float64
}

// 写法一
var m = map[string]Vertex{
	"Bell Labs": Vertex{
		40.68433, -74.39967,
	},
	"Google": Vertex{
		37.42202, -122.08408,
	},
}

// 写法二
var m = map[string]Vertex{
	"Bell Labs": {40.68433, -74.39967},
	"Google":    {37.42202, -122.08408},
}

func main() {
	fmt.Println(m)
}

// 统计一句话里单词出现的次数
package main

import (
	"strings"
)

func WordCount(s string) map[string]int {
	words := strings.Fields(s)    // 按空白分割字符串为单词切片
	counts := make(map[string]int) // 初始化映射

	// 遍历单词并统计
	for _, word := range words {
		counts[word]++
	}

	return counts
}
```

