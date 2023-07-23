import { GameManager } from '../game-manager';
import { GameState } from './game-state';

export class ModeSelection implements GameState {
	private observer: GameManager;
	private nextState: GameState;

	public constructor(nextState: GameState) {
		this.nextState = nextState;
	}

	public setObserver(observer: GameManager) {
		this.observer = observer;
	}

	public start(): void {
		print('start mode selection');
		const modeTimer: timer = CreateTimer();
		const tick: number = 1;
		let time: number = 1; //TODO set back to 15ish

		TimerStart(modeTimer, tick, true, () => {
			if (time <= 0) {
				PauseTimer(modeTimer);
				DestroyTimer(modeTimer);
				//ui.hide();
				this.end();
			}

			//ui.timerText.setFrameText(`${Math.ceil(time)}`);
			time -= tick;
		});
	}

	public end(): void {
		print('end mode selection');
		//SettingsContext.getInstance().applySettings();

		const modeEndTimer: timer = CreateTimer();

		TimerStart(modeEndTimer, 1, false, () => {
			PauseTimer(modeEndTimer);
			DestroyTimer(modeEndTimer);
			this.observer.updateState(this.nextState);
		});
	}
}
