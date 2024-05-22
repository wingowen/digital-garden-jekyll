[Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/)

数据科学有三个领域交叉而成：

- 需要**统计学家**来对数据集（正在变得越来越巨大）进行建模和统计。
- 需要**计算机科学家**来使用算法有效地存储、处理和展现这些数据
- 需要**领域专家**（通常在传统意义上我们就是这么做的）来在相关垂直领域整理出正确的问题和相应的解决方法

Python 在数据科学中的蓬勃发展主要来源于其大量活跃的第三方包：

- IPython 和 Jupyter: 这两个包提供了使用 Python 的数据科学家最喜爱的计算环境
- NumPy: 这个包提供了 `ndarray` 对象用于有效的存储和处理数组中的非稀疏数据
- Pandas: 这个包提供了 `DataFrame` 对象用于有效的存储和处理标签化的基于列结构的数据
- Matplotlib: 这个包提供了最灵活的数据图表展示功能
- Scikit-Learn: 这个包提供了很多重要的机器学习算法以及有效和简洁的 Python 实现

# IPython

**help and document**

- Get Help with `help()` or `?`
- Accessing Source Code with `??`
- Tab-completion of object contents

```python
# Beyond tab completion: wildcard matching
In [10]: str.*find*?
str.find
str.rfind
```

**IPython Magic Commands**

- Pasting Code Blocks: `%paste` and `%cpaste`
- Running External Code: `%run`
- Timing Code Execution: `%timeit`
- Help on Magic Functions: `?`, `%magic`, and `%lsmagic`

**Input and Output History**

- Access Previous Inputs and Outputs in Your Current Session with `In[num] / Out[num]`
- Underscore Shortcuts and Previous Outputs `print(_)`
- Print the First Four Inputs with `%history`

**IPython and Shell Commands**

- anything appearing after `!` on a line will be executed not by the Python kernel, but by the system command-line
- Passing Values to and from the Shell

```python
# from shell
In [6]: directory = !pwd

In [7]: print(directory)
['/Users/jakevdp/notebooks/tmp/myproject']

In [8]: type(directory)
IPython.utils.text.SList

# to shell
In [9]: message = "hello from Python"

In [10]: !echo {message}
hello from Python
```

> 你无法使用 `!cd` 来改变你的工作目录，这是因为在 notebook 里面 shell 是在一个子 shell 空间中执行的。如果你需要改变工作目录的话，你可以使用 `%cd` 魔术命令。

**Errors and Debugging**

- `%xmode Plain`：更简化的错误输出
- `%pdb on`：遇到异常自动进入 Debug 模式
- 如果你有一个 Python 脚本文件，然后希望在 IPython 中交互式运行，并且打开调试器的话，你可以使用 `%run -d` 魔术指令来执行这个脚本，然后你还能在调试模式提示符下使用 `next` 命令来单步执行脚本中的代码

```shell
[8]: %debug
---
> <ipython-input-1-586ccabd0db3>(2)func1()
      1 def func1(a, b):
----> 2 return a / b
      3 
      4 def func2(x):
      5a = x

ipdb> up
> <ipython-input-1-586ccabd0db3>(7)func2()
      3 
      4 def func2(x):
      5a = x
      6b = x - 1
----> 7 return func1(a, b)

ipdb> print(x)
1
ipdb> up
> <ipython-input-6-7cb498ea7ed1>(1)<module>()
----> 1 func2(1)

ipdb> down
> <ipython-input-1-586ccabd0db3>(7)func2()
      3 
      4 def func2(x):
      5a = x
      6b = x - 1
----> 7 return func1(a, b)

ipdb> quit
```

**Partial list of debugging commands**

| Command         |  Description                                                |
|-----------------|-------------------------------------------------------------|
| ``list``        | Show the current location in the file                       |
| ``h(elp)``      | Show a list of commands, or find help on a specific command |
| ``q(uit)``      | Quit the debugger and the program                           |
| ``c(ontinue)``  | Quit the debugger, continue in the program                  |
| ``n(ext)``      | Go to the next step of the program                          |
| ``<enter>``     | Repeat the previous command                                 |
| ``p(rint)``     | Print variables                                             |
| ``s(tep)``      | Step into a subroutine                                      |
| ``r(eturn)``    | Return out of a subroutine                                  |

For more information, use the ``help`` command in the debugger, or take a look at ``ipdb``'s [online documentation](https://github.com/gotcha/ipdb).

**Profiling and Timing Code**

- `%time`: Time the execution of a single statement
- `%timeit`: Time repeated execution of a single statement for more accuracy
- `%%time%%`/`%%timeit%%`: Allows timing of multiline scripts
- `%prun`: Run code with the profiler
- `%lprun`: Run code with the line-by-line profiler
- `%memit`: Measure the memory use of a single statement
- `%mprun`: Run code with the line-by-line memory profiler

> 值得注意的是，有些情况下，重复多次执行反而会得出一个错误的测量数据。例如，我们有一个列表，希望对它进行排序，重复执行的结果会明显的误导我们。因为对一个已经排好序的列表执行排序是非常快的，因此在第一次执行完成之后，后面重复进行排序的测量数据都是错误的。

```python
pip install line_profiler
%load_ext line_profiler

pip install memory_profiler
%load_ext memory_profiler
```

# Numpy

Numpy and Pandas：高效的装载，存储和处理 Python 中内存数据的技巧。

Numpy is the short for **Numerical Python**.

## Understanding Data Types in Python

标准的 Python 实现是使用 C 语言编写的。这意味着每个 Python 当中的对象都是一个伪装良好的 C 结构体，结构体内不仅仅包括它的值，还有其他的信息。

```C
// python int define
struct _longobject {
    long ob_refcnt; // 引用计数器，Python 用这个字段来进行内存分配和垃圾收集
    PyTypeObject *ob_type; // 变量类型的编码内容
    size_t ob_size; // 表示下面的数据字段的长度
    long ob_digit[1]; // 真正的整数值存储在这个字段
};
```

C 的整数就是简单一个内存位置，这个位置上的固定长度的字节可以表示一个整数；Python 中的一个整数是一个指向内存位置的指针，该内存位置包括 Python 需要表示一个整数的所有信息，其中最后固定长度的字节才真正存储这个整数。

**A Python List Is More Than Just a List**

Python 是动态类型，我们甚至可以创建不同类型元素的列表。要让列表能够容纳不同的类型，每个列表中的元素都必须带有自己的类型信息、引用计数器和其他的信息，一句话，里面的每个元素都是一个完整的 Python 的对象。如果在所有的元素都是同一种类型的情况下，这里面绝大部分的信息都是冗余的：如果我们能将数据存储在一个固定类型的数组中，显然会更加高效。

下图展示了动态类型的列表和固定类型的数组（NumPy实现的）的区别：

![[02-IMAGES/ed3c4eda17191e3bbcd446bab0f5bf24_MD5.png]]

从底层实现上看，数组仅仅包含一个指针指向一块连续的内存空间。而 Python 列表，含有一个指针指向一块连续的指针内存空间，里面的每个指针再指向内存中每个独立的 Python 对象，如我们前面看到的整数。列表的优势在于灵活：因为每个元素都是完整的 Python 的类型对象结构，包含了数据和类型信息，因此列表可以存储任何类型的数据。 NumPy 使用的固定类型的数组缺少这种灵活性，但是对于存储和操作数据会高效许多。

**Fixed-Type Arrays in Python**

Python 內建的 `array` 模块（从 Python 3.3 开始提供）可以用来创建同一类型的数组，更常用的是 `np.array` 对象，由 NumPy 包提供。

`array` 提供了数组的高效存储；`np.array`  还提供了数组的高效运算。

NumPy 数组只能含有同一种类型的数据。如果类型不一样，NumPy 会尝试向上扩展类型。

```python
In[10]: np.array([3.14, 4, 2, 3])
array([3.14, 4.  , 2.  , 3.  ])

In[11]: np.array([1, 2, 3, 4], dtype='float32')
array([1., 2., 3., 4.], dtype=float32)
```

最后，不同于 Python 的列表，NumPy 的数组可以明确表示为多维。

```python
# 生成器的列表，列表解析中有三个 range 生成器
# 分别是 range(2, 5), range(4, 7) 和 range(6, 9)
np.array([range(i, i + 3) for i in [2, 4, 6]])
```

**Creating Arrays from Scratch**

```python
[14]: np.zeros(10, dtype=int)
array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

[15]: np.ones((3, 5), dtype=float)
array([[1., 1., 1., 1., 1.],
       [1., 1., 1., 1., 1.],
       [1., 1., 1., 1., 1.]])

[16]: np.full((3, 5), 3.14)
array([[3.14, 3.14, 3.14, 3.14, 3.14],
       [3.14, 3.14, 3.14, 3.14, 3.14],
       [3.14, 3.14, 3.14, 3.14, 3.14]])

[17]: np.arange(0, 20, 2)
array([ 0,  2,  4,  6,  8, 10, 12, 14, 16, 18])

[18]: np.linspace(0, 1, 5)
array([0.  , 0.25, 0.5 , 0.75, 1.  ])

[19]: np.random.random((3, 3))
array([[0.28957547, 0.80872794, 0.36451325],
       [0.30178461, 0.13998063, 0.21693246],
       [0.81413802, 0.26299406, 0.53082583]])

# 均值 0，标准差 1
[20]: np.random.normal(0, 1, (3, 3))
array([[ 1.51772646,  0.39614948, -0.10634696],
       [ 0.25671348,  0.00732722,  0.37783601],
       [ 0.68446945,  0.15926039, -0.70744073]])

[21]: np.random.randint(0, 10, (3, 3))
array([[2, 3, 4],
       [5, 7, 8],
       [0, 5, 0]])

[22]: np.eye(3)
array([[ 1.,  0.,  0.],
       [ 0.,  1.,  0.],
       [ 0.,  0.,  1.]])

# 创建为初始化数组，元素保持为原有的内存空间值
[23]: np.empty(3)
array([5.74020278e+180, 4.00193173e-322, 4.66594353e-310])
```

**Numpy Standard Data Type**

| Data type	    | Description |
|---------------|-------------|
| ``bool_``     | 布尔 True 或 False 一个字节 |
| ``int_``      | 默认整数类型 (类似 C 的 ``long``; 通常可以是 ``int64`` 或 ``int32``)| 
| ``intc``      | 类似 C 的 ``int`` (通常可以是 ``int32`` 或 ``int64`` )| 
| ``intp``      | 用于索引值的整数(类似 C 的 ``ssize_t``; 通常可以是 ``int32`` 或 ``int64``)| 
| ``int8``      | 整数，1 字节 (-128 ～ 127)| 
| ``int16``     | 整数，2 字节 (-32768 ～ 32767)|
| ``int32``     | 整数，4 字节 (-2147483648 ～ 2147483647)|
| ``int64``     | 整数，8 字节 (-9223372036854775808 ～ 9223372036854775807)| 
| ``uint8``     | 字节 (0 ～ 255)| 
| ``uint16``    | 无符号整数 (0 ～ 65535)| 
| ``uint32``    | 无符号整数 (0 ～ 4294967295)| 
| ``uint64``    | 无符号整数 (0 ～ 18446744073709551615)| 
| ``float_``    | `float64` 的简写 | 
| ``float16``   | 半精度浮点数: 1 比特符号位, 5 比特指数位, 10 比特尾数位 | 
| ``float32``   | 单精度浮点数: 1 比特符号位, 8 比特指数位, 23 比特尾数位| 
| ``float64``   | 双精度浮点数: 1 比特符号位, 11 比特指数位, 52 比特尾数位| 
| ``complex_``  | `complex128` 的简写 | 
| ``complex64`` | 复数, 由 2 个单精度浮点数组成 | 
| ``complex128``| 复数, 由 2 个双精度浮点数组成 |

## The Basic of Numpy Arrays

- _数组的属性_: 获得数组的大小、形状、内存占用以及数据类型
- _数组索引_: 获得和设置单个数组元素的值
- _数组切片_: 获得和设置数组中的子数组
- _数组变形_: 改变数组的形状
- _组合和切分数组_: 将多个数组组合成一个，或者将一个数组切分成多个

**Numpy Array Attributes**

```python
import numpy as np
np.random.seed(0)  # 设定随机种子，保证实验的可重现

x3 = np.random.randint(10, size=(3, 4, 5))  # 三维数组

# 输出三维数组的维度、形状和总长度
print("x3 ndim: ", x3.ndim)
print("x3 shape:", x3.shape)
print("x3 size: ", x3.size)
# 输出数组类型
print("dtype:", x3.dtype)
# 输出每个数组元素的长度和数组的总字节长度
print("itemsize:", x3.itemsize, "bytes")
print("nbytes:", x3.nbytes, "bytes")
```

**Array Slicing: Accessing Subarrays**

```python
# One-dimensional subarrays
x[start:stop:step]
# 反序
s = 'hello world'
# 下面就会输出'dlrow olleh'
print(s[::-1])

# Multi-dimensional subarrays
x2[:2, :3]  # 行的维度取前两个，列的维度取前三个，形状变为(2, 3)
```

> 数组的切片返回的实际上是子数组的==视图==而不是它们的副本。这是 NumPy 数组的切片和 Python 列表的切片的主要区别，列表的切片返回的是副本。

```python
# 创建副本
x2_sub_copy = x2[:2, :2].copy()
```

**Reshaping of Arrays**

