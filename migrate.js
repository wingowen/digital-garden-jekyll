const fs = require('fs');
const path = require('path');

const sourceDir = 'D:/digital-garden-jekyll/_notes';
const targetDir = 'D:/digital-garden-jekyll/content';

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Mapping from source subdirs to target dirs
const dirMapping = {
  '计算机科学': '01-计算机科学',
  '考研/计算机组成': '09-考研/计算机组成',
  '考研/操作系统': '09-考研/操作系统',
  '考研': '09-考研',
  '大模型': '05-机器学习/大模型',
  '物品清单': '10-生活/物品清单',
  '杂项': null, // handled specially
};

// Files that go to specific target dirs regardless of source
const fileMapping = {
  'JAVA.md': '02-编程语言/Java/JAVA.md',
  'Java 查漏补缺.md': '02-编程语言/Java/Java 查漏补缺.md',
  'Spring.md': '02-编程语言/Java/Spring.md',
  'SpringBoot.md': '02-编程语言/Java/SpringBoot.md',
  'OnJava8.md': '02-编程语言/Java/OnJava8.md',
  'Netty.md': '02-编程语言/Java/Netty.md',
  'RPC.md': '02-编程语言/Java/RPC.md',
  'Go 语言.md': '02-编程语言/Go/Go 语言.md',
  'Go 并发编程.md': '02-编程语言/Go/Go 并发编程.md',
  'Go 高并发秒杀系统.md': '02-编程语言/Go/Go 高并发秒杀系统.md',
  'Go 面试题.md': '02-编程语言/Go/Go 面试题.md',
  'MySQL.md': '03-数据库/MySQL.md',
  'Redis.md': '03-数据库/Redis.md',
  '风险 SQL 审计.md': '03-数据库/风险-SQL-审计.md',
  '数据库-面经.md': '03-数据库/数据库-面经.md',
  'HDFS.md': '04-大数据/Hadoop/HDFS.md',
  'MapReduce.md': '04-大数据/Hadoop/MapReduce.md',
  'Yarn.md': '04-大数据/Hadoop/Yarn.md',
  'Hadoop-面经.md': '04-大数据/Hadoop/Hadoop-面经.md',
  'Spark.md': '04-大数据/Spark/Spark.md',
  'Spark-面经.md': '04-大数据/Spark/Spark-面经.md',
  'Hive.md': '04-大数据/Hive/Hive.md',
  'Hive-面经.md': '04-大数据/Hive/Hive-面经.md',
  'Kafka.md': '04-大数据/Kafka/Kafka.md',
  'Kafka-面经.md': '04-大数据/Kafka/Kafka-面经.md',
  'Flink.md': '04-大数据/Flink/Flink.md',
  'Flink-面经.md': '04-大数据/Flink/Flink-面经.md',
  '电商数仓.md': '04-大数据/电商数仓.md',
  '湖对湖的数据同步.md': '04-大数据/湖对湖的数据同步.md',
  '数据仓库-面经.md': '04-大数据/数据仓库-面经.md',
  '大数据开发工程师面经.md': '04-大数据/大数据开发工程师面经.md',
  '大数据组件.md': '04-大数据/大数据组件.md',
  '机器学习.md': '05-机器学习/机器学习.md',
  '神经网络.md': '05-机器学习/神经网络.md',
  '注意力机制.md': '05-机器学习/注意力机制.md',
  '算法.md': '05-机器学习/算法.md',
  '数据结构.md': '05-机器学习/数据结构.md',
  '量化交易.md': '06-投资理财/量化交易.md',
  '漫步华尔街.md': '06-投资理财/漫步华尔街.md',
  '徐远的投资课.md': '06-投资理财/徐远的投资课.md',
  '关于投资的思考.md': '06-投资理财/关于投资的思考.md',
  '被追赶的经济体.md': '06-投资理财/被追赶的经济体.md',
  '金融哲学三部曲：货币起源.md': '06-投资理财/金融三部曲/货币起源.md',
  '金融哲学三部曲：市场本质.md': '06-投资理财/金融三部曲/市场本质.md',
  '雅思.md': '07-英语/雅思.md',
  '英语一.md': '07-英语/英语一.md',
  '英语阅读.md': '07-英语/英语阅读.md',
  '单词学习.md': '07-英语/单词学习.md',
  '考研/英语作文.md': '07-英语/英语作文.md',
  '2010 考研英语二真题.md': '07-英语/2010 考研英语二真题.md',
  '2011 考研英语二真题.md': '07-英语/2011 考研英语二真题.md',
  '2012 考研英语二真题.md': '07-英语/2012 考研英语二真题.md',
  '面试.md': '08-面试/面试.md',
  '面试题目整理.md': '08-面试/面试题目整理.md',
  '面试项目准备.md': '08-面试/面试项目准备.md',
  '技术栈.md': '08-面试/技术栈.md',
  '简历.md': '08-面试/简历.md',
  '任职要求.md': '08-面试/任职要求.md',
  '腾讯招聘要求.md': '08-面试/腾讯招聘要求.md',
  'Elasticsearch 面试题目整理.md': '08-面试/面经/Elasticsearch 面试题目整理.md',
  '考研.md': '09-考研/考研.md',
  '关于我.md': '10-生活/关于我.md',
  '万卷书.md': '10-生活/万卷书.md',
  '人生体验清单.md': '10-生活/人生体验清单.md',
  '碎碎念.md': 'Z-待整理/碎碎念.md',
  '技术探索.md': 'Z-待整理/技术探索.md',
  '百宝袋.md': 'Z-待整理/百宝袋.md',
  '数字花园.md': 'Z-待整理/数字花园.md',
  'Agent.md': 'Z-待整理/Agent.md',
  'Agent 的日志处理.md': 'Z-待整理/Agent的日志处理.md',
  'Context Engineering.md': 'Z-待整理/Context Engineering.md',
  'Claud Code Prompt.md': 'Z-待整理/Claud Code Prompt.md',
  'Docker.md': 'Z-待整理/Docker.md',
  'K8S.md': 'Z-待整理/K8S.md',
  'Nginx.md': 'Z-待整理/Nginx.md',
  '自动化.md': 'Z-待整理/自动化.md',
  'suwen.md': 'Z-待整理/suwen.md',
  'Web3.0.md': 'Z-待整理/Web3.0.md',
  'Defi 开发.md': 'Z-待整理/Defi开发.md',
  'Web3开发工程师学习计划.md': 'Z-待整理/Web3开发工程师学习计划.md',
  '区块链基础知识25讲.md': 'Z-待整理/区块链基础知识25讲.md',
  '区块链技术与应用.md': 'Z-待整理/区块链技术与应用.md',
  'SOA.md': 'Z-待整理/SOA.md',
  'SMAL2.md': 'Z-待整理/SMAL2.md',
};

