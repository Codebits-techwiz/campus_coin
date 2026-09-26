# WORKING DRAFT for the team. The final report must be written by the team.

# AI Usage & Fallbacks

The backend integrates `@google/genai` (Gemini 2.5 Flash) for intelligent operations.

## AI Features vs Rule-Based Features
| Feature | Type | Description |
|---|---|---|
| **Monthly Insights** | AI / Generative | Generates a conversational summary of past month's spending. |
| **Saving Tips Engine** | Rule-Based | Evaluates triggers against local DB data, mapping to static templates. |
| **Tip Context Generation** | AI / Generative | (When pinned/generated) A small LLM call can provide extra context for a TipTemplate. |
| **CSV Categorization** | AI / Classification | Maps unknown merchant names to the user's existing DB Categories. |
| **Receipt OCR** | AI / Vision | Extracts amount, vendor, date, and confidence scores from an image. |
| **Anomaly Detection** | Rule-Based | Standard statistical deviation (mean + 2*stdDev) and time-bounded duplicate matching. |

## Third-Party Data Sharing
- Data sent to Google Gemini is strictly anonymized. Only Category names, aggregate totals, and merchant strings are passed in the prompt. User IDs, emails, and sensitive PII are **never** passed to the LLM.

## Fallback Mechanisms
- If the `GEMINI_API_KEY` is missing or the API errors out, the system defaults to:
  - **Insights**: Returns a hardcoded, rule-based template summary.
  - **CSV Categorization**: Leaves the category blank (`needsReview: true`).
  - **Receipts**: Rejects the scan with a 422 Unprocessable Entity gracefully (mock fallback was removed).

## Advisory Notices
- As per SRS compliance, all LLM-generated output (Monthly Insights) includes a strict boolean or text flag notifying the front end that the text is AI-generated and should not replace professional financial advice.
