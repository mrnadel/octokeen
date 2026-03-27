import re
import sys

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # ============================================================
    # STEP 1: Replace em dashes
    # ============================================================
    # We need context-aware replacement, not blind replace.
    # General patterns:
    #   " — " -> ". " or ", " or ": "
    # For ranges like "$2,000—$10,000" -> "$2,000 to $10,000"

    # First handle em dashes in specific known range patterns (with numbers on both sides)
    content = re.sub(r'(\d)\s*—\s*(\d)', r'\1 to \2', content)

    # Now handle " — " in regular text
    content = content.replace(' — ', '. ')
    # Handle remaining em dashes (attached to words)
    content = content.replace('—', '. ')

    # Fix ugly double-period cases
    content = content.replace('.. ', '. ')

    # ============================================================
    # STEP 2: Fix preachy/condescending tone
    # ============================================================
    content = content.replace(
        "Nope. it's the opposite.",
        "Not quite. It's actually the opposite."
    )
    content = content.replace(
        "Nope. It's the opposite.",
        "Not quite. It's actually the opposite."
    )
    content = content.replace("Nope!", "Not quite.")
    content = content.replace("Nope. The match", "Not quite. The match")
    content = content.replace("Nope. Many happy", "Not quite. Many happy")
    content = content.replace("Not even close. Housing", "Expenses continue. Housing")
    content = content.replace("Is it impossible? Not even close.", "Is it impossible? Far from it.")
    content = content.replace("Ha! Ask any landlord.", "Ask any landlord.")
    content = content.replace("Absolutely not. Banks want", "Not quite. Banks want")
    content = content.replace("Absolutely true.", "Correct.")
    content = content.replace("Absolutely. They're separate", "Yes. They're separate")
    content = content.replace("Absolutely not. A 40-year-old", "Far from it. A 40-year-old")

    # ============================================================
    # STEP 3: Remove options from teaching cards + emoji from teaching questions
    # ============================================================
    lines = content.split('\n')
    result_lines = []
    in_teaching_card = False
    in_teaching_options = False
    teaching_options_depth = 0
    saw_explanation = False

    i = 0
    while i < len(lines):
        line = lines[i]

        # Detect teaching card start
        if 'type: "teaching"' in line:
            in_teaching_card = True
            saw_explanation = False
            result_lines.append(line)
            i += 1
            continue

        # If in teaching card, check for question with emoji prefix
        if in_teaching_card and 'question: "' in line:
            # Remove leading non-ASCII chars (emojis) followed by optional space
            # Match: question: "EMOJI_CHARS SPACE rest..."
            line = re.sub(
                r'(question: ")[^\x00-\x7F]+\s*',
                r'\1',
                line
            )
            result_lines.append(line)
            i += 1
            continue

        # Track explanation in teaching card
        if in_teaching_card and 'explanation:' in line:
            saw_explanation = True

        # If in teaching card, detect options array start
        if in_teaching_card and saw_explanation and re.match(r'\s*options:\s*\[', line):
            in_teaching_options = True
            teaching_options_depth = line.count('[') - line.count(']')
            if teaching_options_depth <= 0:
                in_teaching_options = False
            i += 1
            continue

        # If inside teaching card options, skip lines
        if in_teaching_options:
            teaching_options_depth += line.count('[') - line.count(']')
            if teaching_options_depth <= 0:
                in_teaching_options = False
            i += 1
            continue

        # Detect end of teaching card
        if in_teaching_card:
            # Teaching card ends when we hit hint: or a new card id
            if 'hint:' in line:
                in_teaching_card = False
            elif re.match(r'\s*\},?\s*$', line.strip()) and not in_teaching_options:
                # Closing brace could be end of teaching card
                pass
            elif re.match(r'\s*id: "', line) and saw_explanation:
                in_teaching_card = False
                saw_explanation = False

        result_lines.append(line)
        i += 1

    content = '\n'.join(result_lines)

    # ============================================================
    # STEP 4: Trim teaching card explanations to max 2 sentences
    # ============================================================
    lines = content.split('\n')
    result_lines = []
    in_teaching = False

    for line in lines:
        if 'type: "teaching"' in line:
            in_teaching = True
        elif in_teaching and re.match(r'\s*(type:|id:)', line):
            # Check if it's a new card (not the teaching card's own id)
            if 'type:' in line:
                in_teaching = False
            elif 'id:' in line and not re.search(r'-T\d+', line):
                in_teaching = False

        if in_teaching and 'explanation: "' in line:
            exp_match = re.match(r'^(\s*explanation: ")(.*?)(",?\s*)$', line)
            if exp_match:
                prefix = exp_match.group(1)
                text = exp_match.group(2)
                suffix = exp_match.group(3)
                # Split into sentences
                # Use a regex that splits on sentence-ending punctuation followed by space and capital letter
                sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text)
                if len(sentences) > 2:
                    trimmed = ' '.join(sentences[:2])
                    if not trimmed.rstrip().endswith(('.', '!', '?', '"')):
                        trimmed = trimmed.rstrip() + '.'
                    line = prefix + trimmed + suffix

        result_lines.append(line)

    content = '\n'.join(result_lines)

    # ============================================================
    # STEP 5: Final cleanup
    # ============================================================
    # Fix double periods
    content = content.replace('..', '.')
    # Fix period before comma
    content = content.replace('.,', ',')
    # Fix ". ."
    content = content.replace('. .', '.')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Fixed: {filepath}")


if __name__ == '__main__':
    for fpath in sys.argv[1:]:
        fix_file(fpath)
