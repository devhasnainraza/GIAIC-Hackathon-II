---
name: frontend-pages
description: Build responsive frontend pages with reusable components, clean layouts, and modern styling.
---

# Frontend Page & Component Design

## Instructions

1. **Page Structure**
   - Semantic HTML layout
   - Header, main, footer sections
   - Responsive grid system

2. **Components**
   - Reusable UI components
   - Button, card, navbar, form elements
   - Props-based or class-based variations

3. **Layout**
   - Flexbox and Grid usage
   - Consistent spacing system
   - Mobile-first responsiveness

4. **Styling**
   - Utility-first or modular CSS
   - Consistent color palette and typography
   - Light and dark mode support

## Best Practices
- Use semantic HTML tags
- Build mobile-first layouts
- Keep components reusable and isolated
- Follow consistent naming conventions
- Avoid inline styles
- Optimize for accessibility (ARIA, contrast, keyboard)

## Example Structure
```html
<div class="page">
  <header class="navbar">
    <h1 class="logo">Brand</h1>
    <nav class="nav-links">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </nav>
  </header>

  <main class="content">
    <section class="card-grid">
      <div class="card">
        <h2>Card Title</h2>
        <p>Description text</p>
        <button class="primary-btn">Action</button>
      </div>
    </section>
  </main>

  <footer class="footer">
    <p>© 2026 Brand</p>
  </footer>
</div>
