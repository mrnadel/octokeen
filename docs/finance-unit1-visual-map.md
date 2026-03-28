# Finance Unit 1: Visual Map

> "Your Money Right Now" - visual plan for every lesson and key questions.
> Diagrams use the `diagram` field (inline SVG string).

## Design Principles for Finance Visuals

- Simple infographic style (not complex charts)
- Duolingo palette colors (no gray, no outlines)
- Coin stacks, bar charts, pie charts, arrows, icons
- Max 300px tall, full width
- Dark text on light backgrounds works in the app's white card context

---

## Lesson 0: Small Money, Big Difference

| Question | Visual | Description |
|----------|--------|-------------|
| T1 (teaching) | **Coin growth staircase** | 3 coin stacks growing: $1, $30, $365 with labels "day", "month", "year" |
| Q1 (daily savings) | none needed (simple math) | |
| T2 (teaching) | **Timeline arrow** | Arrow from left to right: "$1/day" -> "$30/month" -> "$365/year" with growing coin icons |
| Q5 (category-swipe) | none (swipe cards are visual enough) | |
| Q6 (save $5/day) | **Piggy bank filling** | Piggy bank with $150 inside, coins dropping in |

## Lesson 4: The Latte Factor

| Question | Visual | Description |
|----------|--------|-------------|
| T1 (teaching) | **Coffee cup with price tag** | Coffee cup with "$5" tag, x365 arrow pointing to "$1,825/year" stack |
| Q3 (match pairs) | none (match pairs have built-in visual) | |
| T3 (teaching) | **Awareness meter** | Not "never buy coffee" - show balance scale with coffee cup vs savings jar |
| Q8 ($6 lunch yearly) | **Lunch tray with calculator** | $6 x 250 = $1,500/year shown visually |

## Lesson 2: Where It All Goes

| Question | Visual | Description |
|----------|--------|-------------|
| T1 (teaching) | **Pie chart of spending** | Colorful pie: Rent 35%, Food 20%, Transport 10%, Fun 15%, Subs 10%, Other 10% |
| T2 (teaching) | **Fixed vs Variable bars** | Two columns: Fixed (green, solid) = Rent, Insurance, Phone. Variable (orange, striped) = Food, Gas, Fun |
| T3 (teaching) | **Subscription ghost** | Ghost-like icons for Netflix, Spotify, Gym with "$38/month = $456/year" |
| Q4 (subscription total) | **Subscription stack** | 3 service icons stacking up: $13 + $10 + $15 = $38/month |

## Lesson 1: The Paycheck Reality

| Question | Visual | Description |
|----------|--------|-------------|
| T1 (teaching) | **Paycheck breakdown bar** | Full bar "$4,000 Gross" with colored sections sliced off: Federal tax, State tax, FICA, leaving "$3,200 Net" |
| T2 (teaching) | **Tax flow diagram** | Money arrow splits into: Roads, Schools, Hospitals, Fire dept icons |
| T3 (teaching) | **Gross vs Net side by side** | Two money stacks: tall "Gross $4,000" and shorter "Net $3,200" with arrow showing "$800 taxes" leaving |

## Lesson 3: Needs vs Wants

| Question | Visual | Description |
|----------|--------|-------------|
| T1 (teaching) | **Two columns** | Left (green): house, food, bus. Right (orange): gaming, restaurant, designer shoes |
| T2 (teaching) | **Upgrade ladder** | Basic need at bottom -> upgrade -> premium. E.g.: Bus $2 -> Used car $300/mo -> New BMW $800/mo |
| T3 (teaching) | **Gray zone spectrum** | Gradient bar from "Clear Need" to "Clear Want" with items placed along it |

## Lesson 5: Your First Budget

| Question | Visual | Description |
|----------|--------|-------------|
| T1 (teaching) | **Budget = a plan** | Simple box divided into labeled sections with dollar signs |
| T2 (teaching) | **50/30/20 pie chart** | Big colorful pie: 50% Needs (green), 30% Wants (blue), 20% Savings (gold) |
| Q3 ($4,000 budget) | **$4,000 bar split** | Horizontal bar: $2,000 needs | $1,200 wants | $800 savings |
| T3 (teaching) | **Automation flow** | Paycheck icon -> auto-arrow -> Savings ($800) and Checking ($3,200) |

## Lesson 6: Pay Yourself First

| Question | Visual | Description |
|----------|--------|-------------|
| T1 (teaching) | **Two paths** | Path A (wrong): Paycheck -> Spend -> Nothing left. Path B (right): Paycheck -> Save first -> Spend rest |
| T2 (teaching) | **$500 emergency fund target** | Progress bar filling to $500 with milestone markers |
| T3 (teaching) | **Small start growing** | $25/month -> $50/month -> $100/month stepping stones |

---

## SVG Style Guide for Finance Diagrams

- ViewBox: `0 0 320 180` (wide format, fits card)
- Colors from Duolingo palette:
  - Green (needs/good): #58CC02
  - Blue (wants/info): #1CB0F6
  - Gold (savings/money): #FFC800
  - Orange (warning/variable): #FF9600
  - Red (bad/loss): #FF4B4B
  - Purple (special): #CE82FF
- Text: #4B4B4B (Eel), font-weight bold, system-ui
- No outlines on shapes
- Rounded corners everywhere (rx=8 minimum)
- No gradients
