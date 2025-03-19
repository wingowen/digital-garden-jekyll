参考资料
- [Go 语言圣经](https://gopl-zh.github.io/)
- [Go 语言之旅](https://tour.go-zh.org)
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

