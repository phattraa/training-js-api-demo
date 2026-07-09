# GitHub Actions & Docker Fundamentals

## Create Your First GitHub Actions Workflow

**Objective:** Understand the YAML file structure, core components of GitHub Actions (Triggers, Jobs, Steps, Runners), and the workflow execution environment.

* **Step-by-Step Demo Guide:**
1. Create a new repository on GitHub.
1. Create a folder named `.github/workflows/` and inside it, create a file named `hello-world.yml`.
1. Define the workflow trigger using `on: push`.
1. Set up the job to run on a hosted runner: `runs-on: ubuntu-latest`.
1. Write a simple step to output text using a standard shell:

    ```yaml
    name: Hello Workflow
    on: push
    jobs:
        hello-job:
            runs-on: ubuntu-latest
            steps:
                - name: Run a one-line script
                  run: echo "Hello, GitHub Actions!"
    ```

1. Commit and `git push` the changes to GitHub. Guide students to the **Actions Tab** in the repository to observe the execution logs and step breakdown.

1. Add **github** and **runner** variable
    ```yaml
    steps:
      # Display the event that triggered the workflow
      - run: echo "The job was triggered by a ${{ github.event_name }} event."
      
      # Runner information
      - run: echo "This job is now running on a ${{ runner.os }} server hosted by GitHub"
      
      # Information about the repository and branch
      - run: echo "The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
    ```

1. Add more job
    ```yaml
    Second-Job:
        name: The second job running on another runner
        runs-on: windows-latest
        needs: Example-Actions-Job
        steps:
          - run: echo "This job is now running on a ${{ runner.os }} server hosted by GitHub."
    ```

### Trigers and Events filtering
1. Update triggers to accept push and pull request events
    ```yaml
    on: [push, pull_request]
    ```
1. Specific branch
    ```yaml
    on:
        push:
            branches: [ main ]
        pull_request:
            branches: [ main ]
    ```

1. Accept triggers from third-party
    ```yaml
    on:
        repository_dispatch:
            types: [after_render_cms]
    ```
1. Display payload data from third-party request
    ```yaml
      - run: echo "Payload field is ${{ github.event.client_payload.mydata }}" 
    ```

1. Send Request to triiger workflow
    * Generate Personal Access Token: Goto **Profile** > **Settings** > **Developer Settings** > **Personal Access Tken** > **Generate new Tkoken**
    * Set name of Token
    * Choose **fine-grain permission**
    * Add permission to **Read-Write** Contents,Workflow and Action
    * Copy Token
    * Create new request in Postman
    * Choose **POST** method
    * Set URL to https://api.github.com/repos/`Username`/`Password`/dispatches
    * Set authentication , choose `Bearer Toeken` and copy token from previous step
    * Set `Accept` header to application/vnd.github.v3+json
    * Set body to
        ```json
        {
            "event_type": "after_render_cms",
            "client_payload": {
                "status": "completed"
            }
        }
        ```

1. Dump context variawbles
    ```yaml
      - name: Dump Full GitHub Context JSON
        env:
          GITHUB_CONTEXT: ${{ toJson(github) }}
        run: echo "$GITHUB_CONTEXT"
    ```

### Expression

1. Add Condition to run script when pull request
    ```yaml
    - name: conditional step when event name is pull request
      if: ${{ github.event_name == 'pull_request' }}
      run: echo "This event is a pull request"
    ```

### Using Environment Variables
1. Default Environment Variables: https://docs.github.com/en/actions/reference/workflows-and-actions/variables

1. Inject the env: block at both the workflow and job levels
    ```yaml
    env:
        APP_NAME: 'Demo Application'
    ```

    ```yaml
    jobs:
        build:
            env:
                PACKAGE_PATH: '.'
    ```

    ```yaml
    - name: Deploy
      uses: Azure/webapps-deploy@v2
      with:
        app-name: ${{ env.APP_NAME }}
        slot-name: '${{ env.SLOT_NAME }}'
        package: '${{ env.PACKAGE_PATH }}/myapp'
      env:
        SLOT_NAME: production
    ```
1. reference it
    ```yaml
    - run echo "Application name is ${{ env.APP_NAME }}"
    ```
### Secrets Management
1. Navigate to **Settings** > **Secrets and variables** > **Actions**
1. Create a Repository Secret named **DB_PASSWORD**.
1. Write a workflow step to consume it
    ```yaml
    - run: echo "The password is ${{ secrets.DB_PASSWORD }}"
    ```
