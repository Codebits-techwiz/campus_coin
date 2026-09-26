# WORKING DRAFT for the team. The final report must be written by the team.

# Decision Log

1. **JWT in HttpOnly Cookie**
   - *Reason:* Prevents XSS attacks from stealing tokens via `localStorage` while allowing seamless automated attaching by the browser.
2. **Integer Money (Cents)**
   - *Reason:* Eliminates floating-point precision errors (e.g. 0.1 + 0.2 = 0.300000004) natively without heavy external libraries.
3. **Soft Delete (Transactions)**
   - *Reason:* Preserves historical data for ML training and audits without breaking ledger integrity; filters actively hide them from GET endpoints.
4. **Reference-Based Schema (Normalization)**
   - *Reason:* Categories and users are constantly updated independently, so referencing ObjectIds is safer than embedding massive sub-documents.
5. **Rule-Based Tips Engine**
   - *Reason:* Allows predictable, deterministic saving advice while ensuring blazing-fast execution speeds rather than waiting 3 seconds for an LLM on every page load.
6. **LLM Narrates Computed Numbers**
   - *Reason:* By computing the math natively and passing the *results* to the LLM to narrate, we prevent the LLM from hallucinating bad math or incorrect totals.
7. **Duplicate and Anomaly Flags Never Block**
   - *Reason:* Frictionless user experience. We flag it visually for the user to review later, rather than stopping a legitimate transaction that happens to look weird.
