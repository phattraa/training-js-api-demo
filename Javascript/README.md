# 01_02 Set Up CI for Javascript

In this lesson, you’ll set up a Continuous Integration workflow for a JavaScript project using GitHub Actions. The code used here is included in the exercise files, so you can jump straight into working with the workflow.

You’ll start by adding the project code to your repository and selecting a **Node.js Continuous Integration** starter workflow. GitHub’s starter workflows provide a ready-to-use setup that checks out your code, configures Node.js, and runs build and test steps using **npm**.

The Node.js starter workflow also includes a **matrix strategy**, which automatically runs the same workflow across multiple versions of Node.js. This makes it easy to validate your project against more than one runtime without duplicating configuration.

Before moving on, you’ll review the Node.js versions defined in the matrix. Because Node releases include both long-term support and short-term versions, it’s important to keep only the versions that make sense for your project. Updating the matrix helps keep your CI workflow reliable and easier to maintain over time.

## What You’ll Do

In this lesson, you will:

- Add a JavaScript project to a GitHub repository
- Enable a Node.js Continuous Integration starter workflow
- Review the workflow’s build and test steps
- Update the Node.js version matrix to use supported versions
- Run the CI workflow automatically on pushes and pull requests

## References

| Reference | Description |
|----------|-------------|
| [Node.js Supported Versions](https://github.com/nodejs/Release) | Official Node.js release schedule and supported versions |
| [actions/setup-node on GitHub Marketplace](https://github.com/marketplace/actions/setup-node-js-environment) | GitHub Action for setting up Node.js environments |
| [actions/checkout on GitHub Marketplace](https://github.com/marketplace/actions/checkout) | GitHub Action for checking out repository code |
| [Documentation for the Node.js project used for this lesson](./JS_PROJECT_DETAILS.md) | Documentation for the JavaScript project used in this lesson |
| [The updated workflow for this lesson](./js-ci-workflow.yml) | The complete workflow file for this lesson |

## Lab: Create and Update a Node.js CI Workflow

In this lab, you’ll create a Continuous Integration (CI) workflow for a JavaScript project using a GitHub Actions starter workflow. You’ll then review and update the workflow to ensure it uses supported Node.js versions and up-to-date actions.

### Prerequisites

Before starting this lab, make sure you have:

- A GitHub account
- A new GitHub repository
- The exercise files for this lesson added to the repository

### Instructions

#### 1. Open the Actions tab

Start in the repository where you’ve added the exercise files.

1. Select the **Actions** tab at the top of the repository.
2. GitHub will analyze the contents of the repo and suggest workflows based on the project type.

#### 2. Select a Node.js Continuous Integration workflow

1. Scroll down to the **Continuous Integration** section.
2. Locate the **Node.js** workflow.
3. Select **Configure** to open the workflow editor.

#### 3. Review the generated workflow

Before committing the workflow, take a moment to review its main sections:

- **Checkout step**
  Checks out the repository so the workflow can access the code.

- **Setup Node.js step**
  Configures Node.js for the version defined by the workflow.

- **Build and test steps**
  Uses npm commands to install dependencies and run tests.

- **Matrix strategy**
  Defines multiple Node.js versions so the same workflow runs once per version.

At this point, accept the workflow as-is.

1. Select **Commit changes**.
2. Confirm the commit.

This commit triggers a workflow run automatically because the workflow listens for pushes to the main branch.

#### 4. View the workflow run

1. Return to the **Actions** tab.
2. Select the newly created workflow run.
3. Confirm that the workflow is running or has completed.
4. Open the workflow run details.
5. Note the Node.js versions listed in the matrix (for example: 18.x, 20.x, 22.x).

> [!IMPORTANT]
> The exact versions mentioned in the video and in this document may differ when you take this course.
> The important takeaway is that Node.js versions change over time. It’s always a good idea to review and update the matrix to match currently supported releases.

#### 5. Edit the workflow file

1. Select the **Workflow file** link.
2. Select the **pencil icon** to edit the workflow.

#### 6. Update the Node.js versions

1. Remove any unsupported Node.js versions from the matrix (for example, remove `18.x`).
2. Add newer supported versions (for example, add `24.x` and `25.x`).

This ensures your CI workflow tests the project against versions of Node.js that are actively supported.

#### 7. Update action versions

While editing the workflow, update the action versions to their latest releases:

- Update `actions/checkout` to a newer version
- Update `actions/setup-node` to a newer version

Keeping actions up to date helps ensure your workflow remains secure, reliable, and compatible over time.

#### 8. Commit the updated workflow

1. Select **Commit changes**.
2. Confirm the commit.

This triggers a new workflow run using the updated configuration.

### 9. Verify the results

1. Return to the **Actions** tab.
2. Open the most recent workflow run.
3. Confirm that all jobs in the matrix complete successfully.

When each job finishes successfully, you can be confident that the project works across all Node.js versions defined in the matrix.

<!-- FooterStart -->
---
[← 01_01 Leverage Starter Workflows](../01_01_starter_workflows/README.md) | [01_03 Set Up CI for Python →](../01_03_ci_for_python/README.md)
<!-- FooterEnd -->
