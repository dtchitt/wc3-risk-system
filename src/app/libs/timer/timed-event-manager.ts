import { TimedEvent } from './timed-event';

export class TimedEventManager {
	private timer: timer;
	private tick: number;
	private timedEvents: Set<TimedEvent>;
	private static instance: TimedEventManager;

	private constructor() {
		this.timer = CreateTimer();
		this.tick = 1;
		this.timedEvents = new Set<TimedEvent>();

		TimerStart(this.timer, this.tick, true, () => {
			this.onTick();
		});
	}

	public static getInstance(): TimedEventManager {
		if (!TimedEventManager.instance) {
			TimedEventManager.instance = new TimedEventManager();
		}

		return TimedEventManager.instance;
	}

	public registerTimedEvent(duration: number, callback: () => void): TimedEvent {
		const event = new TimedEvent(duration, callback);
		this.timedEvents.add(event);

		return event;
	}

	public removeTimedEvent(timedEvent: TimedEvent): void {
		this.timedEvents.delete(timedEvent);
	}

	private onTick(): void {
		const expiredEvents: TimedEvent[] = [];

		this.timedEvents.forEach((event) => {
			event.execute();

			if (event.tick()) {
				expiredEvents.push(event);
			}
		});

		expiredEvents.forEach((event) => this.timedEvents.delete(event));
	}
}
