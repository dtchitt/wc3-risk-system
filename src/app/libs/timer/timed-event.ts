export class TimedEvent {
	private _duration: number;
	private callback: Function;

	public constructor(duration: number, eventCallback: () => void) {
		this.duration = duration;
		this.callback = eventCallback;
	}

	public tick(): boolean {
		this.duration--;
		return this.isExpired();
	}

	public execute(): void {
		this.callback();
	}

	private isExpired(): boolean {
		return this.duration <= 0;
	}

	public get duration(): number {
		return this._duration;
	}

	public set duration(value: number) {
		this._duration = value;
	}
}
