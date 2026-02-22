# Contributing to SugarSync

Welcome to SugarSync! We are excited that you want to contribute. By participating in this project, you agree to abide by our terms.

## How to Contribute

1.  **Find an Issue**: Browse our [GitHub Issues](https://github.com/Rohan-Unbeg/beat-the-sugar-spike/issues) to find something you'd like to work on.
2.  **Claim the Issue**: Leave a comment on the issue asking to be assigned.
3.  **Create a Branch**: Create a feature/bugfix branch from `main`.
    ```bash
    git checkout -b feature/your-feature-name
    ```
4.  **Make Your Changes**: Write clean, documented code and ensure it passes linting.
5.  **Run Local Tests**:
    ```bash
    npm run lint
    npm run build
    ```
6.  **Submit a Pull Request**: Follow our PR template and reference the issue.

## Pull Request Guidelines

- **No Direct Pushes to Main**: All changes must go through a PR and be reviewed.
- **Reference Issues**: Use "Fixes #123" in your PR description.
- **Screen Recordings**: For UI changes, please include a GIF or video proof.
- **Resolve Conversations**: Ensure all reviewer comments are addressed and resolved.

## Code Style

- We use ESLint for linting. Please ensure your editor is configured to use our rules.
- Follow the existing folder structure in `src/`.
- Use TypeScript for all new code.

Happy coding!
