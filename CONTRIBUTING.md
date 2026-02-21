# Contributing to PaymentHub

First off, thank you for considering contributing to PaymentHub! It's people like you that make PaymentHub such a great tool.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- ✅ Be respectful and inclusive
- ✅ Welcome newcomers and encourage diverse perspectives
- ✅ Focus on what is best for the community
- ✅ Show empathy towards other community members
- ❌ No harassment, trolling, or derogatory comments
- ❌ No spam or self-promotion

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, pnpm, or yarn
- Git
- Upstash Redis account (for testing)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/web-paymenthub.git
   cd web-paymenthub
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/YilziiHCT/web-paymenthub.git
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

6. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## Development Workflow

### 1. Create a Branch

Always create a new branch for your changes:

```bash
# For new features
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/bug-description

# For documentation
git checkout -b docs/what-you-are-documenting
```

### 2. Make Your Changes

- Write clean, maintainable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run the development server
npm run dev

# Build the project to check for errors
npm run build

# Run linting
npm run lint
```

### 4. Commit Your Changes

Follow our [Commit Message Guidelines](#commit-message-guidelines)

```bash
git add .
git commit -m "feat: add new payment method"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Open a Pull Request

Go to GitHub and create a Pull Request from your branch to our `main` branch.

---

## Submitting Changes

### Before Submitting

- ✅ Test your changes thoroughly
- ✅ Update documentation if needed
- ✅ Run `npm run build` to ensure no build errors
- ✅ Run `npm run lint` to check code style
- ✅ Make sure your code follows our style guidelines

### Pull Request Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have tested my changes on different screen sizes (responsive design)
- [ ] I have checked my code for accessibility issues

---

## Style Guidelines

### TypeScript/JavaScript

- Use **TypeScript** for all new files
- Use **functional components** and **hooks** in React
- Prefer **arrow functions** over function declarations
- Use **async/await** instead of promises when possible
- Use **destructuring** for props and objects

```typescript
// ✅ Good
const MyComponent = ({ name, age }: Props) => {
  const { data } = useQuery()
  
  return <div>{name}</div>
}

// ❌ Bad
function MyComponent(props) {
  return <div>{props.name}</div>
}
```

### CSS/Tailwind

- Use **Tailwind CSS** utility classes
- Follow the **mobile-first** approach
- Use **semantic color tokens** from the theme
- Avoid custom CSS when Tailwind utilities exist

```tsx
// ✅ Good
<div className="flex items-center gap-4 rounded-lg bg-card p-4">

// ❌ Bad
<div style={{ display: 'flex', padding: '16px' }}>
```

### File Naming

- **Components:** PascalCase (e.g., `PaymentForm.tsx`)
- **Utilities:** camelCase (e.g., `formatCurrency.ts`)
- **Pages:** kebab-case (e.g., `payment-history.tsx`)
- **Types:** PascalCase with `.types.ts` suffix (e.g., `Payment.types.ts`)

---

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** A new feature
- **fix:** A bug fix
- **docs:** Documentation only changes
- **style:** Code style changes (formatting, missing semicolons, etc.)
- **refactor:** Code change that neither fixes a bug nor adds a feature
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Changes to build process or auxiliary tools

### Examples

```bash
feat(payment): add support for GoPay payment method

- Implement GoPay API integration
- Add GoPay logo and branding
- Update payment form to include GoPay option

Closes #123
```

```bash
fix(donation): correct calculation of total donations

The previous implementation was rounding incorrectly,
causing discrepancies in the leaderboard.

Fixes #456
```

---

## Pull Request Process

1. **Update the README.md** with details of changes if applicable
2. **Update the CHANGELOG.md** (if we have one)
3. **Ensure all tests pass** and there are no linting errors
4. **Request review** from maintainers
5. **Address feedback** promptly and professionally
6. **Squash commits** if requested before merging

### PR Title Format

Use the same format as commit messages:

```
feat: add new payment gateway integration
fix: resolve donation calculation bug
docs: update installation instructions
```

---

## Reporting Bugs

### Before Submitting a Bug Report

- Check the [existing issues](https://github.com/YilziiHCT/web-paymenthub/issues) to avoid duplicates
- Try to reproduce the bug in the latest version
- Collect information about your environment (browser, OS, Node.js version)

### How to Submit a Bug Report

1. Go to [Issues](https://github.com/YilziiHCT/web-paymenthub/issues)
2. Click "New Issue"
3. Select "Bug Report" template
4. Fill in all required information:
   - Clear title
   - Description of the bug
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Environment details

---

## Suggesting Features

We love feature suggestions! Here's how to suggest a feature:

1. **Check existing feature requests** to avoid duplicates
2. **Open a new issue** with the "Feature Request" template
3. **Provide details:**
   - Clear description of the feature
   - Why it would be useful
   - How it should work
   - Examples or mockups (if applicable)

---

## Recognition

Contributors will be recognized in:

- README.md Contributors section
- GitHub Contributors graph
- Release notes (for significant contributions)

---

## Questions?

If you have questions, you can:

- Open a [GitHub Discussion](https://github.com/YilziiHCT/web-paymenthub/discussions)
- Ask in the issue you're working on
- Reach out to the maintainers

---

## Thank You!

Your contributions make PaymentHub better for everyone. We appreciate your time and effort! 🙏

<div align="center">
  <p>Happy Contributing! 🚀</p>
  <p>Made with ❤️ by the PaymentHub Community</p>
</div>
