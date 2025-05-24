import { exec } from "child_process"

/**
 * Converts a MIDI file to WAV using fluidsynth.
 * @param midiPath Path to the MIDI file.
 * @param wavPath Output WAV file path.
 * @param soundfontPath Path to a .sf2 soundfont file.
 */
export function midiToWav(midiPath: string, wavPath: string, soundfontPath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const cmd = `fluidsynth -ni "${soundfontPath}" "${midiPath}" -F "${wavPath}" -r 44100`
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				reject(new Error(`fluidsynth error: ${stderr || error.message}`))
			} else {
				resolve()
			}
		})
	})
}

/**
 * Converts a WAV file to MP3 using ffmpeg.
 * @param wavPath Path to the WAV file.
 * @param mp3Path Output MP3 file path.
 */
export function wavToMp3(wavPath: string, mp3Path: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const cmd = `ffmpeg -y -i "${wavPath}" "${mp3Path}"`
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				reject(new Error(`ffmpeg error: ${stderr || error.message}`))
			} else {
				resolve()
			}
		})
	})
}
