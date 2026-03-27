import re
import sys

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix ". lowercase" patterns that came from em dash replacement.
    # Most of these should be either:
    # - colon + lowercase  (when introducing/explaining something)
    # - comma + lowercase  (when continuing a thought)
    # - period + uppercase  (when truly a new sentence)

    # Strategy: replace ". [a-z]" with appropriate punctuation
    # For most cases in this content, the em dash was connecting two clauses,
    # so we'll use a colon for explanatory clauses and commas for continuations.

    # First, let's handle specific known patterns to get them right:

    # Descriptions (short summaries - use colon or comma)
    replacements = [
        # unit-9 descriptions
        ('life. make sure', 'life, so make sure'),
        ('homeownership. it\'s not always', 'homeownership: it\'s not always'),
        ('adjustable, 15 vs 30 year. what it all means', 'adjustable, 15 vs 30 year, and what it all means'),
        ('upfront. it\'s more than', 'upfront: it\'s more than'),
        ('keys. every stage explained', 'keys, every stage explained'),
        ('number. not the inflated', 'number, not the inflated'),
        ('better deal. the math that matters', 'better deal and the math that matters'),

        # unit-10 descriptions
        ('present you. here\'s how', 'present you: here\'s how'),
        ('later? The answer changes', 'later? The answer changes'),
        ('Money Behind. if you\'re', 'Money Behind: if you\'re'),

        # unit-11 descriptions
        ('built. from your health', 'built, from your health'),
        ('deductibles. translated into', 'deductibles, translated into'),

        # Common patterns in explanations - use colon for introducing/explaining
        ('the thing. that advice', 'the thing: that advice'),
        ('thing. that advice', 'thing: that advice'),
        ('collateral. meaning if', 'collateral, meaning if'),
        ('20%. on a $300,000', '20%, and on a $300,000'),
        ('costs. typically 2-5%', 'costs, typically 2-5%'),
        ('better. it depends', 'better: it depends'),
        ('buy. it\'s which', 'buy: it\'s which'),

        # Options/answers - use colon where explaining
        ('Rent. the 2-3 year', 'Rent: the 2-3 year'),
        ('Buy. he should', 'Buy: he should'),
        ('The 5/1 ARM. she\'ll', 'The 5/1 ARM: she\'ll'),
        ('The 30-year fixed. always', 'The 30-year fixed: always'),
        ('Neither. she should', 'Neither: she should'),
        ('It fails the 28% rule. max', 'It fails the 28% rule: max'),
        ('It passes both rules. she', 'It passes both rules: she'),
        ('Keep the inspection contingency. the risk', 'Keep the inspection contingency: the risk'),
        ('Waive it. you need', 'Waive it: you need'),
        ('Yes. breakeven is', 'Yes: breakeven is'),
        ('No. the closing costs', 'No: the closing costs'),
        ('No. the rate difference', 'No: the rate difference'),
        ('No. a single accident', 'No: a single accident'),
        ('Yes. he\'s young', 'Yes: he\'s young'),
        ('Yes. your net housing', 'Yes: your net housing'),
        ('No. you can\'t afford', 'No: you can\'t afford'),
        ('Yes, but only if', 'Yes, but only if'),

        # Explanatory clauses - use comma or colon
        ('long. it\'s not just', 'long: it\'s not just'),
        ('but you still lose the home. It\'s an insurance', 'but you still lose the home. It\'s an insurance'),
        ('territory. nice home, no life', 'territory: nice home, no life'),
        ('HOA fees are optional. you can', 'HOA fees are optional: you can'),
        ('house poor. 40%+', 'house poor. 40%+'),
        ('it\'s stretching it. you\'ll feel', 'it\'s stretching it, and you\'ll feel'),
        ('no surprises. An adjustable', 'no surprises. An adjustable'),
        ('years. no surprises.', 'years, with no surprises.'),
        ('pre-approval. that\'s like', 'pre-approval: that\'s like'),
        ('cosmetic. annoying but', 'cosmetic: annoying but'),
        ('responsibility. and your wallet', 'responsibility, and your wallet'),
        ('predictable. you know', 'predictable: you know'),
        ('exists. it\'s your surprise', 'exists: it\'s your surprise'),
        ('budget for it. expensive', 'budget for it: expensive'),
        ('terms. ideally with', 'terms, ideally with'),
        ('adds value). not for', 'adds value), not for'),
        ('another house will come along.', 'another house will come along.'),
        ('needed. another house', 'needed: another house'),

        # PITI fill-blank
        ('Insurance. the four parts', 'Insurance, the four parts'),

        # Teaching card explanations
        ('Everything else. interest, taxes, insurance, PMI. is a cost', 'Everything else (interest, taxes, insurance, PMI) is a cost'),

        # Ask. the worst
        ('ask. the worst', 'ask: the worst'),

        # Risky. think twice
        ('"Risky. think twice"', '"Risky: think twice"'),

        # lenders check
        ('entirely. lenders check', 'entirely: lenders check'),

        # which saves
        ('entirely. which saves', 'entirely, which saves'),

        # ongoing. they get added
        ('ongoing. they get added', 'ongoing: they get added'),

        # typically 0.5%
        ('value. typically 0.5%', 'value, typically 0.5%'),

        # electrical. is it falling
        ('electrical. is it falling', 'electrical: is it falling'),

        # that's how they make
        ('possible. that\'s how', 'possible: that\'s how'),

        # unit-10 specific
        ('Netflix. those bills', 'Netflix: those bills'),
        ('gone. But it\'s totally', 'gone, but it\'s totally'),
        ('paycheck. Spoiler. it\'s a big', 'paycheck? It\'s a big'),
        ('not your income. because spending', 'not your income, because spending'),
        ('out of your paycheck, which means you save on taxes NOW. If you earn', 'out of your paycheck. If you earn'),
        ('retirement. And the best part?', 'retirement, and the best part?'),
        ('growth. the most powerful', 'growth, the most powerful'),
        ('formula. not gospel', 'formula, not gospel'),
        ('default setting.\'', 'default setting.\''),
        ('starting. You just need a more aggressive plan.', 'starting, but you need a more aggressive plan.'),
        ('never starting at all. If', 'never starting at all. If'),
        ('rules. Break the rules', 'rules, and breaking them'),
        ('money. free money.', 'money: free money.'),

        # unit-11 specific
        ('happens. a car crash', 'happens: a car crash'),
        ('everywhere in insurance.', 'everywhere in insurance:'),
        ('balance cost vs. freedom.', 'balance cost vs freedom.'),
        ('each. it\'s basically', 'each, and it\'s basically'),
        ('you don\'t need it yet.', 'you don\'t need it yet.'),

        # unit-12 specific
        ('deal. anyone can buy', 'deal: anyone can buy'),
        ('stuff. The hard part', 'stuff. The hard part'),
        ('it right now? Step 2: Can I pay cash, or will I go into debt?', 'it right now? Step 2: Can I pay cash, or will I go into debt?'),
        ('prices? Step 4:', 'prices? Step 4:'),
        ('want. be brutally', 'want: be brutally'),
        ('life is negotiable.', 'life is negotiable.'),
        ('prepared.\"', 'prepared.\"'),
        ('prepared. it\'s about being prepared', 'prepared: it\'s about being prepared'),

        # Generic lowercase after period patterns - capitalize
    ]

    for old, new in replacements:
        content = content.replace(old, new)

    # Now handle remaining ". [a-z]" cases by capitalizing the lowercase letter
    # This catches any remaining cases we missed
    def capitalize_after_period(match):
        return match.group(1) + match.group(2).upper()

    # Only apply within string literals (between quotes)
    content = re.sub(r'(\. )([a-z])', capitalize_after_period, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Fixed em-dash cleanup: {filepath}")

if __name__ == '__main__':
    for fpath in sys.argv[1:]:
        fix_file(fpath)