```python
x = np.array([1, 2, 3])
# 使用 reshape 变为 (1, 3)
x.reshape((1, 3))
# 使用 newaxis 增加行维度，形状也是 (1, 3)
x[np.newaxis, :]
# 使用 reshape 变为 (3, 1)
x.reshape((3, 1))
# 使用 newaxis 增加列维度，形状也是 (3, 1)
x[:, np.newaxis]
```

**Concatenation of arrays**

```python
np.concatenate([x, y, z])
# 行连接
np.concatenate([grid, grid], axis=0)
# 列连接
np.concatenate([grid, grid], axis=1)
```

连接不同纬度的数组：

```python
# 沿着垂直方向进行堆叠
np.vstack([x, grid])
# 沿着水平方向进行堆叠
np.hstack([grid, y])
```

**Splitting of arrays**

```python
x1, x2, x3 = np.split(x, [3, 5]) # 在序号 3 和序号 5 处进行切分，返回三个数组
upper, lower = np.vsplit(grid, [2]) # 沿垂直方向切分，切分点行序号为 2
left, right = np.hsplit(grid, [2]) # 沿水平方向切分数组，切分点列序号为 2
```

`np.dsplit` will split arrays along the third axis.

## Computation on NumPy Arrays: Universal Functions

Python 的循环很慢。每次循环时 CPython 必须执行的类型检查和函数匹配。每次计算倒数时，Python 首先需要检查对象的类型，然后寻找一个最合适的函数对这种类型进行计算。

对 NumPy 的数组进行计算相较其他普通的实现方式而言是非常快的。快的原因关键在于使用了==向量化==的操作，因为它们都是通过 NumPy 的通用函数 `ufuncs` 实现的。

对于许多操作，NumPy 都为这种静态类型提供了编译好的函数。被称为向量化的操作。向量化操作可以简单应用在数组上，实际上会应用在每一个元素上。==实现原理就是将循环的部分放进 NumPy 编译后的那个层次，从而提高性能==。

> 任何情况下，如果你看到 Python 的数组循环操作，都可以替换成为向量化形式。

下表列出 NumPy 实现的运算符号及对应的 ufunc 函数：

| 运算符	    | 对应的ufunc函数    | 说明                           |
|---------------|---------------------|---------------------------------------|
|``+``          |``np.add``           |加法 (例如 ``1 + 1 = 2``)         |
|``-``          |``np.subtract``      |减法 (例如 ``3 - 2 = 1``)      |
|``-``          |``np.negative``      |一元取负 (例如 ``-2``)          |
|``*``          |``np.multiply``      |乘法 (例如 ``2 * 3 = 6``)   |
|``/``          |``np.divide``        |除法 (例如 ``3 / 2 = 1.5``)       |
|``//``         |``np.floor_divide``  |整除 (例如 ``3 // 2 = 1``)  |
|``**``         |``np.power``         |求幂 (例如 ``2 ** 3 = 8``)  |
|``%``          |``np.mod``           |模除 (例如 ``9 % 4 = 1``)|

**Absolute value**

```python
np.absolute(x)
np.abs(x)

# 复数的矢量长度
x = np.array([3 - 4j, 4 - 3j, 2 + 0j, 0 + 1j])
np.abs(x)
```

**Trigonometric functions**

```python
theta = np.linspace(0, np.pi, 3)
print("theta      = ", theta)
print("sin(theta) = ", np.sin(theta)) # 正弦
print("cos(theta) = ", np.cos(theta)) # 余弦
print("tan(theta) = ", np.tan(theta)) # 正切
x = [-1, 0, 1]
print("x         = ", x)
print("arcsin(x) = ", np.arcsin(x)) # 反正弦
print("arccos(x) = ", np.arccos(x)) # 反余弦
print("arctan(x) = ", np.arctan(x)) # 反正切
```

**Exponents and logarithms**

```python
x = [1, 2, 3]
print("x     =", x)
print("e^x   =", np.exp(x))
print("2^x   =", np.exp2(x))
print("3^x   =", np.power(3, x))
x = [1, 2, 4, 10]
print("x        =", x)
print("ln(x)    =", np.log(x))
print("log2(x)  =", np.log2(x))
print("log10(x) =", np.log10(x))
# 当输入值很小时，可以保持精度的指数和对数函数
x = [0, 0.001, 0.01, 0.1]
print("exp(x) - 1 =", np.expm1(x))
print("log(1 + x) =", np.log1p(x))
```

**Specialized**

```python
from scipy import special
```

**Specifying Output**

```python
x = np.arange(5)
y = np.empty(5)
np.multiply(x, 10, out=y) # 指定结果存储在y数组中
print(y)
```

**Aggregates**

```python
x = np.arange(1, 6)
# 返回所有元素的和
np.add.reduce(x)
# 返回所有元素的乘积
np.multiply.reduce(x)
# 聚合的中间步骤
np.add.accumulate(x)
np.multiply.accumulate(x)
```

**Outer Products**

```python
x = np.arange(1, 6)
np.multiply.outer(x, x)
```

## Aggregations: Min, Max, and Everything In Between

> NumPy 的函数是编译执行的，因此它的性能会远远超越 Python 的內建函数。

```python
big_array = np.random.rand(1000000)
%timeit sum(big_array)
%timeit np.sum(big_array)
# 写法一
np.min(big_array), np.max(big_array)
# 写法二
print(big_array.min(), big_array.max(), big_array.sum())

M = np.random.random((3, 4))
# 沿着行的方向计算每列的最小值
# 这里的 axis 不太直观，指沿着这个方向进行压缩
M.min(axis=0)
```

| 函数名称      |   NaN 安全版本  | 说明                                   |
|-------------------|---------------------|-----------------------------------------------|
| ``np.sum``        | ``np.nansum``       | 计算总和                       |
| ``np.prod``       | ``np.nanprod``      | 计算乘积                   |
| ``np.mean``       | ``np.nanmean``      | 计算平均值                      |
| ``np.std``        | ``np.nanstd``       | 计算标准差                    |
| ``np.var``        | ``np.nanvar``       | 计算方差                              |
| ``np.min``        | ``np.nanmin``       | 计算最小值                            |
| ``np.max``        | ``np.nanmax``       | 计算最大值                            |
| ``np.argmin``     | ``np.nanargmin``    | 寻找最小值的序号                   |
| ``np.argmax``     | ``np.nanargmax``    | 寻找最大值的序号                   |
| ``np.median``     | ``np.nanmedian``    | 计算中位值                    |
| ``np.percentile`` | ``np.nanpercentile``| 计算百分比分布的对应值     |
| ``np.any``        | N/A                 | 是否含有 True 值        |
| ``np.all``        | N/A                 | 是否全为 True 值        |

## Example: What is the Average Height of US Presidents?

```python
import pandas as pd
data = pd.read_csv('data/president_heights.csv')
heights = np.array(data['height(cm)'])

print("Mean height:       ", heights.mean()) # 身高平均值
print("Standard deviation:", heights.std()) # 标准差
print("Minimum height:    ", heights.min()) # 最小值
print("Maximum height:    ", heights.max()) # 最大值

print("25th percentile:   ", np.percentile(heights, 25)) # 25% 分位值
print("Median:            ", np.median(heights)) # 50% 分位值 - 中位值
print("75th percentile:   ", np.percentile(heights, 75)) # 75% 分位值

%matplotlib inline
import matplotlib.pyplot as plt
import seaborn; seaborn.set()  # 设置图表的风格为seaborn

plt.hist(heights)
plt.title('Height Distribution of US Presidents')
plt.xlabel('height (cm)')
plt.ylabel('number');
```

## Computation on Arrays: Broadcasting

对于相同尺寸的数组来说，二元运算是按每个元素进行运算的。广播机制允许这样的二元运算能够在不同尺寸和形状的数组之间进行。

![[02-IMAGES/Python Data Science Handbook.png]]

**Rules of Broadcasting**

- 如果两个数组有着不同的维度，维度较小的那个数组会沿着最前（或最左）的维度进行扩增，扩增的维度尺寸为 1，这时两个数组具有相同的维度。
- 如果两个数组形状在任何某个维度上存在不相同，那么两个数组中形状为 1 的维度都会广播到另一个数组对应唯独的尺寸，最终双方都具有相同的形状。
- 如果两个数组在同一个维度上具有不为 1 的不同长度，那么将产生一个错误。

## Comparisons, Masks, and Boolean Logic

```python
print("无雨的天数             ：", np.sum(inches == 0))
print("有雨的天数             ：", np.sum(inches != 0))
print("雨量大于0.5英寸的天数   ：", np.sum(inches > 0.5))
print("雨量小于0.2英寸的有雨天数：", np.sum((inches > 0) & (inches < 0.2)))
```

**Boolean Arrays as Masks**

```python
x[x < 5]
```

> `and` 和 `or` 对整个对象进行单个布尔操作，而 `&` 和 `|` 会对一个对象进行多个布尔操作（比如其中每个二进制位）。

## Fancy Indexing

简单索引（例如 `arr[0]`），切片（例如 `arr[:5]`）和布尔遮盖（例如 `arr[arr > 0]`）。

高级索引的概念：传递一个数组作为索引值参数，使得用户能一次性的获取或修改多个数组元素值。

```python
ind = [3, 7, 4]
x[ind]
```

**Combined Indexing**

```python
X[1:, [2, 0, 1]]
```

**Binning Data**

```python
np.random.seed(42)
x = np.random.randn(100) # 获得一个一维100个标准正态分布值

# 得到一个自定义的数据分组，区间-5至5平均取20个点，每个区间为一个数据分组
bins = np.linspace(-5, 5, 20)
counts = np.zeros_like(bins) # counts是x数值落入区间的计数

# 使用searchsorted，得到x每个元素在bins中落入的区间序号
i = np.searchsorted(bins, x)

# 使用at和add，对x元素在每个区间的元素个数进行计算
np.add.at(counts, i, 1)
```

## Sorting Arrays

因为 NumPy 的 `np.sort` 函数有着更加优秀的性能，而且也更满足我们要求。默认情况下 `np.sort` 使用的是 $\mathcal{O}[N\log N]$ 快速排序排序算法，归并排序和堆排序也是可选的。对于大多数的应用场景来说，默认的快速排序都能满足要求。

相关的函数是 `argsort`，它将返回排好序后元素原始的序号序列。

```python
# 沿着每列对数据进行排序
np.sort(X, axis=0)
# 沿着每行对数据进行排序
np.sort(X, axis=1)
```

**Partial Sorts: Partitioning**

```python
# 最小的两个数在左边
np.partition(X, 2, axis=1)
np.argpartition
```

**k-Nearest Neighbors**

K 近邻。

```python
import numpy as np

rand = np.random.RandomState(42)
X = rand.rand(10, 2)

%matplotlib inline
import matplotlib.pyplot as plt
import seaborn; seaborn.set() # 图表风格，seaborn
plt.scatter(X[:, 0], X[:, 1], s=100);

# 计算每两个点之间的坐标距离
differences = X[:, np.newaxis, :] - X[np.newaxis, :, :]
differences.shape

# 计算距离的平方
sq_differences = differences ** 2
sq_differences.shape

# 按照最后一个维度求和
dist_sq = sq_differences.sum(-1)
dist_sq.shape

# 返回对角线上的元素
dist_sq.diagonal()

# 获取全排序序号
nearest = np.argsort(dist_sq, axis=1)
print(nearest)

# 获取最近的两个点
K = 2
nearest_partition = np.argpartition(dist_sq, K + 1, axis=1)

plt.scatter(X[:, 0], X[:, 1], s=100)

# 为每个点和它最近的两个点之间连上线
K = 2

for i in range(X.shape[0]):
    for j in nearest_partition[i, :K+1]:
        # 从X[i]连线到X[j]
        # 使用一些zip的魔术方法画线
        plt.plot(*zip(X[j], X[i]), color='black')

```

## Structured Data: NumPy's Structured Arrays

```python
# 使用复合的dtype参数来创建结构化数组
data = np.zeros(4, dtype={'names':('name', 'age', 'weight'),
                          'formats':('U10', 'i4', 'f8')})
```

# Pandas

## Introducing Pandas Objects

最基本的三个概念：`Series`、`DataFrame` 和 `Index`。

Pandas 的 `Series` 是一个一维的带索引序号的数组。可以通过列表或数组进行创建。

NumPy 数组的整数索引是隐式提供的，而 Pandas 的 `Series` 的索引是显式定义的。显示索引不需要一定是个整数，可以用任何需要的数据类型来定义索引。

可以将 `DataFrame` 想象成一系列的 `Series` 对象堆叠在一起，所谓的堆叠实际上指的是这些 `Series` 拥有相同的索引值序列。

`DataFrame` 是二维的，因此它额外含有一个 `columns` 属性，同样也是一个 `Index` 对象。

有一个需要注意的细节，Numpy 的索引是指定的是行 `X[0]`，而 Pandas 的索引指定的是列 `X[0]`。

**Constructing DataFrame objects**

```python
pd.DataFrame(np.random.rand(3, 2),
             columns=['foo', 'bar'],
             index=['a', 'b', 'c'])

```

Index as immutable array. NumPy 数组和 `Index` 对象的最大区别是你无法改变 `Index` 的元素值，它们是不可变的。

Pandas 对象被设计成能够满足跨数据集进行操作，例如连接多个数据集查找或操作数据，这很大程度依赖于集合运算。`Index` 对象遵循  Python 內建的 `set` 数据结构的运算法则，因此并集、交集、差集和其他的集合操作也可以按照熟悉的方式进行。

```python
indA = pd.Index([1, 3, 5, 7, 9])
indB = pd.Index([2, 3, 5, 7, 11])

indA & indB  # 交集
indA | indB  # 并集
indA ^ indB  # 互斥差集
```

