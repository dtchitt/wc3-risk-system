import { TimerEvent } from './TimerEvent';
import { TimerEventType } from './TimerEventType';

export class EventTimer {
	private static instance: EventTimer;
	private timer: timer;
	private events: Map<TimerEventType, TimerEvent> = new Map();
	private tickInterval: number;

	private constructor(tickInterval: number = 1.0) {
		this.timer = CreateTimer();
		this.tickInterval = tickInterval;
	}

	public static getInstance(): EventTimer {
		if (!EventTimer.instance) {
			EventTimer.instance = new EventTimer();
		}

		return EventTimer.instance;
	}

	public start(): void {
		TimerStart(this.timer, this.tickInterval, true, () => {
			this.update();
		});
	}

	public stop(): void {
		this.events.forEach((event) => this.stopEvent(event.id));
	}

	public addEvent(id: TimerEventType, interval: number, callback: () => void, repeating: boolean = false): void {
		this.events.set(id, {
			id: id,
			interval: interval,
			remainingTime: interval,
			callback: callback,
			repeating: repeating,
		});
	}

	public stopEvent(id: TimerEventType): void {
		this.removeEvent(id);
	}

	private update(): void {
		this.events.forEach((event) => {
			event.remainingTime -= this.tickInterval;
			if (event.remainingTime <= 0) {
				event.callback();
				if (event.repeating) {
					event.remainingTime = event.interval;
				} else {
					this.removeEvent(event.id);
				}
			}
		});
	}

	private removeEvent(id: TimerEventType): void {
		this.events.delete(id);
	}
}
