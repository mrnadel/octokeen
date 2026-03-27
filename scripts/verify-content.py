import re
import sys

files = [
    'src/data/course/professions/personal-finance/units/unit-9.ts',
    'src/data/course/professions/personal-finance/units/unit-10.ts',
    'src/data/course/professions/personal-finance/units/unit-11.ts',
    'src/data/course/professions/personal-finance/units/unit-12.ts',
]

all_pass = True

for filepath in files:
    print(f"\n=== {filepath.split('/')[-1]} ===")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')

    # Check 1: Em dashes
    emdash_count = content.count('\u2014')
    status = 'PASS' if emdash_count == 0 else 'FAIL'
    if status == 'FAIL':
        all_pass = False
    print(f"  Em dashes: {emdash_count} {status}")

    # Check 2: Teaching card options
    in_teaching = False
    saw_explanation = False
    teaching_options_count = 0
    for line in lines:
        if 'type: "teaching"' in line:
            in_teaching = True
            saw_explanation = False
        elif in_teaching and 'explanation:' in line:
            saw_explanation = True
        elif in_teaching and saw_explanation and re.match(r'\s*options:\s*\[', line):
            teaching_options_count += 1
        elif in_teaching and 'hint:' in line:
            in_teaching = False
            saw_explanation = False
    status = 'PASS' if teaching_options_count == 0 else 'FAIL'
    if status == 'FAIL':
        all_pass = False
    print(f"  Teaching options: {teaching_options_count} {status}")

    # Check 3: Emoji-prefixed teaching questions
    in_teaching = False
    emoji_count = 0
    for line in lines:
        if 'type: "teaching"' in line:
            in_teaching = True
        elif in_teaching and 'question: "' in line:
            match = re.search(r'question: "(.)', line)
            if match:
                first_char = match.group(1)
                # Check for literal emoji
                if ord(first_char) > 127:
                    emoji_count += 1
                    print(f"    Emoji found: {line.strip()[:80]}")
            # Check for unicode escape
            if re.search(r'question: "\\\\u\{', line) or re.search(r'question: "\\u\{', line):
                emoji_count += 1
                print(f"    Unicode emoji found: {line.strip()[:80]}")
            in_teaching = False
    status = 'PASS' if emoji_count == 0 else 'FAIL'
    if status == 'FAIL':
        all_pass = False
    print(f"  Emoji-prefixed teaching titles: {emoji_count} {status}")

    # Check 4: Preachy tone
    preachy_patterns = ['Nope!', 'Obviously!', 'Not even close', 'Classic mistake', 'Classic excuse']
    preachy_count = 0
    for pattern in preachy_patterns:
        count = content.count(pattern)
        if count > 0:
            preachy_count += count
            print(f"    Found '{pattern}': {count}")
    status = 'PASS' if preachy_count == 0 else 'FAIL'
    if status == 'FAIL':
        all_pass = False
    print(f"  Preachy tone: {preachy_count} {status}")

    # Check 5: Teaching explanations > 2 sentences
    in_teaching = False
    long_count = 0
    for line in lines:
        if 'type: "teaching"' in line:
            in_teaching = True
        elif in_teaching and 'explanation: "' in line:
            exp_match = re.search(r'explanation: "(.*?)"', line)
            if exp_match:
                text = exp_match.group(1)
                sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text)
                if len(sentences) > 2:
                    long_count += 1
                    print(f"    Long ({len(sentences)} sentences): {text[:80]}...")
            in_teaching = False
    status = 'PASS' if long_count == 0 else 'FAIL'
    if status == 'FAIL':
        all_pass = False
    print(f"  Teaching explanations > 2 sentences: {long_count} {status}")

print(f"\n=== OVERALL: {'ALL PASS' if all_pass else 'SOME FAILURES'} ===")
