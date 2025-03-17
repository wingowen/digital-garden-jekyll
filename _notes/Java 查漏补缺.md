### 单例模式

```java
class Chinese{
	private static Chinese obj =new Chinese();
	private Chinese(){}
	public static Chinese getInstance() { return obj; }
}
```

### 枚举

1. 当 JVM 首次使用 enum 类型时，会初始化这个 enum 类；
2. enum 中定义的每个枚举常量都会调用构造方法，按照声明的顺序依次初始化。

### 重载和重写

重载的判定只有两个条件（其他的条件都不能作为判定）：1. 方法名一致；2. 形参列表不同。

重写：1. 方法名和形参列表一致； 2. 返回（包括异常）相同或者为子类；3. 修饰符必须大于或等于。

### 常量池和堆



