import { generateMelody, LandscapeData, GeneratedMelody } from "./lib/generateMelody"
import { generateMidiFromMelody } from "./lib/generateMidi"

import landscapeData from "../dummy/example.json"

const melodyOptions = {
	minPitch: 60,
	maxPitch: 72,
	baseDuration: 0.16,
	targetNotesPerDomainUnit: 50,
	tempoBPM: 120,
	velocityScale: 3,
}

const generatedMelody: GeneratedMelody = generateMelody(landscapeData as LandscapeData, melodyOptions)

const outputMidiPath = "output/wave-melody.mid"

generateMidiFromMelody(generatedMelody, outputMidiPath)
