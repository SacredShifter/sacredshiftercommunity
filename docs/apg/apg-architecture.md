# Aura Privacy Gateway (APG) Architecture

## 1. Overview

The Aura Privacy Gateway (APG) is a privacy-enhancing proxy designed to sit between Sacred Shifter clients and third-party AI model providers like OpenRouter. Its primary function is to minimize the exposure of sensitive user data by implementing a "two-zone" data-splitting model.

This document outlines the architecture, cryptographic principles, and data flows of the APG.

## 2. Two-Zone Data Model

The core of APG's privacy design is the separation of a user's prompt into two distinct zones:

*   **Zone A (Public Zone):** Contains the scrubbed, model-necessary portion of the prompt. This data is safe to send to external model providers. It contains no Personally Identifiable Information (PII), user identifiers, or sensitive context.
*   **Zone B (Private Zone):** Contains all sensitive and contextual user data, such as journal entries, codex contents, user/circle identifiers, and other PII. This data **never** leaves the Sacred Shifter infrastructure.

This model ensures that third-party AI providers only receive the absolute minimum information required to perform a task, without gaining access to the rich, private context of the user's digital space.

| Data Element              | Zone A (Sent to Model)                                | Zone B (Kept Private)                               |
| ------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| Prompt Core               | Yes (scrubbed of identifiers)                         | No                                                  |
| User ID                   | No                                                    | Yes (for context retrieval)                         |
| Circle/Group ID           | No                                                    | Yes (for context retrieval)                         |
| Journal Entries           | No                                                    | Yes (used for context, AEAD encrypted)              |
| Codex Content             | No                                                    | Yes (used for context, AEAD encrypted)              |
| Exact Timestamps          | No (rounded or omitted)                               | Yes (for record-keeping)                            |
| Precise Geolocation       | No (fuzzed or omitted)                                | Yes (if provided by user)                           |
| System-level Metadata   | Minimal, non-identifying (e.g., model requested)      | Full (e.g., internal request ID)                    |

## 3. APG Proxy Flow

The APG intercepts outgoing requests to AI models and processes them as follows:

1.  **Pre-processing (Split & Redact):**
    *   The client sends a single, rich `AuraGatewayRequest` to the APG.
    *   APG splits the request into Zone A and Zone B.
    *   It redacts PII and identifiers from the Zone A prompt.
    *   It encrypts the Zone B data using a per-session Data Encryption Key (DEK). The DEK itself is protected by a per-user Key Encryption Key (KEK).
    *   The encrypted Zone B payload is stored temporarily within the Sacred Shifter infrastructure.

2.  **External Call (Zone A only):**
    *   APG crafts a request to the external provider (e.g., OpenRouter) containing only the sanitized Zone A data.
    *   The request is sent over a TLS 1.3 channel.

3.  **Post-processing (Recombine & Respond):**
    *   APG receives the `OpenRouterResponse`.
    *   It retrieves the encrypted Zone B data.
    *   It decrypts the Zone B data using the session's DEK.
    *   It recombines the AI model's response with the private Zone B context to formulate a rich, context-aware `AuraGatewayResponse`.
    *   The final response is sent back to the client.

## 4. Cryptographic Baseline

APG adheres to modern, robust cryptographic standards.

*   **AEAD Cipher:** **Ascon-128** (NIST LWC winner) is used for all symmetric encryption of Zone B data. It provides Authenticated Encryption with Associated Data, ensuring confidentiality and integrity.
*   **Transport Security:** **TLS 1.3** is mandated for all network communication (client-to-APG, APG-to-OpenRouter).
*   **Key Derivation:** **Argon2id** is used for deriving keys from user credentials where applicable.
*   **Digital Signatures:** **Ed25519** is used for signing critical metadata. The signature is bound to the encrypted data using the "Associated Data" (AD) feature of the AEAD cipher, preventing tampering.

## 5. Key Lifecycle Management

*   **Key Encryption Keys (KEKs):** A long-lived, per-user KEK is stored in a secure, hardware-backed environment (e.g., AWS KMS, Google Cloud KMS, or a dedicated HSM). This key's primary role is to wrap (encrypt) session keys.
*   **Data Encryption Keys (DEKs):** A unique, per-session DEK is generated for each user interaction. It is used to encrypt the Zone B data for that specific session. The DEK is encrypted by the user's KEK and stored alongside the Zone B data.
*   **Key Rotation:** KEKs are subject to periodic rotation policies. DEKs are ephemeral by nature and are destroyed after the session ends.
*   **Cryptographic Erasure:** When a user requests data deletion, the corresponding KEK is destroyed. This renders all DEKs wrapped by it, and therefore all Zone B data encrypted with those DEKs, permanently unrecoverable.

## 6. Data Residency and Policy

*   **Default Deny:** APG enforces a strict "deny-by-default" policy for cross-border data transfers. A request originating from a specific jurisdiction will be routed to model endpoints within that same jurisdiction.
*   **User Opt-In:** A clear, explicit opt-in mechanism will be provided for users who wish to access models that are not available in their region. The consent process will clearly state the implications of transferring their (Zone A) data across borders.

## 7. Interfaces for A2 Implementation

This section defines the data shapes that the A2 implementation team will build. These are conceptual shapes, not code definitions.

---

### `AuraGatewayRequest`

*   **Description:** The initial request sent from a Sacred Shifter client to the APG.
*   **Fields:**
    *   `userId`: `string` - The unique identifier for the user.
    *   `circleId`: `string | null` - The identifier for the circle/group context, if any.
    *   `prompt`: `string` - The full, un-redacted user prompt.
    *   `context`: `object` - A rich object containing journal entries, codex data, and other sensitive information needed for the prompt.
    *   `policy`: `object` -
        *   `residency`: `string` (e.g., "EU", "US-East") - The required data residency for the model provider.
        *   `allowCrossBorder`: `boolean` - User's explicit consent for cross-border data transfer.
    *   `requestedModel`: `string` - The preferred AI model (e.g., "openai/gpt-4o").

---

### `AuraGatewayTransformed`

*   **Description:** An internal representation after APG has processed the initial request. Not exposed via API.
*   **Fields:**
    *   `zoneA_prompt`: `object` - The scrubbed prompt and metadata for the external provider.
        *   `model`: `string`
        *   `messages`: `array`
    *   `zoneB_encrypted_payload`: `string` - The Ascon-128 encrypted blob containing the original context, user identifiers, etc.
    *   `zoneB_dek_wrapped`: `string` - The per-session DEK, itself encrypted by the user's KEK.
    *   `associatedData`: `string` - The data used to bind the signature and AEAD tag.

---

### `OpenRouterResponse`

*   **Description:** A simplified representation of the response received from the external AI model provider.
*   **Fields:**
    *   `id`: `string` - The provider's unique ID for the response.
    *   `choices`: `array` -
        *   `message`: `object` -
            *   `content`: `string` - The AI-generated text.

---

### `AuraGatewayResponse`

*   **Description:** The final, rich response sent back to the Sacred Shifter client.
*   **Fields:**
    *   `originalRequestId`: `string` - Correlates to the initial `AuraGatewayRequest`.
    *   `content`: `string` - The final, recombined response, potentially enriched with private context.
    *   `usage`: `object` - Token usage and other metadata from the provider.
    *   `provenance`: `object` -
        *   `modelUsed`: `string`
        *   `provider`: `string` (e.g., "OpenRouter")
        *   `latencyMs`: `number`
        *   `zoneA_hash`: `string` - A hash of the Zone A data sent, for auditability.
