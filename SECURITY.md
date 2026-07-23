
# Security Policy

## Overview

The Zora Quiz Application is committed to ensuring the security and integrity of our software. We value the contributions of the security community in identifying and responsibly disclosing vulnerabilities. This policy outlines the supported versions of our project, how to report security vulnerabilities, and our commitment to addressing them promptly.

## Supported Versions

The following versions of the Zora Quiz Application are currently supported with security updates. We recommend using the latest supported version to ensure you receive all security patches.

| Version | Supported | Notes |
|---------|-----------|-------|
| 1.1.x   | ✅         | Latest stable release, receives all security updates. |
| 1.0.x   | ✅         | Supported for critical security fixes only. |
| < 1.0   | ❌         | End-of-life, no security updates provided. |

> Note: Version numbers are based on semantic versioning (e.g., MAJOR.MINOR.PATCH). Check the Releases page for the latest version. If your project uses a different versioning scheme, please update this table accordingly.

## Reporting a Vulnerability

We encourage security researchers and users to report any potential vulnerabilities in the Zora Quiz Application. Please follow these guidelines to ensure a smooth and responsible disclosure process:

### Where to Report:
- Submit vulnerabilities via a private issue on our GitHub repository: [https://github.com/CGD595/PRJ303_Group4/issues](https://github.com/CGD595/PRJ303_Group4/issues).
- Alternatively, email us at [your-email@example.com] (replace with your project maintainer's email).
- For sensitive issues, use GitHub's Security Advisory feature to create a private draft: [https://github.com/CGD595/PRJ303_Group4/security/advisories](https://github.com/CGD595/PRJ303_Group4/security/advisories).

### What to Include:
- A detailed description of the vulnerability, including the affected component (e.g., `/api/questions`, Clerk authentication).
- Steps to reproduce the issue, including any proof-of-concept code or payloads.
- Potential impact (e.g., data exposure, unauthorized access).
- Your contact information for follow-up.

### Our Response Process:
- **Acknowledgment:** We will acknowledge receipt of your report within 48 hours.
- **Investigation:** Our team will investigate and validate the vulnerability within 7 business days.
- **Update Frequency:** We’ll provide updates on the status every 7 days or sooner if significant progress is made.
- **Resolution:** If the vulnerability is accepted, we’ll release a fix in the next patch release (e.g., 1.1.1) and credit you (unless you prefer anonymity). If declined, we’ll explain the reason (e.g., not reproducible, out of scope).

### Expectations:
- **Accepted Vulnerabilities:** We’ll prioritize fixes based on severity (e.g., CVSS score) and issue a CVE if applicable.
- **Declined Vulnerabilities:** We may decline reports that are low-risk, already mitigated, or outside our scope (e.g., third-party dependencies like Clerk).
- **Responsible Disclosure:** Please do not publicly disclose the vulnerability until we’ve released a fix and notified users.

## Scope

- **In Scope:** Vulnerabilities in the Zora Quiz Application code, including Next.js routes (`/api/questions`, `/api/game`), frontend components, and database interactions.
- **Out of Scope:** Third-party services (e.g., Clerk, Google Gemini API, Vercel), unless the vulnerability stems from our configuration.

## Safe Harbor

We will not pursue legal action against researchers who act in good faith, follow this policy, and do not cause harm (e.g., no data deletion or unauthorized access).

## Security Best Practices

To enhance the security of the Zora Quiz Application, we recommend the following:

- **Keep Dependencies Updated:** Regularly run `npm audit fix` to address vulnerabilities (e.g., the 10 vulnerabilities reported in your build log).
- **Secure API Keys:** Store sensitive keys like `NEXT_PUBLIC_GEMINI_API_KEY` in Vercel Environment Variables, not in source code.
- **Authentication:** Leverage Clerk’s secure authentication (`ClerkProvider` in `app/layout.jsx`) and validate user inputs in API routes.
- **Cron Jobs:** Restrict cron job endpoints (e.g., `/api/questions`) to internal calls and monitor execution with tools like Healthchecks.io.
- **Input Validation:** Use Zod schemas (as in `getQuestionsSchema`) to validate all API inputs.
- **Database Security:** Sanitize database queries using Drizzle ORM’s parameterized queries to prevent SQL injection.

## Contact

For questions about this policy or to follow up on a reported vulnerability, contact the maintainers via GitHub Issues or [your-email@example.com].

## Acknowledgments

We thank all security researchers who help keep the Zora Quiz Application safe. Credits for reported vulnerabilities will be listed in our release notes (with your permission).
