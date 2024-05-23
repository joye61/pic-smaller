# Contributing to Our Project

Thank you for considering contributing to our project! We appreciate your support and aim to make the process as smooth as possible. Please read through this document before making contributions to ensure your work aligns with our guidelines and standards.

## Table of Contents

- [Contributing to Our Project](#contributing-to-our-project)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Getting Started](#getting-started)
  - [Submitting Changes](#submitting-changes)
  - [Style Guide](#style-guide)
    - [Pseudo-Element Compatibility](#pseudo-element-compatibility)
      - [Example](#example)
      - [Explanation](#explanation)
  - [Reporting Issues](#reporting-issues)
  - [Additional Resources](#additional-resources)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand the expected behavior.

## Getting Started

1. **Fork the repository**: Click the "Fork" button on the project repository page to create a copy of the repository on your GitHub account.
2. **Clone the repository**: Clone your forked repository to your local machine.

   ```bash
   git clone https://github.com/your-username/project-name.git
   ```

3. **Create a branch**: Create a new branch for your changes.

   ```bash
   git checkout -b feature/your-feature-name
   ```

## Submitting Changes

1. **Commit your changes**: Make sure your commit messages are clear and descriptive.

   ```bash
   git commit -m "Add feature: your-feature-name"
   ```

2. **Push to your fork**: Push your changes to your forked repository.

   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a pull request**: Open a pull request from your forked repository's branch to the master branch of the original repository. Provide a clear description of the changes.

## Style Guide

To maintain a consistent codebase, please adhere to the following style guidelines:

### Pseudo-Element Compatibility

To ensure compatibility with older browsers (such as IE 8 and below), we use both the modern `::after` and legacy `:after` syntax for pseudo-elements. This ensures that styles are applied correctly across all supported browsers.

#### Example

```scss
.element {
  &::after,
  &:after {
    content: "";
    display: block;
    height: 2px;
    background: red;
  }
}
```

#### Explanation

The above code ensures that both modern and older browsers correctly render the pseudo-element.

## Reporting Issues

If you encounter any issues or have suggestions for improvements, please open an issue in the repository. Provide as much detail as possible to help us understand and resolve the issue promptly.

## Additional Resources

- [Project Documentation](README.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

We appreciate your contributions and thank you for helping improve our project!
