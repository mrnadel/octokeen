import re
import sys

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find teaching card question lines with unicode escape emojis
    # Pattern in the file: question: "\u{1F9EE} Meet Future You",
    # In the raw string, these are literal backslash-u-{hex}

    lines = content.split('\n')
    result_lines = []
    in_teaching = False

    for line in lines:
        if 'type: "teaching"' in line:
            in_teaching = True

        if in_teaching and 'question: "' in line:
            # Remove \u{XXXX} sequences (possibly chained) followed by optional space
            # In the raw file, \u{1F9EE} is the literal characters: \, u, {, 1, F, 9, E, E, }
            line = re.sub(r'(question: ")((?:\\u\{[0-9A-Fa-f]+\})+\s*)', r'\1', line)
            in_teaching = False
        elif in_teaching and re.match(r'\s*(id:|type:)', line) and 'type: "teaching"' not in line:
            in_teaching = False

        result_lines.append(line)

    content = '\n'.join(result_lines)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Fixed unicode emojis: {filepath}")

if __name__ == '__main__':
    for fpath in sys.argv[1:]:
        fix_file(fpath)
