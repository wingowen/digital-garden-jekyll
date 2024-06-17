# IO

```java
/*
读取 Resources 下的文件
*/

// 报错代码
ClassPathResource resource = new ClassPathResource("DeviceCert.cer");
String certFilePath = resource.getURL().getPath();
FileInputStream fis = new FileInputStream(certFilePath)
// 这样读不到，因为这里 resource.getURL().getPath() 获取的路径协议非通用
// 修正代码，直接获取流进行使用
ClassPathResource resource = new ClassPathResource("DeviceCert.cer");
InputStream inputStream = resource.getInputStream()

// 通用方法
public static String readFileFromResource(String fileName) {
	String content;
	try (InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(fileName)) {
		content = IOUtils.toString(
				inputStream,
				StandardCharsets.UTF_8
		);
	} catch (IOException e) {
		throw new RuntimeException(e);
	}

	return content;
}
```

# CONFIG

# PACKAGE

```java
/*
打包运行报错：找不到主类清单
*/


```

# Context

```java
// 在 Spring Boot 项目中通常存在两种管理方式
// 一、SpringBoot 管理的上下文对象
// 二、普通的 Java 对象


```