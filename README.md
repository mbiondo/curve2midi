# MIDI Alchemy: Transforming Data into Melody 🎶

Unleash the power of sound with our MIDI Generation Service – an innovative HTTP API crafted with Node.js and Express, designed to breathe musical life into your landscape data. This service takes intricate landscape metrics and transmutes them into captivating MIDI files, providing a seamless bridge between visual data and auditory experiences.

> **Note:** This service is the auditory counterpart to your visual data. Ensure you're generating your landscape data (curves and segments) using [wave-generator](https://github.com/mbiondo/wave-generator) to fully leverage the capabilities of this MIDI generator.

## ✨ Features at a Glance

* **POST /generate-midi**: The core of our service, accepting detailed landscape data and returning a downloadable MIDI file.
* Robust input validation and comprehensive error handling for smooth operations.
* Automated file cleanup: Generated MIDI files are ephemeral, vanishing after download to maintain a tidy environment.
* Engineered for integration and automated testing, ensuring reliability and ease of use in any pipeline.

## 🚀 API Endpoints

### `POST /generate-midi`

Transform your landscape data into a unique melody and receive a MIDI file.

* **Request Body (JSON):**
    ```json
    {
      "segments": [
        {
          "domain_start": 0,
          "domain_end": 32,
          "a3": -0.0010985088072372683,
          "a2": 0.2388576398301158,
          "a1": -6.567591063795859,
          "a0": 575.4061624649855,
          "expression": "for x ∈ [0,32]: y = -0.001099·x³ +0.238858·x² -6.567591·x +575.406162",
          "svg": "<svg ... />"
        }
        // ... more segments ...
      ],
      "svg": "<svg ... />",
      "segment_svgs": ["<svg ... />", "..."],
      "coords": [[0, 482], [1, 624], "..."]
    }
    ```
    * `segments`: An array of objects, each detailing polynomial coefficients, domain, SVG representation, and the mathematical expression of a landscape segment.
    * `svg`, `segment_svgs`, `coords`: Optional fields for visualization purposes, not essential for MIDI generation.

* **Response:**
    * `200 OK`: A MIDI file (`audio/midi`) delivered as an attachment, ready for download.
    * `400 Bad Request`: Signifies missing or malformed input.
    * `500 Internal Server Error`: Indicates a server-side issue.

### All Other Routes

* Any other requests will receive a `404 Not Found` response with a clear JSON error message.

## 🛠️ Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start the Server:**
    ```bash
    npm run dev
    ```
    Alternatively, use:
    ```bash
    ts-node src/server.ts
    ```

3.  **Generate Your MIDI:**
    Send a `POST` request to `http://localhost:3000/generate-midi`.
    * Set `Content-Type`: `application/json`.
    * For the request body, refer to the example above or utilize the provided [`dummy/example.json`](dummy/example.json).

4.  **Download:** Retrieve your newly generated MIDI file from the response.

## 📂 Project Blueprint

```
src/
  server.ts         # Main Express server
  server.test.ts    # Automated tests (Jest + Supertest)
  lib/
    generateMelody.ts
    generateMidi.ts
output/             # Temporary directory for generated MIDI files
dummy/
  example.json      # Example input for POST /generate-midi
```

## 🧪 Testing the Waters

Our service comes with comprehensive automated tests using [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest) to guarantee reliability.

* **Run Tests:**
    ```bash
    npm test
    ```

* **Test Coverage Includes:**
    * Valid and invalid input scenarios for `/generate-midi`.
    * Verification of response statuses and headers.
    * Confirmation of proper file cleanup.

## 🔗 Core Dependencies

* [Express](https://expressjs.com/): The robust web application framework.
* [TypeScript](https://www.typescriptlang.org/): For scalable and maintainable code.
* [Jest](https://jestjs.io/) (dev): Our preferred testing framework.
* [Supertest](https://github.com/ladjs/supertest) (dev): For HTTP assertions in tests.
* Custom melody and MIDI generation logic residing in `src/lib/`.

## 📝 Development Insights

* The Express application is thoughtfully exported for seamless testing integration.
* The server defaults to port `3000`, easily customizable via the `PORT` environment variable.
* Generated MIDI files are temporarily housed in the `output/` directory and are automatically removed post-download.

## ⚖️ License

MIT License