## Data Indexing and Selection

使用指定的显式索引进行切片（例如`data['a':'c']`），结束位置的索引值是_包含_在切片里面的，然而，使用隐式索引进行切片（例如`data[0:2]`），结束位置的索引值是_不包含_在切片里面的。

**Indexers: loc and iloc**

可能会造成的混乱：如果 `Series` 对象有显式的整数索引，那么 `data[1]` 的操作会使用显式索引，但是 `data[1:3]` 的操作会使用隐式索引。

`loc` 属性允许用户永远使用显式索引来进行定位和切片；`iloc` 属性允许用户永远使用隐式索引来定位和切片。

> 当存在两个索引时，index 就是隐式索引，name 是显式索引。

**Data Selection in DataFrame**

避免使用属性表达式给列赋值。`DataFrame` 有 `pop()` 方法，因此 `data.pop` 将会指向该方法而不是 `"pop"` 列。

`DataFrame` 的切片、遮盖操作是针对行的。

## Operating on Data in Pandas

```python
import pandas as pd
import numpy as np
rng = np.random.RandomState(42)

A = pd.DataFrame(rng.randint(0, 20, (2, 2)),
                 columns=list('AB'))
A_mean = A.stack().mean()
# 0  A     6
#    B    19
# 1  A    14
#    B    10
# dtype: int64

B = pd.DataFrame(rng.randint(0, 10, (3, 3)),
                 columns=list('BAC'))

# A 少的值用 A_mean 与 B 相应位置的值相加
A.add(B, fill_value=A_mean)
```

| Python运算符 | Pandas方法                      |
|-----------------|---------------------------------------|
| ``+``           | ``add()``                             |
| ``-``           | ``sub()``, ``subtract()``             |
| ``*``           | ``mul()``, ``multiply()``             |
| ``/``           | ``truediv()``, ``div()``, ``divide()``|
| ``//``          | ``floordiv()``                        |
| ``%``           | ``mod()``                             |
| ``**``          | ``pow()``                             |

## Handling Missing Data

用来在数据表或 DataFrame 中指定和标示缺失数据的方案有很多种。通常来说，会有两种主要的策略：使用一个全局的遮盖来标示缺失数据，或者选择使用哨兵值来标示缺失的元素。

以上解决方案都是有所取舍的：独立的遮盖数组需要更多的内存空间用于存储布尔数组；普通的哨兵值会缩小正确数据的取值范围，而且需要额外的（通常是未优化的）CPU 和 GPU 运算；通用的特殊值如 NaN 又无法应用于所有的数据类型上。

Pandas 选择了最后一种方案，即通用哨兵值标示缺失值。更进一步说就是，使用两个已经存在的 Python 空值：`NaN` 代表特殊的浮点数值和 Python 的 `None` 对象。

不论运算是哪种类型，`NaN` 参与的算术运算的结果都会是另一个 `NaN`。

```python
# 忽略 NaN 缺失值
np.nansum(vals2), np.nanmin(vals2), np.nanmax(vals2)
```

`NaN` 是一个特殊的浮点数值；对于整数、字符串或者其他类型来说都没有对应的值。

Pandas 将 `None` 和 `NaN` 看成是可以互相转换的缺失值或空值。

- `isnull()`：生成一个布尔遮盖数组指示缺失值的位置
- `notnull()`：`isnull()`相反方法
- `dropna()`：返回一个过滤掉缺失值、空值的数据集
- `fillna()`：返回一个数据集的副本，里面的缺失值、空值使用另外的值来替代

## Hierarchical Indexing

层级索引。

```python
index = [('California', 2000), ('California', 2010),
         ('New York', 2000), ('New York', 2010),
         ('Texas', 2000), ('Texas', 2010)]
populations = [33871648, 37253956,
               18976457, 19378102,
               20851820, 25145561]
pop = pd.Series(populations, index=index)

index = pd.MultiIndex.from_tuples(index)

pop = pop.reindex(index)
# California  2000    33871648
#             2010    37253956
# New York    2000    18976457
#             2010    19378102
# Texas       2000    20851820
#             2010    25145561
# dtype: int64

pop[:, 2010]
# California    37253956
# New York      19378102
# Texas         25145561
# dtype: int64

# 将多重索引的 Series 转换成普通索引的 DataFrame
pop_df = pop.unstack()

# 构建多重索引
df = pd.DataFrame(np.random.rand(4, 2),
                  index=[['a', 'a', 'b', 'b'], [1, 2, 1, 2]],
                  columns=['data1', 'data2'])

# 用两个单一索引的笛卡尔乘积来构造多重索引
pd.MultiIndex.from_product([['a', 'b'], [1, 2]])

# 层次名称
pop.index.names = ['state', 'year']

# 行和列的多重索引
# 行和列的多重索引
index = pd.MultiIndex.from_product([[2013, 2014], [1, 2]],
                                   names=['year', 'visit'])
columns = pd.MultiIndex.from_product([['Bob', 'Guido', 'Sue'], ['HR', 'Temp']],
                                     names=['subject', 'type'])

# 模拟一些真实数据
data = np.round(np.random.randn(4, 6), 1)
data[:, ::2] *= 10
data += 37

# 创建DataFrame
health_data = pd.DataFrame(data, index=index, columns=columns)
health_data
```

## Combining Datasets: Concat and Append

`np.contenate` 和 `pd.concat` 的一个重要区别是 Pandas 的连接会保留行索引，甚至在结果中包含重复索引的情况下

```python
def make_df(cols, ind):
    """Quickly make a DataFrame"""
    data = {c: [str(c) + str(i) for i in ind]
            for c in cols}
    return pd.DataFrame(data, ind)

# example DataFrame
make_df('ABC', range(3))

class display(object):
    """多个对象的HTML格式展示"""
    template = """<div style="float: left; padding: 10px;">
    <p style='font-family:"Courier New", Courier, monospace'>{0}</p>{1}
    </div>"""
    def __init__(self, *args):
        self.args = args
        
    def _repr_html_(self):
        return '\n'.join(self.template.format(a, eval(a)._repr_html_())
                         for a in self.args)
    
    def __repr__(self):
        return '\n\n'.join(a + '\n' + repr(eval(a))
                           for a in self.args)

# 拼接
df1 = make_df('AB', [1, 2])
df2 = make_df('AB', [3, 4])
display('df1', 'df2', 'pd.concat([df1, df2])')

# 检查重复行索引
try:
    pd.concat([x, y], verify_integrity=True)
except ValueError as e:
    print("ValueError:", e)

# 忽略行索引并在结果中重新创建一个整数的索引值
display('x', 'y', 'pd.concat([x, y], ignore_index=True)')

# 增加多重索引标签
display('x', 'y', "pd.concat([x, y], keys=['x', 'y'])")

# 指定连接方式
display('x', 'y', "pd.concat([x, y], keys=['x', 'y'])")

# 保留指定列
display('df5', 'df6',
        "pd.concat([df5, df6]).reindex(df5.columns, axis=1)")
```

Pandas 中的 `append()` 方法不会修改原始参与运算的数据集，它会为合并后的结果创建一个新的对象。它也不是一个很高性能的方法，因为涉及到新索引和数据缓冲区的创建。因此如果你有需要连接多个数据集时，应该避免多次使用 `append` 方法，而是将所有需要进行连接的数据集形成一个列表，并传递给 `concat` 函数来进行连接操作。

## Combining Datasets: Merge and Join

```python
import pandas as pd
import numpy as np

class display(object):
    """Display HTML representation of multiple objects"""
    template = """<div style="float: left; padding: 10px;">
    <p style='font-family:"Courier New", Courier, monospace'>{0}</p>{1}
    </div>"""
    def __init__(self, *args):
        self.args = args
        
    def _repr_html_(self):
        return '\n'.join(self.template.format(a, eval(a)._repr_html_())
                         for a in self.args)
    
    def __repr__(self):
        return '\n\n'.join(a + '\n' + repr(eval(a))
                           for a in self.args)
```

**Relational Algebra 关系代数**

`pd.merge()` 实现的是我们称为关系代数的一个子集，关系代数是一系列操作关系数据的规则的集合，它构成了大部分数据库的数学基础。

`DataFrame` 实现了 `join()` 方法，默认按照行索引合并数据集。

**Categories of joins 联表分类**

```python
display('df1', 'df2', "pd.merge(df1, df2, on='employee')")

# 分别指定左右合并的列名
display('df1', 'df3', 'pd.merge(df1, df3, left_on="employee", right_on="name")')

# 列名与索引混用
display('df1a', 'df3', "pd.merge(df1a, df3, left_index=True, right_on='name')")

# 指定合并的集合算术运算
pd.merge(df6, df7, how='inner')

# 为冲突列名分别添加后缀，默认为 _x,_y
display('df8', 'df9', 'pd.merge(df8, df9, on="name", suffixes=["_L", "_R"])')
```

## Aggregation and Grouping

| 聚合函数              | 描述                     |
|--------------------------|---------------------------------|
| ``count()``              | 元素个数           |
| ``first()``, ``last()``  | 第一个和最后一个元素             |
| ``mean()``, ``median()`` | 平均值和中位数                 |
| ``min()``, ``max()``     | 最小和最大值             |
| ``std()``, ``var()``     | 标准差和方差 |
| ``mad()``                | 平均绝对离差         |
| ``prod()``               | 所有元素的乘积            |
| ``sum()``                | 所有元素的总和                |

**GroupBy: Split, Apply, Combine**

![[02-IMAGES/c75e3a1bea2f517b3d5cf3d5148bf02d_MD5.png]]

- 拆分 split 步骤表示按照指定键上的值对 `DataFrame` 进行拆分和分组的功能。
- 应用 apply 步骤表示在每个独立的分组上调用某些函数进行计算，通常是聚合、转换或过滤。
- 组合 combine 步骤将上述计算的结果重新合并在一起输出。

`GroupBy` 对象支持在分组上直接进行迭代，每次迭代返回分组的一个 `Series` 或 `DataFrame` 对象。

**Aggregate, filter, transform, apply**

`GroupBy` 对象有 `aggregate()`、`filter()`、`transfrom` 和 `apply()` 方法，它们能在组合分组数据之前有效地实现大量有用的操作。

```python
# Aggregate
rng = np.random.RandomState(0)
df = pd.DataFrame({'key': ['A', 'B', 'C', 'A', 'B', 'C'],
                   'data1': range(6),
                   'data2': rng.randint(0, 10, 6)},
                   columns = ['key', 'data1', 'data2'])

df.groupby('key').aggregate(['min', np.median, max])

df.groupby('key').aggregate({'data1': 'min',
                             'data2': 'max'})
# Filtering
def filter_func(x):
    return x['data2'].std() > 4

# `filter()` 类似于 SQL 中的 HAVING
display('df', "df.groupby('key').std()", "df.groupby('key').filter(filter_func)")

# Transformation
# 转换可以返回完整数据转换后并重新合并的数据集

df.groupby('key').transform(lambda x: x - x.mean())

# apply

def norm_by_data2(x):
    # x is a DataFrame of group values
    x['data1'] /= x['data2'].sum()
    return x

display('df', "df.groupby('key').apply(norm_by_data2)")
```

**Specifying the split key**

A list, array, series, or index providing the grouping keys.

```python
# 具有相同标记的行将会被聚合
L = [0, 1, 0, 1, 2, 0]
display('df', 'df.groupby(L).sum()')

# 以某列值为聚合键
display('df', "df.groupby(df['key']).sum()")

df2 = df.set_index('key')
mapping = {'A': 'vowel', 'B': 'consonant', 'C': 'consonant'}
display('df2', 'df2.groupby(mapping).sum()')

# 传递任何 Python 函数将输入的索引值变成输出的分组键
display('df2', 'df2.groupby(str.lower).mean()')

df2.groupby([str.lower, mapping]).mean()
```

Grouping Example

```python
decade = 10 * (planets['year'] // 10)
decade = decade.astype(str) + 's'
decade.name = 'decade'
planets.groupby(['method', decade])['number'].sum().unstack().fillna(0)
```

## Pivot Tables

数据透视表将列状的数据作为输入，然后将它们组合到一个二维的表格中，通过这种组合结果提供数据在多个维度上的统计数据。

```python
titanic.groupby(['sex', 'class'])['survived'].aggregate('mean').unstack()
# 上下两种实现方式结果一致
titanic.pivot_table('survived', index='sex', columns='class')

# Multi-level pivot tables
fare = pd.qcut(titanic['fare'], 2)
titanic.pivot_table('survived', ['sex', age], [fare, 'class'])

# 聚合函数
titanic.pivot_table(index='sex', columns='class',
                    aggfunc={'survived':sum, 'fare':'mean'})

# 总计
titanic.pivot_table('survived', index='sex', columns='class', margins=True)
```

Example: Birthdate Data

```python
# !curl -O https://raw.githubusercontent.com/jakevdp/data-CDCbirths/master/births.csv

births['decade'] = 10 * (births['year'] // 10)
%matplotlib inline
import matplotlib.pyplot as plt
sns.set()  # 设置使用seaborn风格图表
births.pivot_table('births', index='year', columns='gender', aggfunc='sum').plot()
plt.ylabel('total births per year');
```

## Vectorized String Operations

几乎所有 Python 內建的字符串方法都有 Pandas 的向量化版本。

