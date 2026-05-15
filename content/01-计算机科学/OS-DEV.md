---
title: OS-DEV
date: 2025-09-01
lastmod: 2025-09-01
tags: [璁＄畻鏈虹瀛
---

<object data="/assets/pdfs/os-dev.pdf" type="application/pdf" width="100%" height="800" style="鈥漛order:"></object>

```
brew install bochs sdl nasm
```

[鎵嬪啓涓€涓畝鍗曠殑鎿嶄綔绯荤粺](https://jaylinh-com.github.io/os-dev/doc/introduction.html)

# The Boot Process

BIOS: Basic Input / Output Software
- BIOS provides auto-detection and basic control of your computer's essential devices,  such as the screen, keyboard, and hard disks.
- The easiest place for BIOS to find our OS is in the first sector of one of the disks, known as the boot sector.
- BIOS instructs the CPU to begin executing the first boot sector it finds that ends with the magic number 0xaa55.