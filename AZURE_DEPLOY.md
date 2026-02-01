Deploying to Azure Static Web Apps

1) Create the Static Web App in the Azure Portal or using the Azure CLI
   - Portal: Create -> Static Web Apps -> choose Free/Standard plan -> connect to GitHub -> select repo `StxChange/redline` and branch `main`.
   - CLI example (requires Azure CLI and extension):
     az login
     az staticwebapp create -n my-redline-app -g MyResourceGroup --source https://github.com/StxChange/redline --branch main --location "Central US" --sku Free

2) Get the deployment token (if using manual creation):
   - In Azure Portal, open the Static Web App resource -> Deployment Center -> click the 'Manage deployment token' link and copy the token.

3) Add the token to GitHub Secrets:
   - Repo -> Settings -> Secrets -> Actions -> New repository secret
   - Name: AZURE_STATIC_WEB_APPS_API_TOKEN
   - Value: <paste the token you copied>

4) Push your code to `main` (already done). The GitHub Action `azure-static-web-apps.yml` will run on push and deploy the site.

Notes:
- If your site requires a build (npm, hugo, etc.), update the workflow `app_location` and `output_location` and ensure your build command runs in the Action.
- For custom domain, TLS, or staging, configure in the Azure Portal after the first deployment.
