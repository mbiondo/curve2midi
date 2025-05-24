export interface PolynomialSegment {
	domain_start: number
	domain_end: number
	a3: number
	a2: number
	a1: number
	a0: number
	expression: string
	svg: string
}

export interface LandscapeData {
	segments: PolynomialSegment[]
}

export interface MelodyNote {
	midiNote: number
	duration: number
	velocity: number
	startTime: number
}

export interface GeneratedMelody {
	tempoBPM: number
	notes: MelodyNote[]
}

/**
 * Evaluates a cubic polynomial at a given x-value.
 */
function evaluatePolynomial(x: number, a3: number, a2: number, a1: number, a0: number): number {
	return a3 * Math.pow(x, 3) + a2 * Math.pow(x, 2) + a1 * x + a0
}

/**
 * Generates a melody from landscape polynomial segments.
 * @param landscapeData The parsed JSON data containing polynomial segments.
 * @param options Configuration options for melody generation.
 */
export function generateMelody(
	landscapeData: LandscapeData,
	options: {
		minPitch: number
		maxPitch: number
		baseDuration: number
		targetNotesPerDomainUnit: number
		tempoBPM: number
		velocityScale: number
	}
): GeneratedMelody {
	const { minPitch, maxPitch, baseDuration, targetNotesPerDomainUnit, tempoBPM, velocityScale } = options
	const notes: MelodyNote[] = []
	let currentTime = 0

	let overallMinY = Infinity
	let overallMaxY = -Infinity

	for (const segment of landscapeData.segments) {
		const { domain_start, domain_end, a3, a2, a1, a0 } = segment
		const segmentWidth = domain_end - domain_start
		const currentPointsPerSegment = Math.max(1, Math.round(segmentWidth / targetNotesPerDomainUnit))
		const step = segmentWidth / currentPointsPerSegment

		for (let i = 0; i <= currentPointsPerSegment; i++) {
			const x = domain_start + i * step
			const y = evaluatePolynomial(x, a3, a2, a1, a0)
			overallMinY = Math.min(overallMinY, y)
			overallMaxY = Math.max(overallMaxY, y)
		}
	}

	for (const segment of landscapeData.segments) {
		const { domain_start, domain_end, a3, a2, a1, a0 } = segment
		const segmentWidth = domain_end - domain_start
		const currentPointsPerSegment = Math.max(1, Math.round(segmentWidth / targetNotesPerDomainUnit))
		const step = segmentWidth / currentPointsPerSegment

		for (let i = 0; i < currentPointsPerSegment; i++) {
			const x1 = domain_start + i * step
			const y1 = evaluatePolynomial(x1, a3, a2, a1, a0)

			const x2 = domain_start + (i + 1) * step
			const y2 = evaluatePolynomial(x2, a3, a2, a1, a0)

			const normalizedY = (y1 - overallMinY) / (overallMaxY - overallMinY)
			const midiNote = Math.round(minPitch + normalizedY * (maxPitch - minPitch))

			const slope = (y2 - y1) / step
			const normalizedSlope = Math.min(1, Math.abs(slope) / 100)
			const velocity = Math.round(30 + normalizedSlope * 97 * velocityScale)

			const duration = baseDuration

			const lastNote = notes.length > 0 ? notes[notes.length - 1] : null

			if (lastNote && lastNote.midiNote === midiNote) {
				lastNote.duration += duration
			} else {
				notes.push({
					midiNote,
					duration,
					velocity: Math.max(1, Math.min(127, velocity)),
					startTime: currentTime,
				})
			}
			currentTime += duration
		}
	}

	return {
		tempoBPM,
		notes,
	}
}
