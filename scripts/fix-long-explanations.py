import sys

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Each replacement: (old, new)
    replacements = []

    if 'unit-9' in filepath:
        replacements = [
            # Line ~689: Refinancing
            (
                'Refinancing means replacing your current mortgage with a brand-new loan. Ideally with better terms. Maybe rates dropped and you can save hundreds per month.',
                'Refinancing means replacing your current mortgage with a brand-new loan, ideally with better terms. Maybe rates dropped and you can save hundreds per month.'
            ),
            # Line ~920: Cash flow
            (
                "Cash flow is what's left after ALL expenses are paid. Gross rent minus: mortgage payment, property taxes, insurance, maintenance (budget 10% of rent), vacancy (budget 5-8% of rent), property management (8-10% if you hire someone), and capital expenditures (roof, HVAC, etc. Budget 5-10% of rent).",
                "Cash flow is what's left after ALL expenses are paid: rent minus mortgage, taxes, insurance, maintenance (10%), vacancy (5-8%), management (8-10%), and capital expenditures (5-10%). A $2,000/month rental might only cash flow $200-$400/month after everything."
            ),
            # Line ~1244: Real estate mistakes
            (
                "Real estate mistakes don't cost hundreds. They cost tens of thousands. Overpaying by 5% on a $350,000 home?",
                "Real estate mistakes don't cost hundreds; they cost tens of thousands. Every common mistake is avoidable with education and patience."
            ),
            # Line ~1251: Emotions
            (
                "Here's why smart people make dumb real estate decisions: emotions. You walk into a home with granite countertops, a beautiful backyard, and that perfect kitchen. And suddenly you NEED it.",
                "Smart people make dumb real estate decisions because of emotions. Always run the numbers BEFORE you see the house, set a max price, and stick to it."
            ),
        ]

    elif 'unit-10' in filepath:
        replacements = [
            # IRA
            (
                "An IRA (Individual Retirement Account) is a retirement account you open yourself. No employer needed. There are two main types: Traditional IRA and Roth IRA.",
                "An IRA (Individual Retirement Account) is a retirement account you open yourself, no employer needed. The two main types are Traditional (tax break now, pay later) and Roth (pay now, tax-free later)."
            ),
            # Roth IRA popular
            (
                "The Roth IRA is wildly popular. Especially for younger people. Why?",
                "The Roth IRA is wildly popular, especially for younger people. You pay taxes on the money going in, and then everything comes out completely tax-free in retirement."
            ),
            # Match formula
            (
                "Let's break down the most common match formula: '50% match up to 6%.' If your salary is $60,000 and you contribute 6% ($3,600/year), your employer adds 50% of that. So $1,800. But if you only contribute 3% ($1,800), your employer only adds $900.",
                "Let's break down the most common match formula: '50% match up to 6%.' If your salary is $60,000 and you contribute 6% ($3,600/year), your employer adds 50% of that, so $1,800."
            ),
            # Social Security
            (
                "You can start collecting Social Security as early as age 62. But you'll get a reduced benefit (about 30% less). Full benefits kick in at your 'full retirement age' which is 67 for most people born after 1960.",
                "You can start collecting Social Security as early as age 62, but you'll get a reduced benefit (about 30% less). Full benefits kick in at your 'full retirement age,' which is 67 for most people born after 1960."
            ),
            # Late start
            (
                "Here's the truth: starting late is worse than starting early, but it's infinitely better than never starting at all. If you're 35, 40, or even 50 and have nothing saved. You're not doomed.",
                "Starting late is worse than starting early, but it's infinitely better than never starting at all. If you're 35, 40, or even 50 and have nothing saved, you're not doomed."
            ),
            # Late-starter playbook
            (
                "If you're starting at 40 with zero savings, here's the playbook: (1) Get the employer match immediately. That's an instant 50-100% return. (2) Save at least 20-25% of income (vs the usual 15%). (3) Consider a Roth IRA on top of your 401(k). (4) Cut major expenses aggressively. Downsize, eliminate car payments, slash subscriptions. (5) Plan to work 2-3 years longer than average. (6) At 50, use catch-up contributions to supercharge your savings. Every year matters more when you start late.",
                "If you're starting at 40 with zero savings, here's the playbook: get the employer match, save 20-25% of income, add a Roth IRA, cut expenses aggressively, and plan to work 2-3 years longer. At 50, use catch-up contributions to supercharge your savings."
            ),
            # 50+ Power-Up
            (
                "Once you turn 50, the IRS gives you a bonus: you can contribute MORE to your retirement accounts than younger workers. For 401(k)s, you get an extra $7,500/year on top of the $23,000 limit. For a total of $30,500.",
                "Once you turn 50, the IRS gives you a bonus: you can contribute MORE to your retirement accounts than younger workers. For 401(k)s, you get an extra $7,500/year on top of the $23,000 limit, for a total of $30,500."
            ),
        ]

    elif 'unit-11' in filepath:
        replacements = [
            # Auto insurance
            (
                "Auto insurance isn't one thing. It's a stack of coverages. Liability: pays for damage YOU cause to others (their car, their medical bills).",
                "Auto insurance isn't one thing; it's a stack of coverages. Liability pays for damage you cause to others, collision covers your car in a crash, and comprehensive covers non-accident damage like theft or weather."
            ),
            # Landlord insurance
            (
                "Big misconception: your landlord has insurance on the building, but it covers the structure. Not your belongings inside it. If there's a fire, flood, or burglary, your laptop, clothes, furniture, and everything you own?",
                "Big misconception: your landlord's insurance covers the building structure, not your belongings inside it. Renter's insurance covers your personal property, liability, and additional living expenses for around $15-25/month."
            ),
            # Skip insurance
            (
                "Here's the golden rule for deciding when to skip insurance: if you can comfortably absorb the loss, skip the insurance and pocket the premium savings. Insurance is for catastrophic risks you can't afford. Not for small, manageable losses.",
                "Here's the golden rule: if you can comfortably absorb the loss, skip the insurance and pocket the premium savings. Insurance is for catastrophic risks you can't afford, not for small, manageable losses."
            ),
            # Identity theft
            (
                "In 2023, Americans lost over $10 billion to fraud. Identity theft is the most common type. Someone uses your personal info to open credit cards, file tax returns, or drain bank accounts in your name.",
                "In 2023, Americans lost over $10 billion to fraud, with identity theft being the most common type. Someone uses your personal info to open credit cards, file tax returns, or drain bank accounts in your name."
            ),
            # Credit freeze
            (
                "A credit freeze is the single most effective thing you can do to prevent identity theft. It locks your credit reports at all three bureaus (Equifax, Experian, TransUnion) so nobody. Including you. Can open new accounts.",
                "A credit freeze is the single most effective thing you can do to prevent identity theft. It locks your credit reports at all three bureaus so nobody (including you) can open new accounts until you temporarily unfreeze."
            ),
        ]

    elif 'unit-12' in filepath:
        replacements = [
            # Negotiation playbook
            (
                "Here's the playbook that works everywhere. Step 1: Research. Know the market rate, competitor prices, or what others pay.",
                "Here's the playbook that works everywhere: research the market rate, ask for more than you expect, listen to their counter, be willing to walk away, and get it in writing. The person with the most information and the least desperation always wins."
            ),
            # FI definition
            (
                "Financial independence (FI) means your passive income covers all your living expenses. You don't HAVE to work. You CHOOSE to.",
                "Financial independence (FI) means your passive income covers all your living expenses, so you don't HAVE to work. The formula is simple: Annual Expenses x 25 = your FI number."
            ),
            # Two levers
            (
                "There are only two ways to reach FI faster: earn more or spend less. But here's the key insight. Spending less is DOUBLY powerful.",
                "There are only two ways to reach FI faster: earn more or spend less. Spending less is DOUBLY powerful because it both saves more AND lowers your FI number."
            ),
            # Congratulations
            (
                "Congratulations. You've learned more about money than most adults ever will. Budgeting, saving, debt management, credit, taxes, investing, retirement, insurance, and big money moves.",
                "You've now learned more about money than most adults ever will. Your Lifetime Money Action Plan is a living document that evolves as your life changes."
            ),
        ]

    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
        else:
            print(f"  WARNING: Could not find text to replace in {filepath.split('/')[-1]}: {old[:60]}...")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Fixed long explanations: {filepath}")


if __name__ == '__main__':
    for fpath in sys.argv[1:]:
        fix_file(fpath)
