---
layout: page
title: Home
id: home
permalink: /
---

# 🎉 欢迎 🎉

[[关于我]]的[[数字花园]]。

我希望我
- 去运动健身，保持健康的身体和体态。
- 去阅读，时常思考，保持大脑之清醒，精神之活跃。
- 去旅居，感受世界文化，保持对人与自然本身之敏感。

>读[[万卷书]]，扩充精神世界；练[[万种术]]，探索肉身极限。

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

**🧾 人生体验清单 🧾**
- 成为自由职业者，体验房车生活，旅居中国，然后旅居世界。
- 要去冲浪 🏄‍♀️、滑雪 ⛷、浮潜 🤿。
- 台湾环岛骑行 🚴。参加世界各地的马拉松 🏃。
- 去看一次非洲动物大迁徙。
- 成为世界慈善组织的志愿者，去帮助世界上需要帮助的人。
- 去寺庙或者道馆习武、打坐 🧘‍♂️、修行。

不要和我杠实现的可能性，人这一生总是充满着遗憾。想到什么就写，管它是否真的能实现，要是实现了呢？
