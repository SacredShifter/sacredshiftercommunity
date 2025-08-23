import * as pulumi from "@pulumi/pulumi";

// Create a new Pulumi config object
const config = new pulumi.Config();

// Application configuration
const appConfig = {
    domain: config.require("domain"),
    repo: config.get("repo") || "github.com/sacred-shifter/sacred-shifter",
    imageTag: config.get("imageTag") || "latest",
};

// Supabase configuration (secrets)
const supabaseConfig = {
    url: config.require("supabaseUrl"),
    anonKey: config.requireSecret("supabaseAnonKey"),
};

// CORS configuration
const corsConfig = {
    allowlist: config.requireObject<string[]>("corsAllowlist"),
};

// Export the configuration values as stack outputs
export const appDomain = appConfig.domain;
export const appRepo = appConfig.repo;
export const appImageTag = appConfig.imageTag;
export const supabaseUrl = supabaseConfig.url;
export const corsAllowlist = corsConfig.allowlist;
// Note: Secrets are not exported as they would be revealed in the state file.
// We will pass them to the application environment securely in a later step.
