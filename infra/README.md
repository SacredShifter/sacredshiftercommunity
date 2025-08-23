# Sacred Shifter Infrastructure

This directory contains the Infrastructure as Code (IaC) for the Sacred Shifter platform, managed by Pulumi.

## Stacks

This project contains two stacks:
- `staging`: The staging environment.
- `prod`: The production environment.

## Configuration

To deploy a stack, you must first set the required configuration values.

### Staging Configuration

Run the following commands to configure the `staging` stack:

```bash
# Select the staging stack
pulumi stack select staging

# Set application configuration
pulumi config set domain staging.sacredshifter.app
pulumi config set repo "github.com/sacred-shifter/sacred-shifter"
pulumi config set imageTag "latest"

# Set Supabase configuration (replace with actual values)
pulumi config set supabaseUrl "https://<your-project-ref>.supabase.co"
pulumi config set --secret supabaseAnonKey "<your-supabase-anon-key>"

# Set CORS configuration
pulumi config set --path 'corsAllowlist[0]' "https://staging.sacredshifter.app"
pulumi config set --path 'corsAllowlist[1]' "http://localhost:8080"
```

### Production Configuration

Run the following commands to configure the `prod` stack:

```bash
# Select the production stack
pulumi stack select prod

# Set application configuration
pulumi config set domain sacredshifter.app
pulumi config set repo "github.com/sacred-shifter/sacred-shifter"
# imageTag should be set by CI/CD to a specific git commit hash

# Set Supabase configuration (replace with actual values)
pulumi config set supabaseUrl "https://<your-prod-project-ref>.supabase.co"
pulumi config set --secret supabaseAnonKey "<your-prod-supabase-anon-key>"

# Set CORS configuration
pulumi config set --path 'corsAllowlist[0]' "https://sacredshifter.app"
```

## Next Steps

1. **Choose a Runtime Target:** Decide on a cloud provider and service for running the `aura-core` container (e.g., Fly.io, Render, Cloud Run, ECS).
2. **Container Registry:** Set up a container registry (like GHCR) to store the `aura-core` Docker image.
3. **App Service Definition:** Define the Pulumi resources to deploy the `aura-core` service, including environment variable mapping for secrets.
4. **Blue/Green Deployments:** Implement a blue/green deployment strategy for zero-downtime updates.
5. **Secrets Flow:** Implement the flow of secrets from Pulumi configuration to the application's runtime environment.
