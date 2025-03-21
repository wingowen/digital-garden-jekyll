参考资料
- [Go 语言圣经](https://gopl-zh.github.io/)
- [Go 语言之旅](https://tour.go-zh.org)

# 开发环境

Go 官方下载地址：[The Go Programming Language](https://go.dev/dl/)。





# 基础

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


