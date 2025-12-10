---
layout: page
title: 主页
id: home
permalink: /
---
# 🎉 欢迎 🎉

[[关于我]]的[[数字花园]]。

>读[[万卷书]]，扩充精神；练万种术，锻造肉身。

<strong>🧐 近日文章 🧐</strong>

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at_timestamp" | reverse %}
  {% for note in recent_notes limit: 5 %}
    <li>
      {{ note.last_modified_at | date: "%Y-%m-%d" }} — <a class="internal-link" href="{{ site.baseurl }}{{ note.url }}">{{ note.title }}</a>
    </li>
  {% endfor %}
</ul>

<style>
  .wrapper {
    max-width: 46em;
  }
</style>

>虽然肉身被困在钢筋水泥中，但我的灵魂时常在宇宙遨游。

- [[技术栈]]
- 一些[[技术探索]]。
- **🧾 [[人生体验清单]] 🧾**。
- 💰 搜罗全网资料的[[百宝袋]] 💰。
- 💡一些琐碎的想法[[碎碎念]] 💡。

> 什么时候才能形成一套适合自己的稳定的饮食体系！保持食欲稳定真的很难！💥
