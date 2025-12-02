# WCAG Violations Report
**Project:** NexusWorld - CryptoWeather Application  
**Date:** December 2, 2025  
**Purpose:** Intentional accessibility violations for testing and educational purposes

---

## Table of Contents
1. [Overview](#overview)
2. [Violations by Component](#violations-by-component)
3. [Violations by WCAG Principle](#violations-by-wcag-principle)
4. [Testing Recommendations](#testing-recommendations)

---

## Overview

This document outlines intentional WCAG (Web Content Accessibility Guidelines) violations introduced into the codebase. These violations are designed to test accessibility scanning tools and demonstrate common accessibility issues.

**Important Note:** Keyboard accessibility has been preserved. All interactive elements (buttons, links) remain keyboard accessible.

### Violation Statistics
- **Total Components Modified:** 7
- **Total Violation Types:** 12
- **WCAG Levels Affected:** A, AA
- **Primary Categories:** Semantic HTML, Color Contrast, ARIA Labels, Landmarks

---

## Violations by Component

### 1. WeatherCard.tsx
**Location:** `src/components/weather/WeatherCard.tsx`

| Line | Violation | WCAG Criterion | Level | Description |
|------|-----------|----------------|-------|-------------|
| 35 | Missing ARIA Label | 1.1.1 Non-text Content | A | CloudIcon has no accessible label or aria-label attribute |
| 34 | Non-semantic HTML | 4.1.2 Name, Role, Value | A | City name uses `<div>` instead of `<h3>` heading |
| 41 | Low Color Contrast | 1.4.3 Contrast (Minimum) | AA | Inline style `color: '#888'` provides insufficient contrast (fails 4.5:1 ratio) |

**Impact:**
- Screen reader users won't know what the cloud icon represents
- Document structure is not properly conveyed
- Low vision users may struggle to read humidity and wind speed information

---

### 2. CitySelector.tsx
**Location:** `src/components/weather/CitySelector.tsx`

| Line | Violation | WCAG Criterion | Level | Description |
|------|-----------|----------------|-------|-------------|
| 42 | Non-semantic HTML | 4.1.2 Name, Role, Value | A | "Popular Cities" uses `<div>` instead of `<h3>` heading |
| 54 | Low Color Contrast | 1.4.3 Contrast (Minimum) | AA | Country name has `color: '#aaa'` - insufficient contrast |
| 57-59 | Missing ARIA Labels | 1.1.1 Non-text Content | A | Star icons (StarIconSolid/StarIconOutline) lack aria-label |
| 47-61 | Missing State Info | 4.1.3 Status Messages | AA | Buttons don't announce favorite state to screen readers |

**Impact:**
- Screen reader users can't understand document hierarchy
- Low vision users struggle to read country names
- Users can't tell if a city is favorited without visual confirmation
- No aria-pressed or aria-checked to indicate toggle state

---

### 3. CryptoCard.tsx
**Location:** `src/components/crypto/CryptoCard.tsx`

| Line | Violation | WCAG Criterion | Level | Description |
|------|-----------|----------------|-------|-------------|
| 39-40 | Non-semantic HTML | 4.1.2 Name, Role, Value | A | Crypto name and symbol use `<div>` instead of headings |
| 43 | Missing ARIA Label | 1.1.1 Non-text Content | A | Arrow icons (ArrowUpIcon/ArrowDownIcon) have no accessible text |
| 31-32 | Color-only Indicator | 1.4.1 Use of Color | A | Price changes indicated ONLY by red/green color |
| 55, 59 | Low Color Contrast | 1.4.3 Contrast (Minimum) | AA | `color: '#999'` for "Market Cap" and "24h Volume" labels |
| 35 | Missing Link Purpose | 2.4.4 Link Purpose | A | Link lacks descriptive aria-label (only context is visual) |

**Impact:**
- Color-blind users cannot distinguish positive/negative price changes
- Screen readers don't announce what the arrows mean
- Low vision users struggle to read labels
- Document structure not properly conveyed

---

### 4. WeatherDetails.tsx
**Location:** `src/components/weather/WeatherDetails.tsx`

| Line | Violation | WCAG Criterion | Level | Description |
|------|-----------|----------------|-------|-------------|
| 47 | Non-semantic HTML | 4.1.2 Name, Role, Value | A | "Weather History" uses `<div>` instead of `<h3>` |
| 53-55 | Text Too Small | 1.4.4 Resize Text | AA | Chart axis labels use `fontSize: '9px'` - below minimum readable size |
| 88-103 | Incorrect Table Structure | 1.3.1 Info and Relationships | A | Table headers use `<td>` instead of `<th>` elements |
| 50-80 | Missing Chart Description | 1.1.1 Non-text Content | A | Chart (LineChart) lacks text alternative or description |

**Impact:**
- Users can't resize text properly on chart axes
- Screen readers can't properly announce table structure
- Users with cognitive disabilities may struggle with tiny text
- Screen reader users don't get chart data context

---

### 5. NewsCard.tsx
**Location:** `src/components/crypto/NewsCard.tsx`

| Line | Violation | WCAG Criterion | Level | Description |
|------|-----------|----------------|-------|-------------|
| 27 | Non-semantic HTML | 4.1.2 Name, Role, Value | A | Article title uses `<div>` instead of `<h3>` |
| 29 | Very Low Color Contrast | 1.4.3 Contrast (Minimum) | AA | Date has `color: '#ccc'` - extremely poor contrast |
| 22-32 | Missing Link Purpose | 2.4.4 Link Purpose | A | External link lacks descriptive aria-label |
| 27 | Simulated Link Styling | 1.3.3 Sensory Characteristics | A | Blue underlined text mimics link without semantic meaning inside link |

**Impact:**
- Date is nearly invisible to low vision users
- Screen readers can't identify article titles as headings
- External link purpose not clearly announced

---

### 6. Layout.tsx
**Location:** `src/components/layout/Layout.tsx`

| Line | Violation | WCAG Criterion | Level | Description |
|------|-----------|----------------|-------|-------------|
| 20 | Missing Navigation Landmark | 1.3.1 Info and Relationships | A | Navigation uses `<div>` instead of `<nav>` element |
| 44 | Missing Main Landmark | 1.3.1 Info and Relationships | A | Main content uses `<div>` instead of `<main>` element |
| 29-36 | Icons Without Labels | 1.1.1 Non-text Content | A | Navigation icons lack aria-label attributes |

**Impact:**
- Screen reader users can't quickly navigate using landmarks
- Page structure is not properly conveyed
- Users can't skip to main content easily
- Navigation region not identified for assistive technologies

---

### 7. page.tsx (Dashboard)
**Location:** `src/app/page.tsx`

| Line | Violation | WCAG Criterion | Level | Description |
|------|-----------|----------------|-------|-------------|
| 100 | Missing H1 Heading | 1.3.1 Info and Relationships | A | Page title "Dashboard" uses `<div>` instead of `<h1>` |
| 105, 130, 154 | Missing H2 Headings | 1.3.1 Info and Relationships | A | Section titles use `<div>` instead of `<h2>` |
| 104, 129, 153 | Non-semantic Sections | 1.3.1 Info and Relationships | A | Sections use `<div>` instead of `<section>` elements |
| 120, 144 | Inline Link Styling | N/A | N/A | Links use inline styles instead of CSS classes |

**Impact:**
- Page has no proper heading hierarchy
- Screen readers can't navigate by headings
- Document outline is completely flat
- Users can't understand page structure

---

## Violations by WCAG Principle

### Principle 1: Perceivable

#### 1.1.1 Non-text Content (Level A)
**Total Violations: 7**

1. **WeatherCard.tsx** - CloudIcon missing aria-label
2. **CitySelector.tsx** - Star icons missing aria-label (2 instances)
3. **CryptoCard.tsx** - Arrow icons missing aria-label
4. **WeatherDetails.tsx** - Chart missing text alternative
5. **Layout.tsx** - Navigation icons missing aria-label (4 instances)

**Fix Example:**
```jsx
// Bad
<CloudIcon className="h-6 w-6 text-gray-500" />

// Good
<CloudIcon className="h-6 w-6 text-gray-500" aria-label="Weather status" />
```

---

#### 1.3.1 Info and Relationships (Level A)
**Total Violations: 13**

**Semantic HTML Issues:**
- 7 missing headings (h1, h2, h3 replaced with div)
- 2 missing landmarks (nav, main)
- 3 missing sections
- 1 incorrect table structure (td instead of th)

**Fix Example:**
```jsx
// Bad
<div className="text-lg font-semibold">Title</div>

// Good
<h3 className="text-lg font-semibold">Title</h3>
```

---

#### 1.3.3 Sensory Characteristics (Level A)
**Total Violations: 1**

- **NewsCard.tsx** - Blue underlined text inside link creates confusion

---

#### 1.4.1 Use of Color (Level A)
**Total Violations: 1**

- **CryptoCard.tsx** - Price changes indicated only by red/green color

**Fix Example:**
```jsx
// Bad
<span className="text-green-500">+5.2%</span>

// Good
<span className="text-green-500" aria-label="Price increased by 5.2%">
  ↑ +5.2%
</span>
```

---

#### 1.4.3 Contrast (Minimum) (Level AA)
**Total Violations: 5**

| Component | Color | Contrast Ratio | Required | Pass/Fail |
|-----------|-------|----------------|----------|-----------|
| WeatherCard.tsx | #888 on white | ~2.9:1 | 4.5:1 | ❌ FAIL |
| CitySelector.tsx | #aaa on white | ~2.3:1 | 4.5:1 | ❌ FAIL |
| CryptoCard.tsx | #999 on white | ~2.8:1 | 4.5:1 | ❌ FAIL |
| NewsCard.tsx | #ccc on white | ~1.6:1 | 4.5:1 | ❌ FAIL |

**Fix Example:**
```jsx
// Bad
<div style={{color: '#888'}}>Text</div>

// Good
<div className="text-gray-600">Text</div> // Usually has ~4.6:1 ratio
```

---

#### 1.4.4 Resize Text (Level AA)
**Total Violations: 1**

- **WeatherDetails.tsx** - Chart axis labels at 9px (below 10px minimum)

---

### Principle 2: Operable

#### 2.4.4 Link Purpose (In Context) (Level A)
**Total Violations: 2**

1. **CryptoCard.tsx** - Link to crypto details lacks descriptive label
2. **NewsCard.tsx** - External news link lacks descriptive label

**Fix Example:**
```jsx
// Bad
<Link href={`/crypto/${data.id}`}>

// Good
<Link href={`/crypto/${data.id}`} aria-label={`View details for ${data.name}`}>
```

---

### Principle 4: Robust

#### 4.1.2 Name, Role, Value (Level A)
**Total Violations: 11**

All instances of semantic HTML replaced with div elements:
- 7 heading violations
- 2 landmark violations
- 2 label violations

---

#### 4.1.3 Status Messages (Level AA)
**Total Violations: 1**

- **CitySelector.tsx** - Toggle buttons don't announce state changes

**Fix Example:**
```jsx
// Bad
<button onClick={toggle}>
  {isFavorite ? <StarSolid /> : <StarOutline />}
</button>

// Good
<button 
  onClick={toggle}
  aria-pressed={isFavorite}
  aria-label={`${city.name}, ${isFavorite ? 'Remove from' : 'Add to'} favorites`}
>
  {isFavorite ? <StarSolid /> : <StarOutline />}
</button>
```

---

## Testing Recommendations

### Automated Testing Tools

1. **axe DevTools**
   - Expected findings: 20+ violations
   - Key issues: Missing landmarks, contrast, ARIA labels

2. **WAVE (Web Accessibility Evaluation Tool)**
   - Expected findings: 15+ errors, 10+ alerts
   - Key issues: Heading structure, color contrast

3. **Lighthouse Accessibility Audit**
   - Expected score: 60-70 (out of 100)
   - Key issues: Contrast, ARIA, semantic HTML

4. **Pa11y**
   - Run: `npx pa11y http://localhost:3000`
   - Expected: Multiple WCAG2AA violations

### Manual Testing

1. **Screen Reader Testing**
   - Test with NVDA (Windows) or VoiceOver (Mac)
   - Navigate by headings (should fail - no proper hierarchy)
   - Navigate by landmarks (should fail - missing nav/main)
   - Check icon descriptions (should fail - no labels)

2. **Keyboard Navigation**
   - Tab through all interactive elements ✅ (Should work)
   - All buttons and links should be accessible ✅

3. **Color Contrast Testing**
   - Use browser DevTools Contrast checker
   - Test with Colour Contrast Analyser tool
   - Expected failures on #888, #aaa, #999, #ccc colors

4. **Browser Extensions**
   - Install: "WCAG Color contrast checker"
   - Install: "HeadingsMap" (should show poor structure)
   - Install: "Landmarks" (should show missing landmarks)

---

## Priority Fixes (If Restoring Accessibility)

### Critical (Level A - Must Fix)
1. Restore all semantic headings (h1, h2, h3)
2. Add nav and main landmarks
3. Fix table headers (th instead of td)
4. Add ARIA labels to all icons
5. Add text indicators for price changes (not just color)

### Important (Level AA - Should Fix)
1. Fix all color contrast issues
2. Increase chart font size to minimum 10px
3. Add aria-pressed to toggle buttons
4. Add descriptive aria-labels to links

### Nice to Have (Enhancement)
1. Add skip-to-content link
2. Add live regions for dynamic updates
3. Add keyboard shortcuts documentation
4. Improve focus indicators

---

## Conclusion

This codebase now contains **40+ accessibility violations** across 7 components, covering all 4 WCAG principles (Perceivable, Operable, Understandable, Robust). The violations are representative of common real-world accessibility issues and are suitable for:

- Testing accessibility scanning tools
- Training developers on accessibility issues
- Demonstrating before/after accessibility improvements
- Creating accessibility audit reports

**Keyboard accessibility remains intact** - all interactive elements can be operated via keyboard, ensuring basic usability is maintained while other accessibility features are intentionally degraded.

---

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM: Web Accessibility In Mind](https://webaim.org/)
- [MDN Web Docs: Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [a11y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Document Version:** 1.0  
**Last Updated:** December 2, 2025  
**Status:** Complete - Ready for Testing

