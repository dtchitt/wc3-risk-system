/**
 * Represents a single timed event that executes a callback after a specified duration.
 */
export class TimedEvent {
	private _duration: number;
	private callback: Function;

	/**
	 * Creates a new TimedEvent.
	 * @param duration - The number of ticks before the event triggers.
	 * @param eventCallback - The function to execute when the event triggers.
	 */
	public constructor(duration: number, eventCallback: () => void) {
		this.duration = duration;
		this.callback = eventCallback;
	}

	/**
	 * Reduces the remaining duration by 1 and checks if the event is expired.
	 * @returns A boolean indicating if the event has expired.
	 */
	public tick(): boolean {
		this.duration--;
		return this.isExpired();
	}

	/**
	 * Executes the callback function of this event.
	 */
	public execute(): void {
		this.callback();
	}

	/**
	 * Checks if the event is expired.
	 * @returns A boolean indicating if the event has expired.
	 */
	private isExpired(): boolean {
		return this.duration <= 0;
	}

	/**
	 * @returns The remaining duration before the event triggers.
	 */
	public get duration(): number {
		return this._duration;
	}

	/**
	 * Sets the remaining duration before the event triggers.
	 * @param value - The new duration value.
	 */
	public set duration(value: number) {
		this._duration = value;
	}
}
