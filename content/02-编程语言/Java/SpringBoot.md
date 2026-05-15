---
title: SpringBoot
date: 2025-09-01
lastmod: 2025-09-01
tags: [缂栫▼璇█, Java, SpringBoot]
---

[GitHub - spring-reading](https://github.com/xuchengsheng/spring-reading?tab=readme-ov-file)

[[JAVA]]

[缁冩墜椤圭洰](https://gitee.com/wingowen/demo-mybatis-plus)

# 娉ㄨВ

鑷畾涔夋敞瑙ｇ殑瀹炵幇鏂瑰紡
- 鎷︽埅鍣?- AOP

# IO

```java
/*
璇诲彇 Resources 涓嬬殑鏂囦欢
*/

// 鎶ラ敊浠ｇ爜
ClassPathResource resource = new ClassPathResource("DeviceCert.cer");
String certFilePath = resource.getURL().getPath();
FileInputStream fis = new FileInputStream(certFilePath)
// 杩欐牱璇讳笉鍒帮紝鍥犱负杩欓噷 resource.getURL().getPath() 鑾峰彇鐨勮矾寰勫崗璁潪閫氱敤
// 淇浠ｇ爜锛岀洿鎺ヨ幏鍙栨祦杩涜浣跨敤
ClassPathResource resource = new ClassPathResource("DeviceCert.cer");
InputStream inputStream = resource.getInputStream()

// 閫氱敤鏂规硶
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
鎵撳寘杩愯鎶ラ敊锛氭壘涓嶅埌涓荤被娓呭崟
*/


```

# Context

```java
// 鍦?Spring Boot 椤圭洰涓€氬父瀛樺湪涓ょ绠＄悊鏂瑰紡
// 涓€銆丼pringBoot 绠＄悊鐨勪笂涓嬫枃瀵硅薄
// 浜屻€佹櫘閫氱殑 Java 瀵硅薄


```