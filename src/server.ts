/**
 * MIDI Generation Service
 *
 * This service exposes an HTTP API to generate a MIDI file from landscape data.
 *
 * Endpoints:
 *   POST /generate-midi
 *     - Accepts a JSON body with landscape data (array of segments).
 *     - Generates a melody based on the landscape and returns a downloadable MIDI file.
 *     - Request body example:
 *         {
 *           "segments": [
 *             { "domain": 0, "range": 0 },
 *             { "domain": 1, "range": 1 }
 *           ]
 *         }
 *     - Response: MIDI file (audio/midi) as attachment.
 *     - Errors:
 *         400 - Invalid input (missing or malformed segments array)
 *         500 - Internal server error
 *
 *   All other routes:
 *     - Returns 404 Not Found (JSON).
 *
 * Usage:
 *   - Start the server: `npm run dev` or `ts-node src/server.ts`
 *   - POST to http://localhost:3000/generate-midi with valid landscape data.
 *
 * Dependencies:
 *   - Express.js for HTTP server
 *   - Custom melody and MIDI generation logic in ./lib/generateMelody and ./lib/generateMidi
 *
 * Exports:
 *   - app: The Express application instance (for testing)
 */

import express, { Request, Response, RequestHandler } from "express"
import fs from "fs"
import path from "path"
import { generateMelody, LandscapeData, GeneratedMelody } from "./lib/generateMelody"
import { generateMidiFromMelody } from "./lib/generateMidi"

const app = express()
const PORT = process.env.PORT || 3000

/**
 * Handler for POST /generate-midi
 *
 * Receives landscape data, generates a melody, writes a MIDI file, and sends it as a download.
 * Cleans up the generated file after sending.
 */
const generateMidiHandler: RequestHandler = async (req, res, next) => {
	try {
		const landscapeData = req.body as LandscapeData
		if (!landscapeData || !Array.isArray(landscapeData.segments)) {
			res.status(400).json({ error: "Invalid input: missing or malformed segments array." })
			return
		}

		const melodyOptions = {
			minPitch: 60,
			maxPitch: 72,
			baseDuration: 0.16,
			targetNotesPerDomainUnit: 50,
			tempoBPM: 120,
			velocityScale: 3,
		}

		// Generate melody from landscape data
		const generatedMelody: GeneratedMelody = generateMelody(landscapeData, melodyOptions)
		const outputDir = path.join(__dirname, "../output")
		const outputMidiPath = path.join(outputDir, "wave-melody.mid")

		// Ensure output directory exists
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true })
		}

		// Generate MIDI file from melody
		await generateMidiFromMelody(generatedMelody, outputMidiPath)

		// Send the MIDI file as a download and clean up after sending
		res.download(outputMidiPath, "wave-melody.mid", (err) => {
			if (err) {
				console.error("Error sending MIDI file:", err)
				if (!res.headersSent) {
					res.status(500).json({ error: "Failed to send MIDI file." })
				}
			}
		})
	} catch (error) {
		console.error("Error in /generate-midi:", error)
		next(error)
	}
}

app.use(express.json({ limit: "2mb" }))

// Register the MIDI generation endpoint
app.post("/generate-midi", generateMidiHandler)

// 404 handler for all other routes
app.use((req: Request, res: Response) => {
	res.status(404).json({ error: "Not found" })
})

// Start the server if run directly
app.listen(PORT, () => {
	console.log(`MIDI generation service running on port ${PORT}`)
})

/**
 * Export the Express app instance for testing purposes.
 */
export { app }
