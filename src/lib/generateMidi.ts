import * as fs from "fs"
import * as MidiWriter from "midi-writer-js"
import { GeneratedMelody } from "./generateMelody"

/**
 * Generates a MIDI file from melody data.
 * @param melodyData The generated melody object.
 * @param outputMidiPath The path where the MIDI file will be saved.
 */
export async function generateMidiFromMelody(melodyData: GeneratedMelody, outputMidiPath: string) {
	try {
		const Track = (MidiWriter as any).Track || (MidiWriter as any).default?.Track
		const NoteEvent = (MidiWriter as any).NoteEvent || (MidiWriter as any).default?.NoteEvent
		const Writer = (MidiWriter as any).Writer || (MidiWriter as any).default?.Writer

		if (!Track || !NoteEvent || !Writer) {
			throw new Error("Error loading MidiWriter classes. Please check the import path or library version.")
		}

		const track = new Track()

		track.setTempo(melodyData.tempoBPM)

		for (const note of melodyData.notes) {
			track.addEvent(
				[
					new NoteEvent({
						pitch: [note.midiNote],
						velocity: note.velocity,
						duration: `T${Math.round(note.duration * 480)}`,
					}),
				],
				function (index: number, event: any) {
					event.tick = Math.round(note.startTime * 480)
					return event
				}
			)
		}

		const writer = new Writer(track)
		const base64Midi = writer.base64()

		const midiBuffer = Buffer.from(base64Midi, "base64")
		fs.writeFileSync(outputMidiPath, midiBuffer)

		console.log(`MIDI file generated successfully: ${outputMidiPath}`)
	} catch (error) {
		console.error("Error generating MIDI:", error)
		throw error
	}
}
