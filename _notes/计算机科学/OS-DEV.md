---
tags: "CS"
---

<object data="/assets/pdfs/os-dev.pdf" type="application/pdf" width="100%" height="800" style="”border:"></object>

```
brew install bochs sdl nasm
```

[手写一个简单的操作系统](https://jaylinh-com.github.io/os-dev/doc/introduction.html)

# The Boot Process

BIOS: Basic Input / Output Software
- BIOS provides auto-detection and basic control of your computer’s essential devices,  such as the screen, keyboard, and hard disks.
- The easiest place for BIOS to find our OS is in the first sector of one of the disks, known as the boot sector.
- BIOS instructs the CPU to begin executing the first boot sector it finds that ends with the magic number 0xaa55.




