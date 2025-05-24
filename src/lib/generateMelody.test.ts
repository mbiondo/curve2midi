import { generateMelody, LandscapeData, GeneratedMelody } from "./generateMelody"

describe("generateMelody", () => {
	it("generates a melody with correct tempo and notes", () => {
		const landscapeData: LandscapeData = {
			segments: [
				{
					domain_start: 0,
					domain_end: 2,
					a3: 0,
					a2: 0,
					a1: 1,
					a0: 60,
					expression: "",
					svg: "",
				},
			],
		}
		const options = {
			minPitch: 60,
			maxPitch: 72,
			baseDuration: 1,
			targetNotesPerDomainUnit: 2,
			tempoBPM: 100,
			velocityScale: 1,
		}
		const melody: GeneratedMelody = generateMelody(landscapeData, options)
		expect(melody.tempoBPM).toBe(100)
		expect(Array.isArray(melody.notes)).toBe(true)
		expect(melody.notes.length).toBeGreaterThan(0)
	})

	it("returns empty notes if no segments", () => {
		const landscapeData: LandscapeData = { segments: [] }
		const options = {
			minPitch: 60,
			maxPitch: 72,
			baseDuration: 1,
			targetNotesPerDomainUnit: 2,
			tempoBPM: 100,
			velocityScale: 1,
		}
		const melody = generateMelody(landscapeData, options)
		expect(melody.notes.length).toBe(0)
	})

	it("normalizes pitches within min and max", () => {
		const landscapeData: LandscapeData = {
			segments: [
				{
					domain_start: 0,
					domain_end: 1,
					a3: 0,
					a2: 0,
					a1: 0,
					a0: 0,
					expression: "",
					svg: "",
				},
				{
					domain_start: 1,
					domain_end: 2,
					a3: 0,
					a2: 0,
					a1: 0,
					a0: 100,
					expression: "",
					svg: "",
				},
			],
		}
		const options = {
			minPitch: 60,
			maxPitch: 72,
			baseDuration: 1,
			targetNotesPerDomainUnit: 1,
			tempoBPM: 120,
			velocityScale: 1,
		}
		const melody = generateMelody(landscapeData, options)
		for (const note of melody.notes) {
			expect(note.midiNote).toBeGreaterThanOrEqual(60)
			expect(note.midiNote).toBeLessThanOrEqual(72)
		}
	})
})
