# WCAG Violations Quick Reference

## Summary Statistics
- **Total Components Modified:** 7
- **Total Violations:** 40+
- **WCAG Level A Violations:** 30+
- **WCAG Level AA Violations:** 10+

---

## Violations by File

### 1. `src/components/weather/WeatherCard.tsx`
- ❌ Missing icon aria-label (CloudIcon)
- ❌ Non-semantic div instead of h3
- ❌ Low contrast: `#888` color

### 2. `src/components/weather/CitySelector.tsx`
- ❌ Non-semantic div instead of h3
- ❌ Low contrast: `#aaa` color
- ❌ Missing aria-labels on star icons
- ❌ No aria-pressed state on toggle buttons

### 3. `src/components/crypto/CryptoCard.tsx`
- ❌ Non-semantic divs instead of headings
- ❌ Missing aria-labels on arrow icons
- ❌ Color-only price change indicator
- ❌ Low contrast: `#999` color
- ❌ Link missing descriptive aria-label

### 4. `src/components/weather/WeatherDetails.tsx`
- ❌ Non-semantic div instead of h3
- ❌ Text too small: `9px` chart labels
- ❌ Table headers using td instead of th
- ❌ Chart missing text alternative

### 5. `src/components/crypto/NewsCard.tsx`
- ❌ Non-semantic div instead of h3
- ❌ Very low contrast: `#ccc` color
- ❌ Link missing descriptive aria-label

### 6. `src/components/layout/Layout.tsx`
- ❌ Missing nav landmark (div instead of nav)
- ❌ Missing main landmark (div instead of main)
- ❌ Navigation icons missing aria-labels

### 7. `src/app/page.tsx`
- ❌ Missing h1 heading
- ❌ Missing h2 headings (3 instances)
- ❌ Non-semantic divs instead of sections

---

## Violation Categories

### 🔴 Semantic HTML (17 violations)
- Headings replaced with divs: 7 instances
- Landmarks removed: 2 instances (nav, main)
- Sections removed: 3 instances
- Table structure broken: 1 instance

### 🟠 ARIA Labels (8 violations)
- Icons without labels: 7 instances
- Missing state announcements: 1 instance

### 🟡 Color Contrast (5 violations)
- `#888` - WeatherCard
- `#aaa` - CitySelector
- `#999` - CryptoCard (2 instances)
- `#ccc` - NewsCard

### 🔵 Color-Only Indicators (1 violation)
- Red/green price changes without text

### 🟣 Other Issues (9 violations)
- Text too small: 1 instance
- Missing link purposes: 2 instances
- Missing chart descriptions: 1 instance
- Table accessibility: 1 instance

---

## Testing Commands

```bash
# Run Lighthouse audit
npm run build
npm start
# Then open Chrome DevTools > Lighthouse > Accessibility

# Run Pa11y
npx pa11y http://localhost:3000

# Run axe-core
npx @axe-core/cli http://localhost:3000
```

---

## Expected Test Results

| Tool | Expected Score/Result |
|------|----------------------|
| Lighthouse | 60-70/100 |
| axe DevTools | 20+ violations |
| WAVE | 15+ errors, 10+ alerts |
| Pa11y | Multiple WCAG2AA violations |

---

## What Still Works

✅ **Keyboard Navigation** - All buttons and links are keyboard accessible  
✅ **Focus Management** - Tab order is logical  
✅ **Interactive Elements** - All clickable items use proper HTML elements  

---

## Document Details
- **Created:** December 2, 2025
- **Purpose:** Testing & Educational
- **Full Report:** See WCAG_VIOLATIONS_REPORT.md

