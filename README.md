# ReqRes API Automation Framework

This repository contains a robust, industry-standard API automation framework built to test the [ReqRes Mock API](https://reqres.in/). 

The framework is developed using **TypeScript**, **Axios**, **Mocha**, and **Chai**, adhering strictly to enterprise testing patterns including Data-Driven execution, POJO validation, and comprehensive Positive/Negative coverage.

---

## 🏗 Architecture & Design Patterns

* **Data-Driven Testing:** All test suites use parameterization arrays (e.g., `validScenarios.forEach(...)`). This allows infinite horizontal scaling of test cases without copying and pasting `it` blocks.
* **POJO Data Models:** We utilize Plain Old JavaScript Objects (POJOs) located in `src/models/` (like `user.ts` and `page.ts`). These enforce strict runtime type safety and ensure our API payloads match expected schemas perfectly.
* **Client-Service Pattern:** All raw Axios HTTP requests are abstracted into `src/clients/user.client.ts`. The test files never call `axios` directly for standard operations, ensuring separation of concerns.
* **Environment Management:** The base URL and API keys are abstracted away into an `.env` file and managed by `src/utils/api.ts`.

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
* **Node.js** (v16.x or higher recommended)
* **npm** (Node Package Manager)

---

## 🚀 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd api-automation-reqres
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (or rename `.env.example` if it exists) and add the following:
   ```env
   BASE_URL=https://reqres.in/api
   API_KEY=your-secret-api-key
   ```

---

## 🏃‍♂️ Running the Tests

To execute the entire test suite, simply run:
```bash
npm test
```

To run a specific test file, use `npx mocha`:
```bash
npx mocha -r ts-node/register tests/api/get.user.spec.ts
```

### 🏷 Running Specific Tags (e.g., @smoke)
Unlike Cucumber which has native `@` annotations, Mocha uses standard text filtering via the `--grep` flag. 

To create a tagged test, simply add the tag directly into the test description in your code:
```typescript
it('@smoke Positive: Should Create a New User', async () => { ... })
```

Then, execute only the tagged tests from the terminal by passing the grep flag:
```bash
npx mocha -r ts-node/register tests/**/*.spec.ts --grep "@smoke"
```

---

## 🧪 Test Coverage

The suite covers all standard RESTful operations for the `/users` endpoint:

1. **GET `/users/:id`** - Fetching a single user.
2. **GET `/users?page=:page`** - Fetching paginated user lists (validating metadata and array sizing).
3. **POST `/users`** - Creating a user with various payload combinations.
4. **PUT `/users/:id`** - Updating a user completely.
5. **DELETE `/users/:id`** - Removing a user.

### Acceptance Criteria Evaluated
For every endpoint, the following acceptance criteria are structurally evaluated:
* **Positive Scenarios:** Valid inputs resulting in `200 OK`, `201 Created`, or `204 No Content`.
* **Negative Scenarios:** Invalid IDs, null payloads, or missing fields.
* **Security Scenarios:** Invalid or missing API keys.

---

## ⚠️ Notes on ReqRes Mock API Limitations



https://github.com/user-attachments/assets/e1b17a01-914a-4811-8623-f1c2a9820161



Because ReqRes is a public, free mock server, it lacks the strict backend validation of a real enterprise application. 

**Skipped Tests (`it.skip`)**
You will notice that several Negative and Security tests are marked as `it.skip` in the code. This is an intentional architectural decision. The ReqRes mock server blindly accepts invalid inputs (like `null` payloads) and returns a `200 OK` when it *should* return a `400 Bad Request`. Rather than deleting these tests or allowing them to fail the CI/CD pipeline, they are documented and skipped. If pointed at a real enterprise backend, these `it.skip` blocks would be changed to `it` and would execute perfectly.

**Rate Limiting (429 Error)**
The free tier of ReqRes imposes a hard limit of **250 requests per day per IP Address**. If you run the full `npm test` suite multiple times rapidly, you will receive a `429 Too Many Requests` error and will be locked out until midnight UTC.
