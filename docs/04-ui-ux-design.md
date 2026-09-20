# 04. UI/UX Design System & Layout Architecture

> **Design Style:** Modern Enterprise SaaS / Career Intelligence  
> **Typography:** `Inter` (UI elements, data tables, metrics) + `Outfit` (Headings & display titles)  
> **Color System:** Deep Slate (`#0F172A`, `#1E293B`) + Royal Indigo (`#4F46E5`) + Emerald Ayush (`#10B981`)  

---

## 1. Design Tokens & Visual Hierarchy

### Typography
* **Display Font:** `Outfit, Inter, sans-serif` — Applied to `h1`, `h2`, `h3`, KPI metrics, and brand wordmarks.
* **Body Font:** `Inter, sans-serif` — Applied to data tables, descriptions, form fields, and navigation lists.

### Color Tokens
* **Slate Surfaces:**
  * Background Light: `#F8FAFC` (`slate-50`)
  * Surface Card: `#FFFFFF` with `#E2E8F0` hairline border
  * Dark Shell Background: `#0F172A` (`slate-900`)
* **Accents & Match Semantics:**
  * High Match ($\ge 80\%$): `#10B981` (`emerald-500` / `emerald-50` background)
  * Moderate Match ($50\% - 79\%$): `#F59E0B` (`amber-500` / `amber-50` background)
  * Low Match ($< 50\%$): `#64748B` (`slate-500` / `slate-100` background)
  * Critical Gap Deficit: `#F43F5E` (`rose-500` / `rose-50` background)
  * Verified Credential / Assessment: `#6366F1` (`indigo-500` / `indigo-50` background)

---

## 2. Core UI Component Primitives

1. **`Button` (`frontend/src/components/common/Button.jsx`)**:
   * Supports `primary`, `ayush`, `secondary`, `outline`, `ghost`, `danger`, and `success` variants.
   * Sizes: `sm`, `md`, `lg`.
   * Integrated loading spinner with Lucide `Loader2`.
2. **`Badge` (`frontend/src/components/common/Badge.jsx`)**:
   * Match badges (`match-high`, `match-medium`, `match-low`, `critical`, `verified`).
   * Optional dot status indicators.
3. **`Card` (`frontend/src/components/common/Card.jsx`)**:
   * Glassmorphism and elevated surface variants with header title, icon, action slot, and body container.
4. **`Modal` (`frontend/src/components/common/Modal.jsx`)**:
   * Accessible dialog with backdrop blur, keyboard ESC dismissal, and focus trap.
5. **`Tabs` (`frontend/src/components/common/Tabs.jsx`)**:
   * Underline tabs with dynamic count capsules.
6. **`Sidebar` (`frontend/src/components/navigation/Sidebar.jsx`)**:
   * Role-aware navigation tree that renders the appropriate routes based on user role (`student`, `faculty`, `industry`, `institute`, `admin`).
7. **`DashboardLayout` (`frontend/src/layouts/DashboardLayout.jsx`)**:
   * Responsive container integrating Navbar, Sidebar, page titles, and fluid main content area.