|             |                  |                  |                  |
|-------------|------------------|------------------|------------------|
|``len()``    | ``lower()``      | ``translate()``  | ``islower()``    | 
|``ljust()``  | ``upper()``      | ``startswith()`` | ``isupper()``    | 
|``rjust()``  | ``find()``       | ``endswith()``   | ``isnumeric()``  | 
|``center()`` | ``rfind()``      | ``isalnum()``    | ``isdecimal()``  | 
|``zfill()``  | ``index()``      | ``isalpha()``    | ``split()``      | 
|``strip()``  | ``rindex()``     | ``isdigit()``    | ``rsplit()``     | 
|``rstrip()`` | ``capitalize()`` | ``isspace()``    | ``partition()``  | 
|``lstrip()`` |  ``swapcase()``  |  ``istitle()``   | ``rpartition()`` |

**Methods using regular expressions**

| 方法 | 描述 |
|--------|-------------|
| ``match()`` | 在每个元素上调用 ``re.match()`` 方法，返回布尔类型 Series |
| ``extract()`` | 在每个元素上调用 ``re.match()`` 方法，返回匹配到模式的正则分组的 Series |
| ``findall()`` | 在每个元素上调用 ``re.findall()`` 方法 |
| ``replace()`` | 将匹配模式的字符串部分替换成其他字符串值 |
| ``contains()`` | 在每个元素上调用 ``re.search()``，返回布尔类型 Series |
| ``count()`` | 计算匹配到模式的次数 |
| ``split()``   | 等同于 ``str.split()``，但是能接受正则表达式参数 |
| ``rsplit()`` | 等同于 ``str.rsplit()``， 但是能接受正则表达式参数 |

**Miscellaneous methods**

| 方法 | 描述 |
|--------|-------------|
| ``get()`` | 对每个元素使用索引值获取字符中的字符 |
| ``slice()`` | 对每个元素进行字符串切片 |
| ``slice_replace()`` | 将每个元素的字符串切片替换成另一个字符串值 |
| ``cat()``      | 将所有字符串元素连接成一个字符串 |
| ``repeat()`` | 对每个字符串元素进行重复操作 |
| ``normalize()`` | 返回字符串的 unicode 标准化结果 |
| ``pad()`` | 字符串对齐 |
| ``wrap()`` | 字符串换行 |
| ``join()`` | 字符串中字符的连接 |
| ``get_dummies()`` | 将字符串按照分隔符分割后形成一个二维的 dummy DataFrame |

Indicator variables

```python
full_monte = pd.DataFrame({'name': monte,
                           'info': ['B|C|D', 'B|D', 'A|C',
                                    'B|D', 'B|C', 'B|C|D']})

full_monte['info'].str.get_dummies('|')
# 一种类似 one hot 编码的操作
```

 Example

```python
import re

spice_df = pd.DataFrame(dict((spice, recipes.ingredients.str.contains(spice, re.IGNORECASE))
                             for spice in spice_list))
                             
selection = spice_df.query('parsley & paprika & tarragon')
```

## Working with Time Series

- Native Python dates and times: `datetime` and `dateutil`.
- Typed arrays of times: NumPy's `datetime64`.

- 对于==时间戳==，Pandas 提供了 `Timestamp` 类型。正如上面所述，它可以作为 Python 原生`datetime`类型的替代，但是它是构建在 `numpy.datetime64` 数据类型之上的。对应的索引结构是 `DatetimeIndex`。
- 对于==时间周期==，Pandas 提供了 `Period` 类型。它是在 `numpy.datetime64` 的基础上编码了一个固定周期间隔的时间。对应的索引结构是 `PeriodIndex`。
- 对于==时间差或持续时间==，Pandas 提供了 `Timedelta` 类型。构建于 `numpy.timedelta64` 之上，是 Python 原生 `datetime.timedelta` 类型的高性能替代。对应的索引结构是 `TimedeltaIndex`。

Pandas 提供了三个函数来创建规则的日期时间序列， `pd.date_range()` 来创建时间戳的序列，`pd.period_range()` 来创建周期的序列，`pd.timedelta_range()` 来创建时间差的序列。

**Frequencies and Offsets**

| 码   | 说明         | 码   | 说明          |
|--------|---------------------|--------|----------------------|
| ``D``  | 自然日        | ``B``  | 工作日        |
| ``W``  | 周              |        |                      |
| ``M``  | 自然日月末           | ``BM`` | 工作日月末   |
| ``Q``  | 自然日季末         | ``BQ`` | 工作日季末 |
| ``A``  | 自然日年末            | ``BA`` | 工作日年末    |
| ``H``  | 自然小时               | ``BH`` | 工作小时       |
| ``T``  | 分钟             |        |                      |
| ``S``  | 秒             |        |                      |
| ``L``  | 毫秒         |        |                      |
| ``U``  | 微秒        |        |                      |
| ``N``  | 纳秒         |        |                      |

**Resampling, Shifting, and Windowing**

`resample()` 主要进行数据聚合操作，而 `asfreq()` 方法主要进行数据选择操作。

```python
from pandas_datareader import data

goog = data.DataReader('GOOG', start='2004', end='2016',
                       data_source='yahoo')
goog.head()

goog = goog['Close']

%matplotlib inline
import matplotlib.pyplot as plt
import seaborn; seaborn.set()

# 对数据进行每个工作日年度进行重新取样
goog.plot(alpha=0.5, style='-')
# `resample` 返回了这一个年度的平均值，而 `asfreq` 返回了年末的收市值
goog.resample('BA').mean().plot(style=':')
goog.asfreq('BA').plot(style='--');
plt.legend(['input', 'resample', 'asfreq'],
           loc='upper left');

fig, ax = plt.subplots(2, sharex=True)
data = goog.iloc[:10]

data.asfreq('D').plot(ax=ax[0], marker='o')
# back-fill
data.asfreq('D', method='bfill').plot(ax=ax[1], style='-o')
# forward-fill
data.asfreq('D', method='ffill').plot(ax=ax[1], style='--o')
ax[1].legend(["back-fill", "forward-fill"]);
```


**Time Shifts**

`shift()` 移动的是数据，而 `tshift()` 移动的是时间索引。

时间移动的常见应用场景是计算同比时间段的差值。

```python
# 获取一年前对应日期的金融数据
ROI = 100 * (goog.tshift(-365) / goog - 1)
ROI.plot()
plt.ylabel('% Return on Investment');
```

**Rolling Windows**

```python
# 对谷歌股票价格在 365 个记录中居中求平均值和标准差的结果
rolling = goog.rolling(365, center=True) # 对365个交易日的收市价进行滚动窗口居中

data = pd.DataFrame({'input': goog,
                     'one-year rolling_mean': rolling.mean(), # 平均值Series
                     'one-year rolling_std': rolling.std()}) # 标准差Series
ax = data.plot(style=['-', '--', ':'])
ax.lines[0].set_alpha(0.3)
```

##  High-Performance Pandas: eval() and query()

直接进行 C 底层的运算而不需要创建临时的数组。

```python
# 三者等价，df.eval 效率高且简便
result1 = (df['A'] + df['B']) / (df['C'] - 1)
result2 = pd.eval("(df.A + df.B) / (df.C - 1)")
np.allclose(result1, result2)
result3 = df.eval('(A + B) / (C - 1)')
np.allclose(result1, result3)

# 支持使用 @ 标记本地变量
Cmean = df['C'].mean()
result1 = df[(df.A < Cmean) & (df.B < Cmean)]
result2 = df.query('A < @Cmean and B < @Cmean')
np.allclose(result1, result2)
```

# Machine Learning

机器学习基本上就是关于构建数学模型来帮助我们理解数据。当我们为这些模型提供了可调整的参数时，“学习”能让我们从观察到的数据中调整这些参数。也就是说，这个过程可以被认为我们从数据中“学习”。一旦这些模型已经适应了观察到的数据之后，它们就可以用来预测和理解新的数据。

**有监督学习**

建立数据和标记的联系模型，然后这个模型就可以应用在新的数据上进行标记。它可以进一步分为==分类和回归任务==；在分类中，标记是离散的分组，而在回归中，标记是连续的量。

**无监督学习**

从没有标记的数据中建立模型，主要分为聚类和降纬；聚类算法能识别数据中的分组，而降维算法寻找数据更简洁的表达形式。

## Introducing Scikit-Learn

Scikit-Learn 提供了一套干净、统一和流式的 API。

使用 Scikit-Learn 评估器 API：
1. 通过载入合适的 Scikit-Learn 评估器类选择一个模型的类型。
2. 通过使用需要的值实例化模型对象来选择模型的超参数。
3. 按照上面的方式将数据分为特征矩阵和目标向量。
4. 通过调用模型实例的 `fit()` 方法将你的模型按照数据进行拟合。
5. 将拟合后的模型应用在新的数据上：
    - 对于有监督学习，通常我们使用 `predict()` 方法来预测未知数据的标签。
    - 对于无监督学习，通常我们使用 `transform()` 方法来转换或推断数据的属性。

**Data Representation in Scikit-Learn**

```python
import seaborn as sns
iris = sns.load_dataset('iris')
iris.head()

%matplotlib inline
import seaborn as sns; sns.set()
sns.pairplot(iris, hue='species', height=1.5);

# Features Matrix
X_iris = iris.drop('species', axis=1)
X_iris.shape
# Target Array
y_iris = iris['species']
y_iris.shape
```

**Supervised learning example: Simple linear regression**

```python
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.RandomState(42)
x = 10 * rng.rand(50)
y = 2 * x - 1 + rng.randn(50)
plt.scatter(x, y);

# Choose a class of model
from sklearn.linear_model import LinearRegression

# Choose model hyperparameters
# 拟合截距值
model = LinearRegression(fit_intercept=True)

# Arrange data into a features matrix and target vector
X = x[:, np.newaxis]

# Fit the model to your data
model.fit(X, y)
# 斜率
model.coef_
# 截距
model.intercept_

xfit = np.linspace(-1, 11)
Xfit = xfit[:, np.newaxis]

# Predict labels for unknown data
yfit = model.predict(Xfit)

plt.scatter(x, y)
plt.plot(xfit, yfit);
```

**Supervised learning example: Iris classification**

```python
from sklearn.model_selection import train_test_split
Xtrain, Xtest, ytrain, ytest =train_test_split(X_iris, y_iris,random_state=1)

# 选择模型类别
from sklearn.naive_bayes import GaussianNB 
model = GaussianNB() # 实例化模型
model.fit(Xtrain, ytrain) # 拟合数据
y_model = model.predict(Xtest) # 预测新数据

from sklearn.metrics import accuracy_score
# 查看有多少比例的标签我们是预测正确
accuracy_score(ytest, y_model)
```

**Unsupervised learning example: Iris dimensionality**

```python
from sklearn.decomposition import PCA
# 主成分分析
model = PCA(n_components=2)
model.fit(X_iris)
X_2D = model.transform(X_iris)

iris['PCA1'] = X_2D[:, 0]
iris['PCA2'] = X_2D[:, 1]

# 从图像可以看出在二维数据表示中，花的种类也很容易区分开
sns.lmplot("PCA1", "PCA2", hue='species', data=iris, fit_reg=False);
```

**Unsupervised learning: Iris clustering**

```python
from sklearn.mixture import GaussianMixture
model = GaussianMixture(n_components=3, covariance_type='full')
model.fit(X_iris)
y_gmm = model.predict(X_iris)

iris['cluster'] = y_gmm
sns.lmplot("PCA1", "PCA2", data=iris, hue='species',
           col='cluster', fit_reg=False);
```

**Application: Exploring Hand-written Digits**

```python
from sklearn.datasets import load_digits

digits = load_digits()
digits.images.shape

# 流形学习算法 Isomap
from sklearn.manifold import Isomap
iso = Isomap(n_components=2)
iso.fit(digits.data)
data_projected = iso.transform(digits.data)
data_projected.shape

plt.scatter(data_projected[:, 0], data_projected[:, 1], c=digits.target,
            edgecolor='none', alpha=0.5,
            cmap=plt.cm.get_cmap('Spectral', 10))
plt.colorbar(label='digit label', ticks=range(10))
plt.clim(-0.5, 9.5);

Xtrain, Xtest, ytrain, ytest = train_test_split(X, y, random_state=0)

from sklearn.naive_bayes import GaussianNB
model = GaussianNB()
model.fit(Xtrain, ytrain)
y_model = model.predict(Xtest)

from sklearn.metrics import accuracy_score
accuracy_score(ytest, y_model)

from sklearn.metrics import confusion_matrix

# 输出混淆矩阵
mat = confusion_matrix(ytest, y_model)
sns.heatmap(mat, square=True, annot=True, cbar=False)
plt.xlabel('predicted value')
plt.ylabel('true value');
```

## Hyperparameters and Model Validation

**Thinking about Model Validation**

```python
# 保留部分数据用于验证模型
X1, X2, y1, y2 = train_test_split(X, y, random_state=0, train_size=0.5)

# 交叉验证 cross
# 将数据分成 5 组，每次使用其中一组来评估模型，其余的 4/5 用来训练模型
from sklearn.model_selection import cross_val_score
cross_val_score(model, X, y, cv=5)

# 使用除了一个数据点外的其他所有数据进行训练
from sklearn.model_selection import LeaveOneOut
scores = cross_val_score(model, X, y, cv=LeaveOneOut())
scores.mean()
```

**The Bias-variance trade-off**

偏差方差权衡：“最佳模型”问题基本上是关于寻找==偏差和方差的最佳均衡点==。

模型欠拟合，它没有提供足够的模型灵活性来反映出数据的所有特征；用另一种说法就是这个模型有着高的偏差。

模型过拟合，高方差。

