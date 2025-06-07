# Contributing to PC Builder

Thank you for your interest in contributing to the PC Builder application! We welcome all contributions, whether they're bug reports, feature requests, documentation improvements, or code contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [Code Review Process](#code-review-process)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** to your local machine
   ```bash
   git clone https://github.com/your-username/pc-builder-app.git
   cd pc-builder-app
   ```
3. **Set up the development environment**
   ```bash
   npm install
   cp .env.local.example .env.local
   # Update .env.local with your Supabase credentials
   ```
4. **Create a branch** for your changes
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/description-of-fix
   ```

## Development Workflow

1. **Start the development server**
   ```bash
   npm run dev
   ```
2. **Make your changes** following the code style guidelines
3. **Run tests** (when available)
   ```bash
   npm test
   ```
4. **Lint your code**
   ```bash
   npm run lint
   ```
5. **Format your code**
   ```bash
   npm run format
   ```
6. **Commit your changes** following the commit guidelines
7. **Push to your fork**
   ```bash
   git push origin your-branch-name
   ```
8. **Open a Pull Request** from your fork to the main repository

## Code Style

- Use **TypeScript** for all new code
- Follow the **Airbnb JavaScript Style Guide**
- Use **functional components** with hooks
- Keep components small and focused on a single responsibility
- Use **PascalCase** for component names (e.g., `ComponentName.tsx`)
- Use **camelCase** for variables and functions
- Use **kebab-case** for file names (e.g., `my-component.tsx`)
- Add **PropTypes** or TypeScript interfaces for all component props
- Add **JSDoc** comments for functions and components

### Styling

- Use **Tailwind CSS** for styling
- Follow the existing design system and component library
- Keep styles co-located with components when possible
- Use CSS modules for component-specific styles

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for our commit messages. Each commit message consists of a **type**, an optional **scope**, and a **description**:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries

### Examples:

```
feat(auth): add Google OAuth login
fix(ui): resolve layout shift on mobile devices
docs: update README with new setup instructions
```

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, including new environment variables, exposed ports, useful file locations, and container parameters.
3. Increase the version numbers in any example files and the README.md to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Reporting Issues

When creating an issue, please include:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Screenshots or screen recordings if applicable
6. Browser/device information
7. Any error messages from the console

## Feature Requests

We welcome feature requests! When suggesting a new feature, please:

1. Describe the feature in detail
2. Explain why this feature would be valuable
3. Include any relevant examples or mockups
4. Mention any potential drawbacks or considerations

## Code Review Process

1. All code changes require at least one approving review
2. The PR author is responsible for addressing all review comments
3. All tests must pass before merging
4. Code should be reviewed for:
   - Correctness
   - Performance
   - Security
   - Maintainability
   - Accessibility
   - Test coverage

## Getting Help

If you need help at any point, please:

1. Check the [documentation](./DEVELOPER_GUIDE.md)
2. Search the [existing issues](https://github.com/JentoP/pc-builder-app/issues)
3. Open a new issue if your question hasn't been answered

Thank you for contributing to PC Builder! 🚀
