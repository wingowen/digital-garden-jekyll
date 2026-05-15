from pypdf import PdfReader
import os

pdf_path = r'd:\digital-garden-jekyll\_notes\EnglishPod\Englishpod-1-365-纯对话+完美打印版.pdf'
output_dir = r'd:\digital-garden-jekyll\_notes\EnglishPod'

reader = PdfReader(pdf_path)
total_pages = len(reader.pages)

print(f"总页数: {total_pages}")

for i, page in enumerate(reader.pages):
    text = page.extract_text()
    
    filename = f"page_{i+1:03d}.txt"
    output_path = os.path.join(output_dir, filename)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(f"--- 第 {i+1} 页 ---\n\n")
        f.write(text)
    
    print(f"已保存: {filename}")

print(f"\n完成！共提取 {total_pages} 页文本")
