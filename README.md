# React UIKit Core

A pristine, high-performance React component library designed from the ground up with **zero external UI dependencies**. 

`react-uikit-core` is an engineering demonstration of how to build a robust, accessible, and performant UI kit using only pure React, native DOM APIs, and CSS Modules. No Radix, no Headless UI, no framer-motion, and no bloated third-party styling libraries.

## 🚀 Features

- **12 Foundational & Advanced Components**: Everything from Buttons and Inputs to complex interactive data tables, modals, and tooltips.
- **Zero External UI Libraries**: All mechanics (focus trapping, positioning, truncation, sorting) are written in raw native React/TypeScript.
- **WAI-ARIA Compliant**: Strict adherence to accessibility guidelines (`aria-expanded`, `aria-describedby`, focus traps, roving tabindexes, semantic roles, live regions).
- **CSS Custom Properties (Tokens)**: A dynamic, highly customizable theming system rooted in CSS variables (`tokens.css`).
- **Compound Components**: Architected with modern React patterns for maximum composition flexibility (e.g., `Accordion.Item`, `Tabs.Trigger`, `Modal.Body`).
- **Vitest Unit Tested**: Comprehensive unit test suite with 100% coverage across interaction, accessibility, and rendering states.
- **Bundled for Production**: Pre-bundled as ESM and CJS formats via Vite with fully generated `.d.ts` TypeScript definitions.

## 📦 Installation

```bash
npm install react-uikit-core
# or
yarn add react-uikit-core
# or
pnpm add react-uikit-core
```

## 🛠 Usage

To use the components, first import the CSS tokens at the root of your application (e.g., in `main.tsx` or `App.tsx`):

```tsx
// Import global CSS tokens (required for styling)
import 'react-uikit-core/tokens.css';

// Import desired components
import { Button, Badge, Modal, useToast, ToastProvider } from 'react-uikit-core';
```

### Example: Modal and Toast Usage

```tsx
import React, { useState } from 'react';
import { Button, Modal, useToast, ToastProvider } from 'react-uikit-core';
import 'react-uikit-core/tokens.css';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAction = () => {
    setModalOpen(false);
    toast({
      title: 'Action Successful',
      description: 'Your request was processed successfully.',
      variant: 'success',
      duration: 3000,
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Button variant="primary" onClick={() => setModalOpen(true)}>
        Open Modal
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Confirm Action">
        <Modal.Header />
        <Modal.Body>
          <p>Are you sure you want to proceed with this action?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAction}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default function Root() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}
```

## 📚 Component Roster

### Foundational
- **Button**: Handles variants, sizes, loading spinners, and disabled states.
- **Input**: Supports prefixed/suffixed icons, error states, and helper text.
- **Badge**: Lightweight status indicators with optional dot mode.
- **Card**: Compound structural container (Header, Body, Footer).

### Interactive & Complex
- **Tabs**: Horizontal and vertical orientation with arrow key navigation (roving `tabindex`).
- **Dropdown**: Single-select dropdown with intelligent focus handling and keyboard interactions.
- **Modal**: Portal-rendered dialog with strict focus-trapping and body scroll-locking.
- **Toast**: Provider-based notification system (`useToast` hook) with hover-pause functionality.

### Advanced
- **Accordion**: Collapsible compound panels with single/multiple expansion modes and smooth CSS Grid transitions.
- **Tooltip**: Native `getBoundingClientRect` positioning with smart collision detection (viewport flipping).
- **Pagination**: Intelligent truncation calculating ellipses dynamically based on sibling boundaries.
- **DataTable**: Generic `<T>` data grid supporting client-side column sorting and empty state fallbacks.

## 💅 Theming

The entire UI kit is styled via CSS custom properties. You can easily override the default tokens by declaring your own root variables:

```css
:root {
  --uk-color-primary-500: #0ea5e9; /* Light Blue */
  --uk-color-primary-600: #0284c7;
  --uk-radius-md: 8px;
  --uk-font-family-base: 'Inter', sans-serif;
}
```

## 🏗 Development & Testing

This project is built using Vite and tested with Vitest + `@testing-library/react`. 

```bash
# Start Storybook for visual testing
npm run storybook

# Run the unit test suite
npm run test

# Build the library for production
npm run build
```

## 📝 License

MIT