## Working with source code
### Checkout source code from repository
1. Checkout code
    ```yaml
    steps
      - name: Check out repository code
        uses: actions/checkout@v2
      
      - run: echo "The ${{ github.repository }} repository has been cloned to the runner."
      
      - run: echo "Your repository has been copied to the path ${{ github.workspace }} on the runner."
      
      - run: echo "The workflow is now ready to test your code on the runner."
    ```

1. Access files in source code directory
    ```yaml
    - name: List files in the repository
      run: |
        ls ${{ github.workspace }}
    ```


## Building Docker Images and Pushing to GitHub Packages (GHCR)

**Objective:** Learn environment variable handling, automated token authentication, and managing Container Images securely.

* **Step-by-Step Demo Guide:**
1. Create a simple web application (e.g., Node.js or Python) and write a corresponding `Dockerfile`.
2. Create a new workflow file named `build-push.yml`.
3. Utilize the official checkout action: `actions/checkout@v4`.
4. Implement `docker/login-action@v3` to log into the GitHub Container Registry (`ghcr.io`) using the built-in `${{ secrets.GITHUB_TOKEN }}`.
5. Implement `docker/build-push-action@v5` to build the image and push it to GHCR, tagging it with both `latest` and the unique Git Commit SHA.
6. Verify the published image by navigating to the **Packages** tab on the GitHub repository UI.

---

## AKS Provisioning & Kubernetes Core Concepts

### Provisioning and Connecting to an AKS Cluster via Azure CLI

**Objective:** Provision a production-ready AKS cluster and configure local tools for cluster administration.

* **Step-by-Step Demo Guide:**
1. Open the Azure Cloud Shell or a local terminal with Azure CLI installed.
2. Execute commands to create a Resource Group and provision an AKS cluster with Managed Identity enabled:
```bash
az group create --name myAKSResourceGroup --location eastus
az aks create --resource-group myAKSResourceGroup --name myAKSCluster --node-count 2 --generate-ssh-keys

```


3. Download the secure cluster access credentials to configure `kubectl`:
```bash
az aks get-credentials --resource-group myAKSResourceGroup --name myAKSCluster

```


4. Verify the connection and infrastructure readiness by running `kubectl get nodes` and `kubectl cluster-info`.



### Deploying Your First Application to AKS (Pods, Deployments, Services)

**Objective:** Understand declarative Kubernetes manifests, self-healing application instances, and external networking.

* **Step-by-Step Demo Guide:**
1. Create a `deployment.yaml` file to pull the image generated in Demo 2, defining `replicas: 3` for high availability.
2. Create a `service.yaml` file defined as type `LoadBalancer` to expose the application to the internet via a Public IP.
3. Apply both configurations using `kubectl apply -f deployment.yaml` and `kubectl apply -f service.yaml`.
4. Monitor pod initialization live using `kubectl get pods -w`.
5. Execute `kubectl get service` to retrieve the **External IP**, then paste it into a browser to demonstrate automated traffic routing across pods.



---

## Advanced CI/CD Pipeline (GitHub Actions to AKS)

### Secure Automated CD with GitHub Actions and AKS via OIDC

**Objective:** Implement a keyless, passwordless secure deployment pipeline using OpenID Connect (OIDC) and automate application updates.

* **Step-by-Step Demo Guide:**
1. **Setup Azure OIDC:** Create an Azure Service Principal and configure Federated Credentials mapped directly to your GitHub repository (eliminating long-lived client secrets).
2. Create a comprehensive CD workflow named `deploy-to-aks.yml`:
* Authenticate with Azure using `azure/login@v2` powered by OIDC tokens.
* Set the Kubernetes target context using `azure/aks-set-context@v4`.


3. Use the `azure/k8s-deploy@v5` action to dynamically update the manifests with the newly built Image Tag and deploy to AKS.
4. Make a visible visual change in the web app code, run `git push`, and show the students the end-to-end automated cycle from code commit to an updated production site.



### Rolling Updates and Disaster Recovery (Rollbacks)

**Objective:** Manage deployment risks, understand zero-downtime updates, and execute instant rollbacks when a faulty version is deployed.

* **Step-by-Step Demo Guide:**
1. **Rolling Update:** Modify the application to "Version 2" and push it. Show how AKS handles a rolling update by systematically replacing old pods with new ones without taking the app offline via `kubectl rollout status deployment/my-app`.
2. **Simulate a Failure:** Intentionally introduce a bug into the image (e.g., a missing configuration that crashes the container). Deploy it. Show that the pods enter a `CrashLoopBackOff` state, but the existing web app remains online because Kubernetes halts the bad rollout.
3. **Rollback:** Trigger an automated rollback via a fallback GitHub Actions workflow (or execute `kubectl rollout undo deployment/my-app` locally) to instantaneously restore the last stable state.
