import { SettingsContext } from 'src/app/settings/settings-context';
import { GameManager } from '../game-manager';
import { GameState } from './game-state';

export class ModeSelection implements GameState {
	private manager: GameManager;
	private nextState: GameState;

	public constructor(nextState: GameState) {
		this.nextState = nextState;
	}

	public setObserver(observer: GameManager) {
		this.manager = observer;
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
		const settings: SettingsContext = SettingsContext.getInstance();
		settings.initStrategies();
		settings.applyStrategy('Diplomacy');
		settings.applyStrategy('Promode');

		const modeEndTimer: timer = CreateTimer();

		TimerStart(modeEndTimer, 1, false, () => {
			PauseTimer(modeEndTimer);
			DestroyTimer(modeEndTimer);
			this.manager.updateState(this.nextState);
		});
	}
}
