# MIDI Generation Service

This project provides an HTTP API to generate MIDI files from landscape data using Node.js, Express, and custom melody/MIDI generation logic.

## Features

- **POST /generate-midi**: Accepts landscape data and returns a downloadable MIDI file.
- Input validation and error handling.
- Cleans up generated files after download.
- Ready for integration and automated testing.

## API Endpoints

### `POST /generate-midi`

Generates a melody based on the provided landscape data and returns a MIDI file.

- **Request Body (JSON):**
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
  - `segments`: Array of objects, each with polynomial coefficients, domain, SVG, and expression.
  - `svg`, `segment_svgs`, `coords`: Optional extra fields for visualization (not required for MIDI generation).

- **Response:**
  - `200 OK`: Returns a MIDI file (`audio/midi`) as an attachment.
  - `400 Bad Request`: If the input is missing or malformed.
  - `500 Internal Server Error`: On server errors.

### All Other Routes

- Returns `404 Not Found` with a JSON error message.

## Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```
   or
   ```bash
   ts-node src/server.ts
   ```

3. **Send a POST request to generate a MIDI file:**
   - URL: `http://localhost:3000/generate-midi`
   - Content-Type: `application/json`
   - Body: See example above or use [`dummy/example.json`](dummy/example.json).

4. **Download the generated MIDI file** from the response.

## Project Structure

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

## Testing

Automated tests are provided using [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest).

- **Run tests:**
  ```bash
  npm test
  ```

- Tests cover:
  - Valid and invalid input for `/generate-midi`
  - Response status and headers
  - File cleanup

## Dependencies

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/) (dev)
- [Supertest](https://github.com/ladjs/supertest) (dev)
- Custom melody and MIDI generation logic in `src/lib/`

## Development Notes

- The Express app is exported for testing purposes.
- The server listens on port `3000` by default (configurable via `PORT` env variable).
- Generated MIDI files are stored temporarily in the `output/` directory and deleted after download.

## License

MIT License

---

**Author:**  
Maximiliano Biondo