```python
# 验证曲线
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline
# 使用管道将线性回归与多项式预处理器结合
def PolynomialRegression(degree=2, **kwargs):
    return make_pipeline(PolynomialFeatures(degree),
                         LinearRegression(**kwargs))

import numpy as np

def make_data(N, err=1.0, rseed=1):
    # randomly sample the data
    rng = np.random.RandomState(rseed)
    X = rng.rand(N, 1) ** 2
    y = 10 - 1. / (X.ravel() + 0.1)
    if err > 0:
        y += err * rng.randn(N)
    return X, y

X, y = make_data(40)

# 可视化数据，包含着不同阶的多项式匹配结果
%matplotlib inline
import matplotlib.pyplot as plt
import seaborn; seaborn.set()  # 用Seaborn可视化

X_test = np.linspace(-0.1, 1.1, 500)[:, None]

plt.scatter(X.ravel(), y, color='black')
axis = plt.axis()
for degree in [1, 3, 5]:
    y_test = PolynomialRegression(degree).fit(X, y).predict(X_test)
    plt.plot(X_test.ravel(), y_test, label='degree={0}'.format(degree))
plt.xlim(-0.1, 1.0)
plt.ylim(-2, 12)
plt.legend(loc='best');

# 给定模型、数据、参数名称和一个范围，这个函数能够自动计算范围内所有的训练分数和验证分数
from sklearn.model_selection import validation_curve
degree = np.arange(0, 21)
train_score, val_score = validation_curve(PolynomialRegression(), X, y, 'polynomialfeatures__degree', degree, cv=7)

# 观察图像，三阶的时候偏差和方差最优
plt.plot(degree, np.median(train_score, 1), color='blue', label='training score')
plt.plot(degree, np.median(val_score, 1), color='red', label='validation score')
plt.legend(loc='best')
plt.ylim(0, 1)
plt.xlabel('degree')
plt.ylabel('score');

plt.scatter(X.ravel(), y)
lim = plt.axis()
y_test = PolynomialRegression(3).fit(X, y).predict(X_test)
plt.plot(X_test.ravel(), y_test);
plt.axis(lim);

# 五倍样本
X2, y2 = make_data(200)
plt.scatter(X2.ravel(), y2);

degree = np.arange(21)
train_score2, val_score2 = validation_curve(PolynomialRegression(), X2, y2,  'polynomialfeatures__degree', degree, cv=7)

plt.plot(degree, np.median(train_score2, 1), color='blue', label='training score')
plt.plot(degree, np.median(val_score2, 1), color='red', label='validation score')
plt.plot(degree, np.median(train_score, 1), color='blue', alpha=0.3, linestyle='dashed')
plt.plot(degree, np.median(val_score, 1), color='red', alpha=0.3, linestyle='dashed')
plt.legend(loc='lower center')
plt.ylim(0, 1)
plt.xlabel('degree')
plt.ylabel('score');
```

大的数据集能够支持更复杂的模型。

绘制一幅训练 / 验证分数随着训练集规模变化的图像被成为==学习曲线==。

学习曲线的一个著名特征就是当训练样本量增加时，两根曲线会收敛。这意味着，一旦你已经有了足够的样本量使得某种模型已经收敛的话，==增加更多的训练数据不会提供任何帮助==。在这种情况下提升模型性能的唯一方法就是使用另一个（通常更复杂）的模型。

**Learning Curves in Scikit-Learn**

```python
from sklearn.model_selection import learning_curve

fig, ax = plt.subplots(1, 2, figsize=(16, 6))
fig.subplots_adjust(left=0.0625, right=0.95, wspace=0.1)

for i, degree in enumerate([2, 9]):
    N, train_lc, val_lc = learning_curve(PolynomialRegression(degree),
X, y, cv=7, train_sizes=np.linspace(0.3, 1, 25))

    ax[i].plot(N, np.mean(train_lc, 1), color='blue', label='training score')
    ax[i].plot(N, np.mean(val_lc, 1), color='red', label='validation score')
    ax[i].hlines(np.mean([train_lc[-1], val_lc[-1]]), N[0], N[-1],
                 color='gray', linestyle='dashed')

    ax[i].set_ylim(0, 1)
    ax[i].set_xlim(N[0], N[-1])
    ax[i].set_xlabel('training size')
    ax[i].set_ylabel('score')
    ax[i].set_title('degree = {0}'.format(degree), size=14)
    ax[i].legend(loc='best')
```

**Validation in Practice: Grid Search**

在实践中，模型通常有多于一个开关进行调节，因此前面关于验证曲线和学习曲线的二维线条就会变成多维平面。在这些情况下，要将它可视化出来是很困难的，并且我们更希望简单的找到特定模型能最大化验证分数。

使用网格搜索找到最优多项式模型。

> 截距表示当所有特征都为零时的预测值。通过惩罚项来强制截距为零，这有助于减少模型的复杂度和过拟合的风险。
> 归一化的目的是改善不同特征之间的可比性，确保模型不会因为特征的不同量级而受到影响。归一化通常在模型训练之前进行，有助于提高算法的收敛速度和性能。

```python
from sklearn.model_selection import GridSearchCV

param_grid = {'polynomialfeatures__degree': np.arange(21), 'linearregression__fit_intercept': [True, False], 'linearregression__normalize': [True, False]}

grid = GridSearchCV(PolynomialRegression(), param_grid, cv=7)

grid.fit(X, y);

# 获得最佳参数
grid.best_params_

model = grid.best_estimator_

plt.scatter(X.ravel(), y)
lim = plt.axis()
y_test = model.fit(X, y).predict(X_test)
plt.plot(X_test.ravel(), y_test);
plt.axis(lim);
```

## Feature Engineering

**Categorical Features**

使用直接编码是一种不太合适的处理，包中的模型基本上假设数值特征表示的都是算术量。因此这样的映射会暗示字典值之间存在大小关系或者存在某种算术关系，这些其实是不存在的。

```python
from sklearn.feature_extraction import DictVectorizer
# Dense Matrix
vec = DictVectorizer(sparse=False, dtype=int)
vec.fit_transform(data)
# Spare Matrix
vec = DictVectorizer(sparse=True, dtype=int)
vec.fit_transform(data)
```

one-hot encoding 存在增大数据集大小的问题，可以将其转化为稀疏矩阵更为高效。

```python
# 稀疏矩阵
rows = [0, 1, 2]
cols = [1, 2, 2]
data = [5, 7, 9]
```

**Text Features**

```python
sample = ['problem of evil',
          'evil queen',
          'horizon problem']

from sklearn.feature_extraction.text import CountVectorizer

vec = CountVectorizer()
X = vec.fit_transform(sample)

import pandas as pd
pd.DataFrame(X.toarray(), columns=vec.get_feature_names())

# TF–IDF
from sklearn.feature_extraction.text import TfidfVectorizer
vec = TfidfVectorizer()
X = vec.fit_transform(sample)
pd.DataFrame(X.toarray(), columns=vec.get_feature_names())
```

**Derived Features**

转换数据，通过增加额外的特征列来增加模型的灵活性。

```python
from sklearn.preprocessing import PolynomialFeatures
poly = PolynomialFeatures(degree=3, include_bias=False)
X2 = poly.fit_transform(X)
print(X2)

model = LinearRegression().fit(X2, y)
yfit = model.predict(X2)
plt.scatter(x, y)
plt.plot(x, yfit);
```

这种方法属于一组强大的被称为核方法的行动步骤的一部分。

**Imputation of Missing Data**

```python
from sklearn.impute import SimpleImputer
imp = SimpleImputer(strategy='mean')
X2 = imp.fit_transform(X)
```

**Feature Pipelines**

将多个步骤串联在一起。

```python
from sklearn.pipeline import make_pipeline

model = make_pipeline(SimpleImputer(strategy='mean'),
                      PolynomialFeatures(degree=2),
                      LinearRegression())
model.fit(X, y)  # X with missing values, from above
print(y)
print(model.predict(X))
```

## In Depth: Naive Bayes Classification

朴素贝叶斯分类器经常被作为初始化的基线分类标准。

朴素贝叶斯模型是一组非常快和简单的分类算法，它们经常用来对高维度数据集进行分类处理。因为它们非常快和有一些可调的参数，它们最终成为了分类问题很好用的临时==基线方法==。

朴素贝叶斯分类的核心思想是使用贝叶斯定理来计算给定观察到的特征数据 X 条件下，样本属于某一类别 Y 的概率，即 P(Y|X)。

==贝叶斯公式: P(Y|X) = P(X|Y) * (Y) / P(X)==

- P(Y|X) 是后验概率，即已知特征 X 情况下类别 Y 的概率
- P(X|Y) 是似然概率，即已知类别 Y 条件下特征 X 出现的概率
- P(Y) 是先验概率，即类别 Y 本身的概率
- P(X) 是证据概率，通常在分类过程中不需要直接计算，因为对于所有类别而言它是相同的分母

> P(Y|X) 称为条件概率，即在 X 成立的情况下，Y 成立的概率；易得 P(XY) = P(X)P(Y|X) = P(Y)P(X|Y) 推出贝叶斯公式。

- **伯努利朴素贝叶斯** 侧重于每个特征（在文本分类中指单个词）是否出现（0或1，即二元特征），不考虑特征出现的次数。
- **多项式朴素贝叶斯** 则考虑特征出现的次数，适合处理词频信息，例如文本中每个词的频数统计。
- **高斯朴素贝叶斯** 主要用于处理连续数值型数据，假设这些数值特征遵循高斯（正态）分布。

**Gaussian Naive Bayes**

高斯分布是一种对称的钟形曲线分布，其形状由两个参数决定：均值（mean）和标准差（standard deviation）。均值决定了分布的中心位置，而标准差决定了分布的宽度，即数据的离散程度。

协方差是衡量两个变量之间线性关系强度和方向的统计量。如果数据在两个维度之间没有协方差，这意味着这两个维度是相互独立的，不会相互影响。在这种情况下，每个维度的数据可以单独分析，而不需要考虑它们之间的关系。

```python
%matplotlib inline
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns; sns.set()

from sklearn.datasets import make_blobs
X, y = make_blobs(100, 2, centers=2, random_state=2, cluster_std=1.5)
plt.scatter(X[:, 0], X[:, 1], c=y, s=50, cmap='RdBu');

from sklearn.naive_bayes import GaussianNB
model = GaussianNB()
model.fit(X, y);

rng = np.random.RandomState(0)
Xnew = [-6, -14] + [14, 18] * rng.rand(2000, 2)
ynew = model.predict(Xnew)

plt.scatter(X[:, 0], X[:, 1], c=y, s=50, cmap='RdBu')
lim = plt.axis()
plt.scatter(Xnew[:, 0], Xnew[:, 1], c=ynew, s=20, cmap='RdBu', alpha=0.1)
plt.axis(lim);

prob = model.predict_proba(Xnew)
yprob[-8:].round(2)
```

**Example: Classifying Text**

```python
from sklearn.datasets import fetch_20newsgroups

data = fetch_20newsgroups()
data.target_names

categories = ['talk.religion.misc', 'soc.religion.christian', 'sci.space', 'comp.graphics']
train = fetch_20newsgroups(subset='train', categories=categories)
test = fetch_20newsgroups(subset='test', categories=categories)

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# TF-IDF Term Frequency-Inverse Document Frequency
# 将字符串内容转换为数字的向量
model = make_pipeline(TfidfVectorizer(), MultinomialNB())

model.fit(train.data, train.target)
labels = model.predict(test.data)

from sklearn.metrics import confusion_matrix
mat = confusion_matrix(test.target, labels)
sns.heatmap(mat.T, square=True, annot=True, fmt='d', cbar=False, xticklabels=train.target_names, yticklabels=train.target_names)
plt.xlabel('true label')
plt.ylabel('predicted label');
```

## In Depth: Linear Regression

```python
%matplotlib inline
import matplotlib.pyplot as plt
import seaborn as sns; sns.set()
import numpy as np

rng = np.random.RandomState(1)
x = 10 * rng.rand(50)
y = 2 * x - 5 + rng.randn(50)
plt.scatter(x, y);

from sklearn.linear_model import LinearRegression
model = LinearRegression(fit_intercept=True)

model.fit(x[:, np.newaxis], y)

xfit = np.linspace(0, 10, 1000)
yfit = model.predict(xfit[:, np.newaxis])

plt.scatter(x, y)
plt.plot(xfit, yfit)

print("Model slope:    ", model.coef_[0])
print("Model intercept:", model.intercept_)
```

**Polynomial basis functions**

```python
from sklearn.preprocessing import PolynomialFeatures
x = np.array([2, 3, 4])
poly = PolynomialFeatures(3, include_bias=False)
poly.fit_transform(x[:, None])

from sklearn.pipeline import make_pipeline
poly_model = make_pipeline(PolynomialFeatures(7), LinearRegression())

rng = np.random.RandomState(1)
x = 10 * rng.rand(50)
y = np.sin(x) + 0.1 * rng.randn(50)

poly_model.fit(x[:, np.newaxis], y)
yfit = poly_model.predict(xfit[:, np.newaxis])

plt.scatter(x, y)
plt.plot(xfit, yfit)
```

**Gaussian basis functions**

通过高斯函数叠加而不是多项式叠加来拟合模型。Scikit-Learn 中没有內建这些高斯基本函数，但我们可以写一个自定义的转换器来构造它们。

