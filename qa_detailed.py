import re, os
from xml.etree import ElementTree as ET

qdir = "C:/Users/mrnad/OneDrive/Desktop/Mechanical Practice/src/data/questions"
files = ["engineering-mechanics.ts", "strength-of-materials.ts", "thermodynamics.ts", "heat-transfer.ts", "fluid-mechanics.ts", "materials-engineering.ts", "manufacturing.ts", "machine-elements.ts", "design-tolerancing.ts", "vibrations.ts", "real-world-mechanisms.ts"]

STANDARD_COLORS = {"#94a3b8", "#60a5fa", "#f472b6", "#e2e8f0"}
ACCEPTABLE_COLORS = STANDARD_COLORS | {"#334155", "#34d399", "#fb923c", "none", "#fff", "#ffffff", "#000", "#000000"}

issues = []
total_questions = 0
total_diagrams = 0

for f in files:
    filepath = os.path.join(qdir, f)
    with open(filepath, encoding="utf-8") as fh:
        content = fh.read()

    # Extract question blocks
    id_matches = list(re.finditer(r"id:\s*'([a-z]+-\d+)'", content))

    for i, m in enumerate(id_matches):
        total_questions += 1
        qid = m.group(1)
        start = m.start()
        end = id_matches[i+1].start() if i+1 < len(id_matches) else len(content)
        block = content[start:end]

        # Extract diagram
        diagram_match = re.search(r"diagram:\s*`(.*?)`", block, re.DOTALL)
        if not diagram_match:
            issues.append((f, qid, "MISSING", "No diagram field found"))
            continue

        total_diagrams += 1
        svg_str = diagram_match.group(1)

        # 1. SVG XML validity check
        try:
            ET.fromstring(svg_str)
        except ET.ParseError as e:
            issues.append((f, qid, "INVALID_XML", f"XML parse error: {e}"))

        # 2. Check for viewBox
        if 'viewBox=' not in svg_str:
            issues.append((f, qid, "NO_VIEWBOX", "Missing viewBox attribute"))

        # 3. Check for proper xmlns
        if 'xmlns=' not in svg_str:
            issues.append((f, qid, "NO_XMLNS", "Missing xmlns attribute"))

        # 4. Check ID uniqueness prefix
        id_prefix = qid.replace("-", "")
        svg_ids = re.findall(r'\bid="([^"]*)"', svg_str)
        non_prefixed = [sid for sid in svg_ids if not sid.startswith(id_prefix)]
        if non_prefixed:
            issues.append((f, qid, "ID_PREFIX", f"IDs not prefixed with {id_prefix}: {non_prefixed[:5]}"))

        # 5. Check colors used
        stroke_colors = re.findall(r'stroke="(#[0-9a-fA-F]+)"', svg_str)
        fill_colors = re.findall(r'fill="(#[0-9a-fA-F]+)"', svg_str)
        text_fill_colors = []  # special check for text elements
        all_colors = set(stroke_colors + fill_colors)
        unusual = all_colors - ACCEPTABLE_COLORS
        if unusual:
            issues.append((f, qid, "UNUSUAL_COLOR", f"Non-standard colors: {unusual}"))

        # 6. Check for unescaped special characters that could break template literals
        if '${' in svg_str:
            issues.append((f, qid, "TEMPLATE_INJECTION", "Contains ${ which may cause template literal issues"))
        if '\\' in svg_str and '\\n' not in svg_str:
            pass  # backslashes are ok in SVG paths

        # 7. Check text fill color is #e2e8f0
        text_fills = re.findall(r'<text[^>]*fill="(#[0-9a-fA-F]+)"', svg_str)
        non_standard_text = [c for c in text_fills if c not in {"#e2e8f0", "#60a5fa", "#f472b6", "#34d399", "#fb923c", "#94a3b8"}]
        if non_standard_text:
            issues.append((f, qid, "TEXT_COLOR", f"Non-standard text colors: {set(non_standard_text)}"))

print(f"Total questions: {total_questions}")
print(f"Total diagrams: {total_diagrams}")
print(f"Issues found: {len(issues)}")
print()

if issues:
    for f, qid, issue_type, desc in issues:
        print(f"  [{issue_type}] {f} :: {qid} - {desc}")
else:
    print("  No issues found!")
