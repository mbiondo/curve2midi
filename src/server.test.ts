import request from "supertest"
import fs from "fs"
import path from "path"
import { app } from "./server"

const OUTPUT_DIR = path.join(__dirname, "../output")
const OUTPUT_MIDI = path.join(OUTPUT_DIR, "wave-melody.mid")

describe("POST /generate-midi", () => {
	afterEach(() => {
		if (fs.existsSync(OUTPUT_MIDI)) {
			fs.unlinkSync(OUTPUT_MIDI)
		}
	})

	it("should return 400 for invalid input", async () => {
		const res = await request(app)
			.post("/generate-midi")
			.send({ invalid: "data" })
			.set("Content-Type", "application/json")
		expect(res.status).toBe(400)
		expect(res.body.error).toBeDefined()
	})

	it("should return a midi file for valid input", async () => {
		const validBody = {
			segments: [
				{ domain: 0, range: 0 },
				{ domain: 1, range: 1 },
			],
		}
		const res = await request(app).post("/generate-midi").send(validBody).set("Content-Type", "application/json")
		expect(res.status).toBe(200)
		expect(res.header["content-type"]).toBe("audio/midi")
		expect(res.header["content-disposition"]).toContain("wave-melody.mid")
	})
})