```python
from sklearn.base import BaseEstimator, TransformerMixin

# 将数据投射到高维空间
class GaussianFeatures(BaseEstimator, TransformerMixin):
    """对一维数据进行均匀分布高斯转换"""
    
    def __init__(self, N, width_factor=2.0):
        self.N = N
        self.width_factor = width_factor
    
    @staticmethod
    def _gauss_basis(x, y, width, axis=None):
        arg = (x - y) / width
        return np.exp(-0.5 * np.sum(arg ** 2, axis))
        
    def fit(self, X, y=None):
        # 沿着数据范围创建均匀分布的N个中心点
        self.centers_ = np.linspace(X.min(), X.max(), self.N)
        self.width_ = self.width_factor * (self.centers_[1] - self.centers_[0])
        return self
        
    def transform(self, X):
        return self._gauss_basis(X[:, :, np.newaxis], self.centers_,
                                 self.width_, axis=1)
    
gauss_model = make_pipeline(GaussianFeatures(20),
                            LinearRegression())
gauss_model.fit(x[:, np.newaxis], y)
yfit = gauss_model.predict(xfit[:, np.newaxis])

plt.scatter(x, y)
plt.plot(xfit, yfit)
plt.xlim(0, 10);
```

**Regularization**

将基本函数引入线性回归令我们的模型更加灵活，但是它很容易导致过拟合。

当邻近的基本函数的系数为了迎合训练数据中的偶然波动而显著增大，导致模型过分复杂并失去了对一般规律的概括能力时，这就是过拟合的一个典型表现。

L2 岭回归中，随着 α 增大，所有权重 w 的值都会趋向于 0，这会使模型趋于平坦，即所有特征对预测结果的影响都非常有限，此时模型基本上不具备任何预测能力，所有样本的预测值趋同于平均值。在 L1 Lasso 回归中，随着 α 增大，一部分特征的权重会被压缩至 0，导致模型简化为一个稀疏模型，仅保留部分重要特征。

```python
# L2
from sklearn.linear_model import Ridge
model = make_pipeline(GaussianFeatures(30), Ridge(alpha=0.1))
basis_plot(model, title='Ridge Regression')

# L1
from sklearn.linear_model import Lasso
model = make_pipeline(GaussianFeatures(30), Lasso(alpha=0.001))
basis_plot(model, title='Lasso Regression')
```

**Example: Predicting Bicycle Traffic**

```python
# !curl -o FremontBridge.csv https://data.seattle.gov/api/views/65db-xm6k/rows.csv?accessType=DOWNLOAD

import pandas as pd
counts = pd.read_csv('data/FremontBridge.csv', index_col='Date', parse_dates=True)
weather = pd.read_csv('data/BicycleWeather.csv', index_col='DATE', parse_dates=True)

daily = counts.resample('d').sum()
daily['Total'] = daily.sum(axis=1)
daily = daily[['Total']] # 移除其他列

days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
for i in range(7):
    daily[days[i]] = (daily.index.dayofweek == i).astype(float)

from pandas.tseries.holiday import USFederalHolidayCalendar
cal = USFederalHolidayCalendar()
holidays = cal.holidays('2012', '2016')
daily = daily.join(pd.Series(1, index=holidays, name='holiday'))
daily['holiday'].fillna(0, inplace=True)

def hours_of_daylight(date, axis=23.44, latitude=47.61):
    """
    计算给定日期的日照时间
    axis 23.44 黄赤夹角
    latitude 47.61 西雅图纬度
    """
    # 2000年12月21日是冬至日，日照时间最短
    days = (date - pd.datetime(2000, 12, 21)).days
    m = (1. - np.tan(np.radians(latitude))
         * np.tan(np.radians(axis) * np.cos(days * 2 * np.pi / 365.25)))
    return 24. * np.degrees(np.arccos(1 - np.clip(m, 0, 2))) / 180.

daily['daylight_hrs'] = list(map(hours_of_daylight, daily.index))
daily[['daylight_hrs']].plot()
plt.ylim(8, 17)

# 气温单位是0.1摄氏度，求平均值
weather['TMIN'] /= 10
weather['TMAX'] /= 10
weather['Temp (C)'] = 0.5 * (weather['TMIN'] + weather['TMAX'])

# 降雨量单位是0.1毫米，转换为英寸
weather['PRCP'] /= 254
weather['dry day'] = (weather['PRCP'] == 0).astype(int)

daily = daily.join(weather[['PRCP', 'Temp (C)', 'dry day']])

daily['annual'] = (daily.index - daily.index[0]).days / 365.

# 移除所有有空值的行
daily.dropna(axis=0, how='any', inplace=True)

# 用来拟合模型的列包括星期几、日照小时数、降水量、是否有雨、气温、该天的年计数
column_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'holiday',
                'daylight_hrs', 'PRCP', 'dry day', 'Temp (C)', 'annual']
X = daily[column_names]
y = daily['Total']

model = LinearRegression(fit_intercept=False)
model.fit(X, y)
daily['predicted'] = model.predict(X)

daily[['Total', 'predicted']].plot(alpha=0.5);

params = pd.Series(model.coef_, index=X.columns)
params

# 对数据的重采样来快速的计算这些不确定性
from sklearn.utils import resample
np.random.seed(1)
err = np.std([model.fit(*resample(X, y)).coef_
              for i in range(1000)], 0)

print(pd.DataFrame({'effect': params.round(0),
                    'error': err.round(0)}))

```

## In-Depth: Support Vector Machines

支持向量机（SVMs）是有监督学习算法中既能分类和回归的特别强大灵活的工具。

当存在多条可能的直线能完美的划分两个分类，而这两个分类间存在大段的空白区域，选择不同的线空白区域不同，直觉上这种划分方式是不够严谨的。

支持向量机提供了一个方法来改进这个问题。这里的原理是：与其简单画一条 0 宽度的线来分类，我们可以每条线上画出一个有宽度的边缘，直至最近的点为止。

在拟合过程中，只有那些支持向量的位置才有意义；任何其他超出边缘范围的点都不会改变训练结果。技术上来说，这是因为这些点并不会为损失函数提供任何贡献来拟合模型，所以它们不会通过边缘区域，它们的位置和数值没有意义。对于远离分隔区域的点的不敏感性是 SVM 模型的威力所在。

```python
%matplotlib inline
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

# 设置Seaborn样式输出图表
import seaborn as sns; sns.set()

# 简单直线分类器
xfit = np.linspace(-1, 3.5)
plt.scatter(X[:, 0], X[:, 1], c=y, s=50, cmap='autumn')
plt.plot([0.6], [2.1], 'x', color='red', markeredgewidth=2, markersize=10)

for m, b in [(1, 0.65), (0.5, 1.6), (-0.2, 2.9)]:
    plt.plot(xfit, m * xfit + b, '-k')

plt.xlim(-1, 3.5);

# 最大化边缘分类器
xfit = np.linspace(-1, 3.5)
plt.scatter(X[:, 0], X[:, 1], c=y, s=50, cmap='autumn')

for m, b, d in [(1, 0.65, 0.33), (0.5, 1.6, 0.55), (-0.2, 2.9, 0.2)]:
    yfit = m * xfit + b
    plt.plot(xfit, yfit, '-k')
    plt.fill_between(xfit, yfit - d, yfit + d, edgecolor='none',
                     color='#AAAAAA', alpha=0.4)

plt.xlim(-1, 3.5);

# 绘制 SVM 边界的快速工具函数
def plot_svc_decision_function(model, ax=None, plot_support=True):
    """绘制2D SVC图像函数"""
    if ax is None:
        ax = plt.gca()
    xlim = ax.get_xlim()
    ylim = ax.get_ylim()
    
    # 创建网格来展示数据
    x = np.linspace(xlim[0], xlim[1], 30)
    y = np.linspace(ylim[0], ylim[1], 30)
    Y, X = np.meshgrid(y, x)
    xy = np.vstack([X.ravel(), Y.ravel()]).T
    P = model.decision_function(xy).reshape(X.shape)
    
    # 绘制边界和边缘
    ax.contour(X, Y, P, colors='k',
               levels=[-1, 0, 1], alpha=0.5,
               linestyles=['--', '-', '--'])
    
    # 绘制支持向量
    if plot_support:
        ax.scatter(model.support_vectors_[:, 0],
                   model.support_vectors_[:, 1],
                   s=300, linewidth=1, facecolors='none');
    ax.set_xlim(xlim)
    ax.set_ylim(ylim)

plt.scatter(X[:, 0], X[:, 1], c=y, s=50, cmap='autumn')
plot_svc_decision_function(model);

# 某些点正好接触边缘，其为关键元素，被称为支持向量，被保存在以下属性中
model.support_vectors_

# 60 个点和 120 个点的拟合效果
def plot_svm(N=10, ax=None):
    X, y = make_blobs(n_samples=200, centers=2,
                      random_state=0, cluster_std=0.60)
    X = X[:N]
    y = y[:N]
    model = SVC(kernel='linear', C=1E10)
    model.fit(X, y)
    
    ax = ax or plt.gca()
    ax.scatter(X[:, 0], X[:, 1], c=y, s=50, cmap='autumn')
    ax.set_xlim(-1, 4)
    ax.set_ylim(-1, 6)
    plot_svc_decision_function(model, ax)

fig, ax = plt.subplots(1, 2, figsize=(16, 6))
fig.subplots_adjust(left=0.0625, right=0.95, wspace=0.1)
for axi, N in zip(ax, [60, 120]):
    plot_svm(N, axi)
    axi.set_title('N = {0}'.format(N))
```

**Beyond linear boundaries: Kernel SVM**

将数据使用多项式和高斯函数投射到高维度空间中，然后就能使用线性分类器来拟合非线性的关系；将数据投射到更高的维度，然后线性分类器就可以达到划分数据的目标。

使用以中央的数据群为中心的径向基函数；如果我们没有将径向基函数的中心点放置在正确的位置上，就不能找到这样清晰的线性分割线出来。

在数据集中的每个数据点作为中心点计算基函数，然后让 SVM 算法帮我们从结果中筛选出好的基函数。这种基函数转换被成为核转换，因为它建立在每一对数据点之间相似的关系（或称为核）的基础之上。

```python
from sklearn.datasets.samples_generator import make_circles
X, y = make_circles(100, factor=.1, noise=.1)

clf = SVC(kernel='linear').fit(X, y)

plt.scatter(X[:, 0], X[:, 1], c=y, s=50, cmap='autumn')
plot_svc_decision_function(clf, plot_support=False);

# 以中央的数据群为中心的径向基函数
r = np.exp(-(X ** 2).sum(1))

from mpl_toolkits import mplot3d

def plot_3D(elev=30, azim=30, X=X, y=y):
    ax = plt.subplot(projection='3d')
    ax.scatter3D(X[:, 0], X[:, 1], r, c=y, s=50, cmap='autumn')
    ax.view_init(elev=elev, azim=azim)
    ax.set_xlabel('x')
    ax.set_ylabel('y')
    ax.set_zlabel('r')

interact(plot_3D, elev=[-90, 90], azip=(-180, 180),
         X=fixed(X), y=fixed(y));

# 核化的支持向量机
clf = SVC(kernel='rbf', C=1E6, gamma='auto')
clf.fit(X, y)

plt.scatter(X[:, 0], X[:, 1], c=y, s=50, cmap='autumn')
plot_svc_decision_function(clf)
plt.scatter(clf.support_vectors_[:, 0], clf.support_vectors_[:, 1],
            s=300, lw=1, facecolors='none');
```

**Tuning the SVM: Softening Margins**

允许一些数据点潜入到边缘区域，如果这样能达到更好的拟合效果的话。边缘的硬度被一个称为 𝐶 的可调参数控制。如果 𝐶 的值很大，边缘是硬的，也就是数据点无法进入边缘区域。如果 𝐶 的值比较小，边缘是软的，能够蔓延到点之外。

```python
X, y = make_blobs(n_samples=100, centers=2,
                  random_state=0, cluster_std=0.8)

fig, ax = plt.subplots(1, 2, figsize=(16, 6))
fig.subplots_adjust(left=0.0625, right=0.95, wspace=0.1)

for axi, C in zip(ax, [10.0, 0.1]):
    model = SVC(kernel='linear', C=C).fit(X, y)
    axi.scatter(X[:, 0], X[:, 1], c=y, s=50, cmap='autumn')
    plot_svc_decision_function(model, axi)
    axi.scatter(model.support_vectors_[:, 0],
                model.support_vectors_[:, 1],
                s=300, lw=1, facecolors='none');
    axi.set_title('C = {0:.1f}'.format(C), size=14)
```

最优的 𝐶 值取决于你的数据集，应该通过交叉验证或者简单过程来调整。

**Example: Face Recognition**

```python
from sklearn.datasets import fetch_lfw_people
faces = fetch_lfw_people(min_faces_per_person=60)
print(faces.target_names)
print(faces.images.shape)

fig, ax = plt.subplots(3, 5)
for i, axi in enumerate(ax.flat):
    axi.imshow(faces.images[i], cmap='bone')
    axi.set(xticks=[], yticks=[],
            xlabel=faces.target_names[faces.target[i]])

from sklearn.svm import SVC
from sklearn.decomposition import PCA as RandomizedPCA
from sklearn.pipeline import make_pipeline

pca = RandomizedPCA(n_components=150, whiten=True, random_state=42)
svc = SVC(kernel='rbf', class_weight='balanced')
model = make_pipeline(pca, svc)

from sklearn.model_selection import train_test_split
Xtrain, Xtest, ytrain, ytest = train_test_split(faces.data, faces.target,
random_state=42)

# 最优值应该落在网格的中央位置；如果它们落在边缘位置，我们应该考虑扩大网格来确保我们找到了最优值。
from sklearn.model_selection import GridSearchCV
param_grid = {'svc__C': [1, 5, 10, 50],
   'svc__gamma': [0.0001, 0.0005, 0.001, 0.005]}
grid = GridSearchCV(model, param_grid, cv=3)

%time grid.fit(Xtrain, ytrain)
print(grid.best_params_)

model = grid.best_estimator_
yfit = model.predict(Xtest)

fig, ax = plt.subplots(4, 6)
for i, axi in enumerate(ax.flat):
    axi.imshow(Xtest[i].reshape(62, 47), cmap='bone')
    axi.set(xticks=[], yticks=[])
    axi.set_ylabel(faces.target_names[yfit[i]].split()[-1],
                   color='black' if yfit[i] == ytest[i] else 'red')
fig.suptitle('Predicted Names; Incorrect Labels in Red', size=14);

from sklearn.metrics import classification_report
print(classification_report(ytest, yfit,
target_names=faces.target_names))

from sklearn.metrics import confusion_matrix
mat = confusion_matrix(ytest, yfit)
sns.heatmap(mat.T, square=True, annot=True, fmt='d', cbar=False,
            xticklabels=faces.target_names,
            yticklabels=faces.target_names)
plt.xlabel('true label')
plt.ylabel('predicted label');
```

