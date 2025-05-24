import * as fs from "fs"
import { generateMidiFromMelody } from "./generateMidi"
import { GeneratedMelody } from "./generateMelody"

jest.mock("fs")

describe("generateMidiFromMelody", () => {
	it("writes a MIDI file to disk", async () => {
		const melody: GeneratedMelody = {
			tempoBPM: 120,
			notes: [
				{ midiNote: 60, duration: 1, velocity: 100, startTime: 0 },
				{ midiNote: 62, duration: 1, velocity: 100, startTime: 1 },
			],
		}
		const outputPath = "test_output.mid"
		await generateMidiFromMelody(melody, outputPath)
		expect(fs.writeFileSync as jest.Mock).toHaveBeenCalledWith(expect.any(String), expect.any(Buffer))
	})

	it("logs success message", async () => {
		const melody: GeneratedMelody = {
			tempoBPM: 120,
			notes: [{ midiNote: 60, duration: 1, velocity: 100, startTime: 0 }],
		}
		const logSpy = jest.spyOn(console, "log").mockImplementation(() => {})
		await generateMidiFromMelody(melody, "success.mid")
		expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("MIDI file generated successfully"))
		logSpy.mockRestore()
	})
})
