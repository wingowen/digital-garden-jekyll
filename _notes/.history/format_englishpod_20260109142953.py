import os
import re

def parse_dialogues(content):
    dialogues = []
    
    lines = content.split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        if not line or line.startswith('---') or 'Englishpod Dialogues' in line or '淘宝店铺' in line or line.isdigit():
            i += 1
            continue
        
        if re.match(r'^[A-Z][a-z]+', line) and '(' in line and ')' in line:
            title_match = re.search(r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*\([^)]+\)', line)
            if title_match:
                title = title_match.group(1)
                sentences = []
                current_sentence = []
                j = i + 1
                while j < len(lines):
                    next_line = lines[j].strip()
                    
                    if not next_line or next_line.startswith('---') or 'Englishpod Dialogues' in next_line or '淘宝店铺' in next_line or next_line.isdigit():
                        j += 1
                        continue
                    
                    if re.match(r'^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s*\([^)]+\)', next_line):
                        break
                    
                    if next_line and len(next_line) > 2:
                        if next_line[0].isupper() and ':' in next_line:
                            if current_sentence:
                                full_sentence = ' '.join(current_sentence)
                                sentences.append(full_sentence)
                                current_sentence = []
                            clean_line = re.sub(r'^[A-Z]:\s*', '', next_line)
                            current_sentence.append(clean_line)
                        else:
                            current_sentence.append(next_line)
                    
                    j += 1
                
                if current_sentence:
                    full_sentence = ' '.join(current_sentence)
                    sentences.append(full_sentence)
                
                if sentences:
                    dialogues.append({
                        'title': title,
                        'sentences': sentences
                    })
                
                i = j
            else:
                i += 1
        else:
            i += 1
    
    return dialogues

def format_dialogue(dialogue):
    result = dialogue['title'] + '\n'
    for sentence in dialogue['sentences']:
        result += '- ' + sentence + '\n'
    return result + '\n'

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    dialogues = parse_dialogues(content)
    
    result = ''
    for dialogue in dialogues:
        result += format_dialogue(dialogue)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(result)

def main():
    folder = r'd:\digital-garden-jekyll\_notes\EnglishPod'
    
    for i in range(1, 102):
        file_name = f'page_{i:03d}.txt'
        file_path = os.path.join(folder, file_name)
        
        if os.path.exists(file_path):
            print(f'Processing {file_name}...')
            process_file(file_path)
            print(f'Completed {file_name}')

if __name__ == '__main__':
    main()