在实际的案例中，可用 OpenCV 将其中像素中独立的特征提取出来。
## In-Depth: Decision Trees and Random Forests

随机森林是构建在决策树基础上的组合学习的一种方法。

决策树是用来分类或者标记对象的非常直观的方法：你只需要简单的提出一系列设计好的问题，最终达到分类标签即可。

```python
%matplotlib inline
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns; sns.set()

from sklearn.datasets import make_blobs

X, y = make_blobs(n_samples=300, centers=4,
                  random_state=0, cluster_std=1.0)
plt.scatter(X[:, 0], X[:, 1], c=y, s=50, cmap='rainbow');

from sklearn.tree import DecisionTreeClassifier
tree = DecisionTreeClassifier().fit(X, y)

def visualize_classifier(model, X, y, ax=None, cmap='rainbow'):
    ax = ax or plt.gca()
    
    # 绘制训练集数据点
    ax.scatter(X[:, 0], X[:, 1], c=y, s=30, cmap=cmap,
               clim=(y.min(), y.max()), zorder=3)
    ax.axis('tight')
    ax.axis('off')
    xlim = ax.get_xlim()
    ylim = ax.get_ylim()
    
    # 模型拟合
    model.fit(X, y)
    xx, yy = np.meshgrid(np.linspace(*xlim, num=200),
                         np.linspace(*ylim, num=200))
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)

    # 填充结果区域
    n_classes = len(np.unique(y))
    contours = ax.contourf(xx, yy, Z, alpha=0.3,
                           levels=np.arange(n_classes + 1) - 0.5,
                           cmap=cmap, zorder=1)

    ax.set(xlim=xlim, ylim=ylim)

visualize_classifier(DecisionTreeClassifier(), X, y)
```

在数据不同子集上的训练，很明显在一些位置上，两棵树都产生了相同的结果，但是在其他位置上，两个模型给出了非常差异的分类结果，结果差异一般会出现在分类器确定性较低的位置，因此如果我们同时使用这两棵树的特性的话，可以得到更好的结果。

**Ensembles of Estimators: Random Forests**

多个过拟合的评估器可以被合并来减少过拟合的方法，被称为装袋，是一种团体学习的算法。装袋将一些并行的评估器组装（类似塞到袋子里）起来，其中的每个评估器都会产生过拟合，然后对结果求平均来得到一个更好的分类。对随机决策树的组装被称为随机森林。

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import BaggingClassifier

tree = DecisionTreeClassifier()
bag = BaggingClassifier(tree, n_estimators=100, max_samples=0.8,random_state=1)

bag.fit(X, y)
visualize_classifier(bag, X, y)
```

**Random Forest Regression**

随机森林也能在回归场景中使用。

```python
rng = np.random.RandomState(42)
x = 10 * rng.rand(200)

def model(x, sigma=0.3):
    fast_oscillation = np.sin(5 * x)
    slow_oscillation = np.sin(0.5 * x)
    noise = sigma * rng.randn(len(x))

    return slow_oscillation + fast_oscillation + noise

y = model(x)
plt.errorbar(x, y, 0.3, fmt='o');

from sklearn.ensemble import RandomForestRegressor
forest = RandomForestRegressor(200)
forest.fit(x[:, None], y)

xfit = np.linspace(0, 10, 1000)
yfit = forest.predict(xfit[:, None])
ytrue = model(xfit, sigma=0)

plt.errorbar(x, y, 0.3, fmt='o', alpha=0.5)
plt.plot(xfit, yfit, '-r');
plt.plot(xfit, ytrue, '-k', alpha=0.5);
```

**Example: Random Forest for Classifying Digits**

```python
from sklearn.datasets import load_digits
digits = load_digits()
digits.keys()

# 设置图表
fig = plt.figure(figsize=(6, 6))  # 图表尺寸
fig.subplots_adjust(left=0, right=1, bottom=0, top=1, hspace=0.05, wspace=0.05)

# 绘制数字，每个数字都是8x8大小
for i in range(64):
    ax = fig.add_subplot(8, 8, i + 1, xticks=[], yticks=[])
    ax.imshow(digits.images[i], cmap=plt.cm.binary, interpolation='nearest')
    
    # 添加数字的标签
    ax.text(0, 7, str(digits.target[i]))

from sklearn.model_selection import train_test_split

Xtrain, Xtest, ytrain, ytest = train_test_split(digits.data, digits.target,
                                                random_state=0)
model = RandomForestClassifier(n_estimators=1000)
model.fit(Xtrain, ytrain)
ypred = model.predict(Xtest)

from sklearn import metrics
print(metrics.classification_report(ypred, ytest))

from sklearn.metrics import confusion_matrix
mat = confusion_matrix(ytest, ypred)
sns.heatmap(mat.T, square=True, annot=True, fmt='d', cbar=False)
plt.xlabel('true label')
plt.ylabel('predicted label');
```

## In Depth: Principal Component Analysis

PCA 本质上是一个降维算法，但是它也可以作为可视化、过滤噪音、特征提取和特征工程等方面的有用工具。

PCA 不是希望训练一个可以通过 x 值预测 y 值的模型，而是希望模型能够学习到 x 和 y 值之间的关联。在主成分分析中，这种关联关系被量化成在数据中找到一个主要特征轴的列表，然后使用这些轴来描绘数据集。

PCA 评估器拟合过程从数据中学习到了一些量值，最重要的是其中的“成分”和“可解释方差，使用“成分”来确定矢量的方向，“可解释方差”用来确定矢量的长度。

这些矢量代表着数据的主要特征轴，而矢量的长度代表着这个轴对于数据的分布起到了多重要的作用，更精确来说，这是数据被投射到这个轴上时方差的度量。将每个数据点投射到主要特征轴上被称为数据的“主要成分”。

这种将数据轴变换成主要特征轴的方法被称为仿射变换，基本上表示这可以通过转换、旋转和统一比例完成。

PCA 可以想象成选择最优的基础函数，在这个函数当中只需要将头几项相加就能足够重建数据集的主要部分。主成分，我们数据的低维度表示，其实就是这个函数当中的头几项的系数

```python
from sklearn.decomposition import PCA
pca = PCA(n_components=2)
pca.fit(X)

print(pca.components_)
print(pca.explained_variance_)

# 使用“成分”来确定矢量的方向，“可解释方差”用来确定矢量的长度
def draw_vector(v0, v1, ax=None):
    ax = ax or plt.gca()
    arrowprops=dict(arrowstyle='->',
                    linewidth=2,
                    shrinkA=0, shrinkB=0)
    ax.annotate('', v1, v0, arrowprops=arrowprops)

# plot data
plt.scatter(X[:, 0], X[:, 1], alpha=0.2)
for length, vector in zip(pca.explained_variance_, pca.components_):
    v = vector * 3 * np.sqrt(length)
    draw_vector(pca.mean_, pca.mean_ + v)
plt.axis('equal');
```

**PCA as Dimensionality Reduction**

```python
pca = PCA(n_components=1)
pca.fit(X)
X_pca = pca.transform(X)
print("original shape:   ", X.shape)
print("transformed shape:", X_pca.shape)

X_new = pca.inverse_transform(X_pca)
plt.scatter(X[:, 0], X[:, 1], alpha=0.2)
plt.scatter(X_new[:, 0], X_new[:, 1], alpha=0.8)
plt.axis('equal');

# 估算需要多少个成分来描述数据，可通过可解释方差比例来决定
pca = PCA().fit(digits.data)
plt.plot(np.cumsum(pca.explained_variance_ratio_))
plt.xlabel('number of components')
plt.ylabel('cumulative explained variance');
```

**PCA as Noise Filtering**

任何具有较大差异的成分相对来说都不会收到噪音的影响。因此如果你通过保留大部分主成分来重建数据集的话，应该能达到较好的去噪效果。

```python
def plot_digits(data):
	fig, axes = plt.subplots(4, 10, figsize=(10, 4),
subplot_kw={'xticks':[], 'yticks':[]},                             gridspec_kw=dict(hspace=0.1, wspace=0.1))
    for i, ax in enumerate(axes.flat):
        ax.imshow(data[i].reshape(8, 8),
                  cmap='binary', interpolation='nearest',
                  clim=(0, 16))
plot_digits(digits.data)

np.random.seed(42)
noisy = np.random.normal(digits.data, 4)
plot_digits(noisy)

pca = PCA(0.50).fit(noisy)
pca.n_components_

components = pca.transform(noisy)
filtered = pca.inverse_transform(components)
plot_digits(filtered)
```

**Example: Eigenfaces**

特征脸谱：提取出主成分的图像可视化。

```python
from sklearn.datasets import fetch_lfw_people
faces = fetch_lfw_people(min_faces_per_person=60)
print(faces.target_names)
print(faces.images.shape)

from sklearn.decomposition import PCA as RandomizedPCA
pca = RandomizedPCA(150, svd_solver='randomized')
pca.fit(faces.data)

fig, axes = plt.subplots(3, 8, figsize=(9, 4),
                         subplot_kw={'xticks':[], 'yticks':[]},
                         gridspec_kw=dict(hspace=0.1, wspace=0.1))
for i, ax in enumerate(axes.flat):
    ax.imshow(pca.components_[i].reshape(62, 47), cmap='bone')

plt.plot(np.cumsum(pca.explained_variance_ratio_))
plt.xlabel('number of components')
plt.ylabel('cumulative explained variance');

# 计算主成分和还原的图像
pca = RandomizedPCA(150).fit(faces.data)
components = pca.transform(faces.data)
projected = pca.inverse_transform(components)

# 绘制结果
fig, ax = plt.subplots(2, 10, figsize=(10, 2.5),
                       subplot_kw={'xticks':[], 'yticks':[]},
                       gridspec_kw=dict(hspace=0.1, wspace=0.1))
for i in range(10):
    ax[0, i].imshow(faces.data[i].reshape(62, 47), cmap='binary_r')
    ax[1, i].imshow(projected[i].reshape(62, 47), cmap='binary_r')
    
ax[0, 0].set_ylabel('full-dim\ninput')
ax[1, 0].set_ylabel('150-dim\nreconstruction');
```

## In-Depth: Manifold Learning

流形学习：一类无监督学习评估器，试图使用低维度的流形来描述高纬度空间的数据集。

一些流形学习方法，底层主要依赖三个技巧：多维缩放（MDS）、本地线性嵌入（LLE）和等距映射（IsoMap）。
## In Depth: k-Means Clustering

聚类算法寻求通过数据的属性进行学习，然后获得数据点的优化分组或离散标签。

最大期望算法 E-M：
1. 随机猜测聚类中心点
2. 重复以下步骤
    1. _E步骤_：将所有数据点分配到最近的聚类中心点上
    2. _M步骤_：重新计算每个聚类的中心点
注意，不会收敛到全局最优，得到的是局部最优。

```python
%matplotlib inline
import matplotlib.pyplot as plt
import seaborn as sns; sns.set()  # 图表风格 seaborn
import numpy as np

from sklearn.datasets.samples_generator import make_blobs
X, y_true = make_blobs(n_samples=300, centers=4,
                       cluster_std=0.60, random_state=0)
plt.scatter(X[:, 0], X[:, 1], s=50);

from sklearn.cluster import KMeans
kmeans = KMeans(n_clusters=4)
kmeans.fit(X)
y_kmeans = kmeans.predict(X)

plt.scatter(X[:, 0], X[:, 1], c=y_kmeans, s=50, cmap='viridis')

centers = kmeans.cluster_centers_
plt.scatter(centers[:, 0], centers[:, 1], c='black', s=200, alpha=0.5);

# K MEAN 的基本实现方式
from sklearn.metrics import pairwise_distances_argmin

def find_clusters(X, n_clusters, rseed=2):
    # 1. 随机选取聚类中心点
    rng = np.random.RandomState(rseed)
    i = rng.permutation(X.shape[0])[:n_clusters]
    centers = X[i]
    
    while True:
        # 2a. 计算求出距离最近的中心点，标记相应数据点
        labels = pairwise_distances_argmin(X, centers)
        
        # 2b. 求出每个聚类最新的中心点
        new_centers = np.array([X[labels == i].mean(0)
                                for i in range(n_clusters)])
        
        # 2c. 检查收敛，如果新中心点与原中心点相同，算法结束
        if np.all(centers == new_centers):
            break
        centers = new_centers
    
    return centers, labels

centers, labels = find_clusters(X, 4)
plt.scatter(X[:, 0], X[:, 1], c=labels,
            s=50, cmap='viridis');

