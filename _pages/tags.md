---
title: 标签
layout: page
permalink: /tags
---

<div class="tag-container">
  {% for tag in site.tags %}
  <span class="tag"><a href="#{{tag.name}}">{{ tag.name }}</a></span>
  {% endfor %}
</div>

---

{% for tag in site.tags %}
  <h2 id="{{ tag.slug }}">{{ tag.name }}</h2>
  <ul>
  {% for note in site.notes %}
    {% if note.tags contains tag.name %}
      <li><a href="{{ note.url }}">{{ note.title }}</a></li>
    {% endif %}
  {% endfor %}
  </ul>
{% endfor %}