// Default tags by category
const defaultTags = {
  '01-计算机科学': ['计算机科学', '操作系统'],
  '02-编程语言': ['编程语言'],
  '03-数据库': ['数据库'],
  '04-大数据': ['大数据'],
  '05-机器学习': ['机器学习', 'AI'],
  '06-投资理财': ['投资理财'],
  '07-英语': ['英语'],
  '08-面试': ['面试'],
  '09-考研': ['考研'],
  '10-生活': ['生活'],
  'Z-待整理': ['待整理'],
};

function processFile(srcPath, targetPath) {
  const content = fs.readFileSync(srcPath, 'utf8');

  // Get file stats for dates
  const stats = fs.statSync(srcPath);
  const created = stats.birthtime.toISOString().split('T')[0];
  const modified = stats.mtime.toISOString().split('T')[0];

  // Normalize line endings to Unix style
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Extract existing frontmatter if present
  let body = normalizedContent;
  let existingTags = [];

  if (normalizedContent.startsWith('---')) {
    // Find the closing --- (must be on its own line)
    const endIndex = normalizedContent.indexOf('\n---\n');
    if (endIndex !== -1) {
      const frontMatter = normalizedContent.substring(3, endIndex); // Skip past opening ---\n

      // Check if frontmatter is effectively empty (just whitespace)
      const fmLines = frontMatter.split('\n').filter(line => line.trim());
      const isEmptyFrontMatter = fmLines.length === 0;

      if (!isEmptyFrontMatter) {
        // Extract existing tags
        const tagsMatch = frontMatter.match(/^tags:\s*\[(.*?)\]/m);
        if (tagsMatch) {
          existingTags = tagsMatch[1].split(',').map(t => t.trim()).filter(t => t);
        }
      }

      // Set body to content after ---\n\n---
      body = normalizedContent.substring(endIndex + 5); // Skip past closing ---\n
    }
  }

  // Determine tags based on path
  const pathTags = [];
  for (const [prefix, tags] of Object.entries(defaultTags)) {
    if (targetPath.includes(prefix)) {
      pathTags.push(...tags);
      break;
    }
  }
  const allTags = existingTags.length > 0 ? existingTags : pathTags;

  // Build frontmatter
  const titleMatch = body.match(/^#\s+(.+)/m);
  let title;
  if (titleMatch) {
    // Extract title from first heading, strip any formatting markers
    title = titleMatch[1]
      .replace(/==+/g, '') // Remove == markers
      .replace(/\*\*/g, '') // Remove ** markers
      .replace(/__+/g, '') // Remove __ markers
      .replace(/`+/g, '') // Remove ` markers
      .replace(/\|/g, '-') // Replace | with - to avoid YAML interpretation issues
      .replace(/\*/g, '') // Remove * to avoid YAML issues
      .trim();
  } else {
    // Use filename
    title = path.basename(targetPath, '.md');
  }

  // Sanitize tags - remove any special chars that could break YAML
  const sanitizedTags = allTags.map(tag => tag
    .replace(/\*/g, '')
    .replace(/\|/g, '-')
    .replace(/`/g, '')
    .replace(/\\/g, '')
    .trim()
  ).filter(t => t);

  const frontMatter = `---\ntitle: ${title}\ndate: ${modified}\nlastmod: ${modified}\ntags: [${sanitizedTags.join(', ')}]\n---\n`;

  // Write file
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write with UTF-8 BOM
  fs.writeFileSync(targetPath, '\uFEFF' + frontMatter + body, 'utf8');
  console.log(`Processed: ${targetPath}`);
}

function walkDir(dir, relativePath = '') {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    // Skip .history directories
    if (item === '.history') continue;

    const fullPath = path.join(dir, item);
    const relPath = relativePath ? `${relativePath}/${item}` : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath, relPath);
    } else if (item.endsWith('.md')) {
      // Find target path
      let targetPath = fileMapping[item];

      if (!targetPath) {
        // Try to find by source path
        for (const [srcPrefix, targetPrefix] of Object.entries(dirMapping)) {
          if (relPath.startsWith(srcPrefix)) {
            targetPath = relPath.replace(srcPrefix, targetPrefix);
            break;
          }
        }
      }

      if (!targetPath) {
        // Default: use filename in root content
        targetPath = `Z-待整理/${item}`;
      }

      targetPath = path.join(targetDir, targetPath);
      processFile(fullPath, targetPath);
    }
  }
}

// Create necessary directories
const dirs = [
  '01-计算机科学/操作系统',
  '02-编程语言/Java',
  '02-编程语言/Go',
  '03-数据库',
  '04-大数据/Hadoop',
  '04-大数据/Spark',
  '04-大数据/Hive',
  '04-大数据/Kafka',
  '04-大数据/Flink',
  '04-大数据/面经',
  '05-机器学习/大模型',
  '06-投资理财/金融三部曲',
  '07-英语',
  '08-面试/面经',
  '09-考研/计算机组成',
  '09-考研/操作系统',
  '10-生活/物品清单',
  'Z-待整理',
];

for (const dir of dirs) {
  const fullDir = path.join(targetDir, dir);
  if (!fs.existsSync(fullDir)) {
    fs.mkdirSync(fullDir, { recursive: true });
  }
}

console.log('Starting migration...');
walkDir(sourceDir);
console.log('Done!');