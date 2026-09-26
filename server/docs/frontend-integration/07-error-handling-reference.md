
# 07 Error Handling Reference

Build a single generic error handler (e.g. an Axios interceptor) using this consolidated shape guide.

| Scenario | HTTP Status | Response Shape | Frontend Action |
| :--- | :--- | :--- | :--- |
| **Validation Error** | `400` | `{ success: false, error: "...", errors: [{ path: "amount", message: "..." }] }` | Map the `errors` array to form fields beneath the inputs. |
| **Unauthenticated** | `401` | `{ success: false, error: "Not authorized..." }` | Clear global user state, redirect to `/login`. |
| **Forbidden** | `403` | `{ success: false, error: "Access denied..." }` | Show an "Access Denied" toast. |
| **Not Found / Ownership** | `404` | `{ success: false, error: "Resource not found" }` | Redirect to a generic 404 page, or remove item from local list. |
| **Business Logic** | `409` | `{ success: false, error: "Email exists" }` | Show a generic toast error. |
| **Third-Party Fail** | `422` | `{ success: false, error: "OCR failed" }` | Show a toast instructing the user to enter data manually. |
| **Rate Limited** | `429` | `{ success: false, error: "Too many requests..." }` | Disable submit buttons temporarily. |
| **Server Crash** | `500` | `{ success: false, error: "Server Error" }` | Show a "Something went wrong" boundary. |

## Implementation Example (Axios Interceptor)

Here is a ready-to-use Axios configuration file (\`src/api.js\`) implementing these rules:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  withCredentials: true, // Crucial for receiving httpOnly cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network/CORS Error');
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        // Handled directly by the component calling the API (to show form validation errors)
        break;
      case 401:
        // Clear global state & redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;
      case 403:
        console.warn('Access denied:', data.error);
        // Dispatch global toast event here
        break;
      case 404:
        console.warn('Resource not found:', data.error);
        break;
      case 429:
        console.warn('Rate limited. Please wait.');
        break;
      case 500:
        console.error('Fatal Server Error:', data.error);
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
```
