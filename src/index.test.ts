import * as fs from "fs"
import { LandscapeData } from "./lib/generateMelody"
import { generateMelody } from "./lib/generateMelody"
import { generateMidiFromMelody } from "./lib/generateMidi"

jest.mock("fs")

describe("Melody Generation and MIDI Export", () => {
	let landscapeData: LandscapeData

	beforeEach(() => {
		// Mocked landscape data
		landscapeData = {
			segments: [
				{
					domain_start: 0,
					domain_end: 10,
					a3: 0,
					a2: 1,
					a1: 2,
					a0: 3,
					expression: "x^3 + 2x^2 + 3x + 4",
					svg: "",
				},
			],
		}
	})

	it("should generate melody from landscape data", () => {
		const melody = generateMelody(landscapeData, {
			minPitch: 60,
			maxPitch: 72,
			baseDuration: 1,
			targetNotesPerDomainUnit: 2,
			tempoBPM: 120,
			velocityScale: 1,
		})

		expect(melody).toHaveProperty("tempoBPM", 120)
		expect(melody.notes.length).toBeGreaterThan(0)
	})

	it("should generate MIDI file from melody data", async () => {
		const melody = generateMelody(landscapeData, {
			minPitch: 60,
			maxPitch: 72,
			baseDuration: 1,
			targetNotesPerDomainUnit: 2,
			tempoBPM: 120,
			velocityScale: 1,
		})

		const outputPath = "output.mid"
		await generateMidiFromMelody(melody, outputPath)

		expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), expect.any(Buffer))
		expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
	})
})
