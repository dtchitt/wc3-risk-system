type EventHandler = (...args: any[]) => void | Promise<void>;

export class EventEmitter {
	private static instance: EventEmitter;
	private events: Map<string, EventHandler[]> = new Map();

	private constructor() {}

	public static getInstance(): EventEmitter {
		if (!EventEmitter.instance) {
			EventEmitter.instance = new EventEmitter();
		}
		return EventEmitter.instance;
	}

	public on(event: string, handler: EventHandler): void {
		if (!this.events.has(event)) {
			this.events.set(event, []);
		}
		this.events.get(event)?.push(handler);
	}

	public async emit(event: string, ...args: any[]): Promise<void> {
		const handlers = this.events.get(event) || [];
		for (const handler of handlers) {
			await handler(...args);
		}
	}
}
