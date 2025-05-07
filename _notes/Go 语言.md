视频资料 https://www.bilibili.com/video/BV1NUBNYFEYv

参考资料
- [Go 语言圣经](https://gopl-zh.github.io/)
- [Go 语言之旅](https://tour.go-zh.org)

实战项目
- [[Go 高并发秒杀系统]]

# 开发环境

Go 官方下载地址：[The Go Programming Language](https://go.dev/dl/)。

# 高级

[[Go 并发编程]]

[[Go 面试题]]


# 基础

在Go语言中，`label`（标签）可以用于标记循环或语句块，以便在需要时通过 `break` 或 `continue` 语句跳转到指定的标签位置。`label` 的使用场景通常是在嵌套循环中，当需要从外层循环中退出时。

```go
package main

import (
	"fmt"
)

func main() {
outerLoop: // 定义标签
	for i := 0; i < 5; i++ {
		fmt.Printf("Outer loop: i = %d\n", i)
		for j := 0; j < 5; j++ {
			fmt.Printf("Inner loop: j = %d\n", j)
			if j == 3 {
				break outerLoop // 使用标签退出外层循环
			}
		}
	}
	fmt.Println("Exited outer loop")
}
```

**类型断言**（Type Assertion）是一种用于检查接口类型变量是否包含特定类型的值，并将其转换为该类型值的操作。
```go
value, ok := x.(T)
```

协程泄漏是指协程创建之后没有得到释放。主要原因有：
- 缺少接收器，导致发送阻塞
- 缺少发送器，导致接收阻塞
- 死锁。多个协程由于竞争资源导致死锁。
- 创建协程的没有回收。

从 Go 1.18 开始，**切片的扩容规则**进行了优化，以减少内存分配的频率和提高性能。新的扩容规则如下：
- **当前容量小于 1024**：
    - 如果所需容量大于当前容量的两倍，则新容量为当前容量加上所需容量。
    - 否则，新容量为当前容量的两倍。
- **当前容量大于或等于 1024**：
    - 新容量为当前容量加上当前容量的 1/4（即每次增加 25%）。
- **额外的优化**：
    - Go 1.18 引入了 **启发式规则**，以减少在某些特定场景下的过度分配。具体来说，当切片的容量接近 1024 时，扩容策略会更加保守，避免一次性分配过多内存。

在 Go 语言中，**指针解引用**是通过在指针变量前加上 `*` 符号来实现的，它用于访问指针所指向的值

**函数返回局部变量的指针是否安全？在 Go 里面返回局部变量的指针是安全的。因为 Go 会进行逃逸分析**，如果发现局部变量的作用域超过该函数则会**把指针分配到堆区**，避免内存泄漏。

垃圾回收机制是 Go 一大特(nan)色(dian)。Go1.3采用**标记清除法**， Go1.5采用**三色标记法**，Go1.8采用**三色标记法+混合写屏障**。

|版本|GC 算法|关键改进|缺陷/争议点|
|---|---|---|---|
|Go 1.3|标记-清除（Mark-Sweep）|实现简单|**STW（Stop-The-World）时间过长**|
|Go 1.5|三色标记法（Tri-color）|引入并发标记，大幅减少 STW 时间|仍依赖 STW 处理堆栈扫描|
|Go 1.8|三色标记法 + 混合写屏障|写屏障优化，基本消除 STW|小幅牺牲吞吐量换取低延迟|

**两个 nil 只有在类型相同时才相等**。

Go局部变量会进行**逃逸分析**。如果**变量离开作用域后没有被引用**，则**优先**分配到栈上，否则分配到堆上。

`init()` 函数是一个特殊的初始化函数，它在包被加载时自动执行。`init()` 函数通常用于执行包级别的初始化操作，例如设置全局变量、初始化配置、打开文件或连接数据库等。
- **自动调用**：`init()` 函数会在包被加载时自动执行，无需显式调用。
- **执行顺序**：
	- 如果一个包有多个 `init()` 函数（可能分布在不同的文件中），它们会按照源代码中出现的顺序依次执行。
    - 如果一个包依赖于其他包，那么被依赖的包的 `init()` 函数会先执行。
- **不能传递参数**：`init()` 函数不能接受参数，也不能返回值。
- **不能被调用**：`init()` 函数不能被直接调用，它只能在包加载时由 Go 运行时自动调用。

`struct{}` 本身不占任何空间，可以避免任何多余内存分配。

**枚举**
```go
const (
	B = 1 << (10 * iota)
	KiB 
	MiB
	GiB
	TiB
	PiB
	EiB
)
```

**结构体打印**
- `%v` 输出结构体各成员的值；
- `%+v` 输出结构体各成员的名称和值；
- `%#v` 输出结构体名称和结构体各成员的名称和值

**tag**
- json 序列化或反序列化时字段的名称；
- db: sql 模块中对应的数据库字段名；
- form: gin 框架中对应的前端的数据字段名；
- binding: 搭配 form 使用, 默认如果没查找到结构体中的某个字段则不报错值为空，binding 为 required 代表没找到返回错误给前端。
```go
// 通过反射获取一个结构体的 tag
import reflect
type Author struct {
	Name         int      `json:Name`
	Publications []string `json:Publication,omitempty`
}

func main() {
	t := reflect.TypeOf(Author{})
	for i := 0; i < t.NumField(); i++ {
		name := t.Field(i).Name
		s, _ := t.FieldByName(name)
		fmt.Println(name, s.Tag)
	}
}
```

defer 在 return 之后执行，但在函数退出之前，defer 可以修改返回值。

Go 的返回机制：执行 Return 语句后，Go 会创建一个临时变量保存返回值。**有名返回**值的函数，执行 return 语句时，并不会再创建临时变量保存，因此，defer 语句修改了 i，即对返回值产生了影响。

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

如果结构体的全部成员都是可以比较的，那么结构体也是可以比较的。
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

# 函数

函数的类型被称为函数的签名。如果两个函数形式参数列表和返回值列表中的变量类型一一对应，那么这两个函数被认为有相同的类型或签名。形参和返回值的变量名不影响函数签名，也不影响它们是否可以以省略参数类型的形式表示。

在函数调用时，Go语言没有默认参数值，也没有任何方法可以通过参数名指定形参。

在函数体中，函数的形参作为局部变量，被初始化为调用者提供的值。函数的形参和有名返回值作为函数最外层的局部变量，被存储在相同的词法块中。

实参通过值的方式传递，因此函数的形参是实参的拷贝。对形参进行修改不会影响实参。但是，如果实参包括引用类型，如指针，slice(切片)、map、function、channel等类型，实参可能会由于函数的间接引用被修改。

```go
package main

import "fmt"

// 定义一个函数类型
type StringFunc func(string) string

// 高阶函数，接受一个函数作为参数
func processString(s string, f StringFunc) string {
    return f(s)
}

// 具体的函数实现
func toUpperCase(s string) string {
    return strings.ToUpper(s)
}

func main() {
    // 将函数作为参数传递
    result: = processString("hello, world", toUpperCase)
    fmt.Println(result) // 输出: HELLO, WORLD
}
```

`defer` 后面跟一个函数调用，该函数调用会在当前函数执行完毕后执行。`defer` 的主要用途是确保某些代码在函数退出时执行，无论函数是正常退出还是因为错误退出。
- **参数求值时机**：`defer` 函数的参数在 `defer` 语句执行时就被求值，而不是在函数实际执行时。
- **函数返回值**：`defer` 函数可以修改函数的返回值。

一般而言，当panic异常发生时，程序会中断运行，并立即执行在该goroutine（可以先理解成线程，在第8章会详细介绍）中被延迟的函数（defer 机制）。随后，程序崩溃并输出日志信息。日志信息包括panic value和函数调用的堆栈跟踪信息。

`recover` 函数可以在 `defer` 函数中调用，用于捕获当前 Goroutine 中的 `panic`。如果 `recover` 成功捕获了 `panic`，程序将继续执行，而不是直接退出。
- **`recover` 只能在 `defer` 函数中使用**：`recover` 必须在 `defer` 函数中调用，否则无法捕获 `panic`。
- **`recover` 只能捕获当前 Goroutine 中的 `panic`**：`recover` 无法捕获其他 Goroutine 中的 `panic`。
- **`recover` 的返回值**：`recover` 的返回值是 `interface{}` 类型，可以用于获取 `panic` 的详细信息。

在Go语言中，我们并不会像其它语言那样用this或者self作为接收器；我们可以任意的选择接收器的名字。由于接收器的名字经常会被使用到，所以保持其在方法间传递时的一致性和简短性是不错的主意。