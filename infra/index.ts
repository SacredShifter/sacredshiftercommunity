import * as pulumi from "@pulumi/pulumi";
const cfg = new pulumi.Config();
export const appDomain = cfg.get("app.domain") || "sacredshifter.app";
export const corsAllowlist = cfg.get("cors.allowlist") || "https://sacredshifter.app";
