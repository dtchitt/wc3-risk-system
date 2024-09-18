export class Wait {
	private static waitTimer: timer = CreateTimer();

	private constructor() {}

	public static forSeconds(seconds: number): Promise<void> {
		return new Promise((resolve) => {
			PauseTimer(this.waitTimer);

			TimerStart(this.waitTimer, seconds, false, () => {
				resolve();
			});
		});
	}
}