```

k 均值算法必须传递聚类的个数：它并不能够从数据中学习得到聚类的数量。

```python
from sklearn.datasets import make_moons
X, y = make_moons(200, noise=.05, random_state=0)

labels = KMeans(2, random_state=0).fit_predict(X)
plt.scatter(X[:, 0], X[:, 1], c=labels,
            s=50, cmap='viridis');
```

k 均值算法聚类的边界总是线性的，因此在更复杂边界的情况下将无法使用。可以使用核转换将数据投射到更高的维度上，令线性分类器可以工作。

```python
from sklearn.cluster import SpectralClustering
model = SpectralClustering(n_clusters=2, affinity='nearest_neighbors',
                           assign_labels='kmeans')
labels = model.fit_predict(X)
plt.scatter(X[:, 0], X[:, 1], c=labels,
            s=50, cmap='viridis');
```

**Example: K-Means on Digits**

```python
from sklearn.datasets import load_digits
digits = load_digits()
digits.data.shape

fig, ax = plt.subplots(2, 5, figsize=(8, 3))
centers = kmeans.cluster_centers_.reshape(10, 8, 8)
for axi, center in zip(ax.flat, centers):
    axi.set(xticks=[], yticks=[])
    axi.imshow(center, interpolation='nearest', cmap=plt.cm.binary)

from scipy.stats import mode

labels = np.zeros_like(clusters)
for i in range(10):
    mask = (clusters == i)
    labels[mask] = mode(digits.target[mask])[0]

from sklearn.metrics import accuracy_score
accuracy_score(digits.target, labels)

from sklearn.metrics import confusion_matrix
mat = confusion_matrix(digits.target, labels)
sns.heatmap(mat.T, square=True, annot=True, fmt='d', cbar=False,
            xticklabels=digits.target_names,
            yticklabels=digits.target_names)
plt.xlabel('true label')
plt.ylabel('predicted label');

# t-SNE 是一个非线性嵌入算法，特别适合用来保留聚类的数据点
# t-SNE（t-distributed Stochastic Neighbor Embedding）
# t-SNE的核心思想是基于概率相似度，通过优化一个适应度函数来模拟高维空间中的局部相似性结构，尤其是在局部邻域内。
from sklearn.manifold import TSNE

# 投射数据点，本步骤可能需要执行一段时间
tsne = TSNE(n_components=2, init='random', random_state=0)
digits_proj = tsne.fit_transform(digits.data)

# 计算聚类
kmeans = KMeans(n_clusters=10, random_state=0)
clusters = kmeans.fit_predict(digits_proj)

# 排列标签
labels = np.zeros_like(clusters)
for i in range(10):
    mask = (clusters == i)
    labels[mask] = mode(digits.target[mask])[0]

# 计算准确率
accuracy_score(digits.target, labels)
```

**Example: K-Means for Color Compression**

```python
# 注：需要安装pillow包
from sklearn.datasets import load_sample_image
china = load_sample_image("china.jpg")
ax = plt.axes(xticks=[], yticks=[])
ax.imshow(china);

china.shape

data = china / 255.0 # use 0...1 scale
data = data.reshape(427 * 640, 3)
data.shape

def plot_pixels(data, title, colors=None, N=10000):
    if colors is None:
        colors = data
    
    # 选择随机子数据集
    rng = np.random.RandomState(0)
    i = rng.permutation(data.shape[0])[:N]
    colors = colors[i]
    R, G, B = data[i].T
    
    fig, ax = plt.subplots(1, 2, figsize=(16, 6))
    ax[0].scatter(R, G, color=colors, marker='.')
    ax[0].set(xlabel='Red', ylabel='Green', xlim=(0, 1), ylim=(0, 1))

    ax[1].scatter(R, B, color=colors, marker='.')
    ax[1].set(xlabel='Red', ylabel='Blue', xlim=(0, 1), ylim=(0, 1))

    fig.suptitle(title, size=20);

plot_pixels(data, title='Input color space: 16 million possible colors')

#import warnings; warnings.simplefilter('ignore')  # Fix NumPy issues.

from sklearn.cluster import MiniBatchKMeans
kmeans = MiniBatchKMeans(16)
kmeans.fit(data)
new_colors = kmeans.cluster_centers_[kmeans.predict(data)]

plot_pixels(data, colors=new_colors,
            title="Reduced color space: 16 colors")
```

k 均值一个重要的特点是这些聚类模型必须是圆形的：k 均值没有內建的方式来处理长方形或者椭圆形的聚类。
## In Depth: Gaussian Mixture Models

k 均值的非概率本质和其简单的依据与中心点距离来划分聚类的方式，决定了在很多真实世界情况中表现很不理想。高斯混合模型，它被认为是 k 均值算法的一种拓展，且能作为超越简单聚类的一个强大工具。

**Motivating GMM: Weaknesses of K-Means**

```python
# 生成数据
from sklearn.datasets.samples_generator import make_blobs
X, y_true = make_blobs(n_samples=400, centers=4,
                       cluster_std=0.60, random_state=0)
X = X[:, ::-1] # flip axes for better plotting

# 使用 k 均值进行聚类，并绘制结果
from sklearn.cluster import KMeans
kmeans = KMeans(4, random_state=0)
labels = kmeans.fit(X).predict(X)
plt.scatter(X[:, 0], X[:, 1], c=labels, s=40, cmap='viridis');

from sklearn.cluster import KMeans
from scipy.spatial.distance import cdist

def plot_kmeans(kmeans, X, n_clusters=4, rseed=0, ax=None):
    labels = kmeans.fit_predict(X)

    # 绘制输入数据点
    ax = ax or plt.gca()
    ax.axis('equal')
    ax.scatter(X[:, 0], X[:, 1], c=labels, s=40, cmap='viridis', zorder=2)

    # 绘制k均值模型
    centers = kmeans.cluster_centers_
    radii = [cdist(X[labels == i], [center]).max()
             for i, center in enumerate(centers)]
    for c, r in zip(centers, radii):
        ax.add_patch(plt.Circle(c, r, fc='#CCCCCC', lw=3, alpha=0.5, zorder=1))

kmeans = KMeans(n_clusters=4, random_state=0)
plot_kmeans(kmeans, X)

# 无法处理非圆形的聚类模型
rng = np.random.RandomState(13)
X_stretched = np.dot(X, rng.randn(2, 2))

kmeans = KMeans(n_clusters=4, random_state=0)
plot_kmeans(kmeans, X_stretched)
```

k 均值的这两个缺点，模型形状缺乏灵活性和无概率聚类本质，意味着对于很多数据集（特别是低维度数据集）来说，它可能不会按照预期那样工作。

你可能希望通过对 k 均值模型进行泛化来解决这些缺点：例如你可以通过对每个数据点计算其与所有的聚类中心点的距离来测算不确定度，而不是仅考虑最近的中心点。你也可以将聚类边界泛化成椭圆而不是圆形来适配非圆形聚类。这两个泛化技巧导致了另外一个的聚类模型，高斯混合模型。

**Generalizing E–M: Gaussian Mixture Models**

```python
from sklearn.mixture import GaussianMixture
gmm = GaussianMixture(n_components=4).fit(X)
labels = gmm.predict(X)
plt.scatter(X[:, 0], X[:, 1], c=labels, s=40, cmap='viridis');

probs = gmm.predict_proba(X)
print(probs[:5].round(3))

size = 50 * probs.max(1) ** 2  # square emphasizes differences
plt.scatter(X[:, 0], X[:, 1], c=labels, cmap='viridis', s=size);
```

1. 选择初始位置和形状
2. 重复一下步骤：
    1. _E-step_：对每个数据点，找到其从属于每个聚类的概率值
    2. _M-step_：对每个聚类，依据所有从属的数据点，计算更新它的位置，标准化值和形状

每个聚类不是依据硬边界的圆形来区分，而是依据平滑的高斯模型来区分。

```python
from matplotlib.patches import Ellipse

def draw_ellipse(position, covariance, ax=None, **kwargs):
    """根据给定的位置和协方差绘制模型椭圆"""
    ax = ax or plt.gca()
    
    # 将协方差转换为主坐标轴
    if covariance.shape == (2, 2):
        U, s, Vt = np.linalg.svd(covariance)
        angle = np.degrees(np.arctan2(U[1, 0], U[0, 0]))
        width, height = 2 * np.sqrt(s)
    else:
        angle = 0
        width, height = 2 * np.sqrt(covariance)
    
    # 绘制椭圆
    for nsig in range(1, 4):
        ax.add_patch(Ellipse(position, nsig * width, nsig * height,
                             angle, **kwargs))
        
def plot_gmm(gmm, X, label=True, ax=None):
    ax = ax or plt.gca()
    labels = gmm.fit(X).predict(X)
    if label:
        ax.scatter(X[:, 0], X[:, 1], c=labels, s=40, cmap='viridis', zorder=2)
    else:
        ax.scatter(X[:, 0], X[:, 1], s=40, zorder=2)
    ax.axis('equal')
    
    w_factor = 0.2 / gmm.weights_.max()
    for pos, covar, w in zip(gmm.means_, gmm.covariances_, gmm.weights_):
        draw_ellipse(pos, covar, alpha=w * w_factor)

gmm = GaussianMixture(n_components=4, random_state=42)
plot_gmm(gmm, X)

# 协方差类型控制着聚类形状的自由度
gmm = GaussianMixture(n_components=4, covariance_type='full', random_state=42)
plot_gmm(gmm, X_stretched)
```

**GMM as Density Estimation**

虽然 GMM 经常被归为聚类算法，但它本质是一个密度估计算法。这就是说，GMM 在一些数据上拟合的结果技术上来说不是聚合模型，而是一个生成概率模型，用来描述数据的分布。

```python
from sklearn.datasets import make_moons
Xmoon, ymoon = make_moons(200, noise=.05, random_state=0)
plt.scatter(Xmoon[:, 0], Xmoon[:, 1]);

gmm2 = GaussianMixture(n_components=2, covariance_type='full', random_state=0)
plot_gmm(gmm2, Xmoon)

# 生成的是数据的分布模型
gmm16 = GaussianMixture(n_components=16, covariance_type='full', random_state=0)
plot_gmm(gmm16, Xmoon, label=False)

# 使用这个 GMM 模型产生 400 个新数据点的方法，它们将复合原始数据的分布情况
Xnew, _ = gmm16.sample(400)
plt.scatter(Xnew[:, 0], Xnew[:, 1]);

# 成分选择
# GMM 成分数量的最优选择是能最小化 AIC 和 BIC 的值
# 都是在统计建模中用于评估模型复杂度和模型拟合优度的标准，并帮助选择最佳模型的方法
n_components = np.arange(1, 21)
models = [GaussianMixture(n, covariance_type='full', random_state=0).fit(Xmoon)
          for n in n_components]

plt.plot(n_components, [m.bic(Xmoon) for m in models], label='BIC')
plt.plot(n_components, [m.aic(Xmoon) for m in models], label='AIC')
plt.legend(loc='best')
plt.xlabel('n_components');
```

**Example: GMM for Generating New Data**

```python
from sklearn.datasets import load_digits
digits = load_digits()
digits.data.shape

def plot_digits(data):
    fig, ax = plt.subplots(10, 10, figsize=(8, 8),
                           subplot_kw=dict(xticks=[], yticks=[]))
    fig.subplots_adjust(hspace=0.05, wspace=0.05)
    for i, axi in enumerate(ax.flat):
        im = axi.imshow(data[i].reshape(8, 8), cmap='binary')
        im.set_clim(0, 16)
plot_digits(digits.data)

from sklearn.decomposition import PCA
pca = PCA(0.99, whiten=True)
data = pca.fit_transform(digits.data)
data.shape

n_components = np.arange(50, 210, 10)
models = [GaussianMixture(n, covariance_type='full', random_state=0)
          for n in n_components]
aics = [model.fit(data).aic(data) for model in models]
plt.plot(n_components, aics);

gmm = GaussianMixture(140, covariance_type='full', random_state=0)
gmm.fit(data)
print(gmm.converged_)

data_new, _ = gmm.sample(100)
data_new.shape

digits_new = pca.inverse_transform(data_new)
plot_digits(digits_new)
```

## In-Depth: Kernel Density Estimation

核密度估计在某种程度上是一个将高斯混合理念发展到其逻辑层次的算法：该算法是包含了每个数据点形成的一个高斯成分，得到一个基本上无参数的密度评估器。
# Summary

监督学习
- 分类
- 回归
无监督学习
- 降维
- 聚类

**生成分类器**： 生成分类器旨在学习数据的底层数据生成过程，它通常包括两个步骤：

1. 学习每个类别的概率分布（联合概率分布或多变量的概率密度函数）。
2. 利用学到的概率分布来进行分类预测，即对于给定的新样本，估计它属于各个类别的概率，并选择具有最高概率的类别作为预测结果。

例如，朴素贝叶斯分类器和隐马尔可夫模型 HMM 就是典型的生成分类器。在训练阶段，它们会学习每个类别下的特征条件独立或其他依赖关系，并据此推断新样本的类别。

**判别分类器**： 判别分类器则直接学习决策边界或条件概率分布，目的是最大化类别的区分度，而不关心数据的具体生成机制。它直接从训练数据中找出一个函数（或超平面、决策边界等），使得这个函数能最佳地区分不同类别的样本。

例如，支持向量机 SVM、逻辑回归 Logistic Regression 和神经网络 Neural Networks 都是判别分类器。这些模型关注于如何最优化决策边界以正确划分训练集中的各类别样本。