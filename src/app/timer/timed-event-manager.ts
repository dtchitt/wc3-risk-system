import { TimedEvent } from './timed-event';

/**
 * Manages timed events, invoking callbacks after a specified duration.
 */
export class TimedEventManager {
	private timer: timer;
	private tick: number;
	private timedEvents: Set<TimedEvent>;
	private static instance: TimedEventManager;

	/**
	 * Private constructor to enforce singleton pattern.
	 */
	private constructor() {
		this.timer = CreateTimer();
		this.tick = 1;
		this.timedEvents = new Set<TimedEvent>();

		TimerStart(this.timer, this.tick, true, () => {
			this.onTick();
		});
	}

	/**
	 * Retrieves the single instance of the TimedEventManager.
	 * @returns The instance of TimedEventManager.
	 */
	public static getInstance(): TimedEventManager {
		if (!TimedEventManager.instance) {
			TimedEventManager.instance = new TimedEventManager();
		}

		return TimedEventManager.instance;
	}

	/**
	 * Registers a new timed event.
	 * @param duration - Duration after which the event triggers.
	 * @param callback - Function to call when the event triggers.
	 * @returns The created TimedEvent object.
	 */
	public registerTimedEvent(duration: number, callback: () => void): TimedEvent {
		const event = new TimedEvent(duration, callback);
		this.timedEvents.add(event);

		return event;
	}

	/**
	 * Removes a timed event.
	 * @param timedEvent - The timed event to remove.
	 */
	public removeTimedEvent(timedEvent: TimedEvent): void {
		this.timedEvents.delete(timedEvent);
	}

	/**
	 * Called every tick to update timed events and execute any that have expired.
	 */
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
