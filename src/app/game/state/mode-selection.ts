import { SettingsContext } from 'src/app/settings/settings-context';
import { GameManager } from '../game-manager';
import { GameState } from './game-state';
import { SettingsView } from 'src/app/settings/settings-view';

export class ModeSelection implements GameState {
	private manager: GameManager;
	private nextState: GameState;
	private ui: SettingsView;

	public constructor(nextState: GameState) {
		this.nextState = nextState;
		this.ui = new SettingsView();
	}

	public setObserver(observer: GameManager) {
		this.manager = observer;
	}

	public start(): void {
		const modeTimer: timer = CreateTimer();
		const tick: number = 1;
		let time: number = 15;
		this.ui.update(time);

		TimerStart(modeTimer, tick, true, () => {
			this.ui.update(time);

			if (time <= 0 || !this.ui.isVisible()) {
				PauseTimer(modeTimer);
				DestroyTimer(modeTimer);
				this.ui.hide();
				this.end();
			}

			time -= tick;
		});
	}

	public end(): void {
		const settings: SettingsContext = SettingsContext.getInstance();
		settings.initStrategies();
		settings.applyStrategy('Diplomacy');
		settings.applyStrategy('Promode');
		this.manager.updateState(this.nextState);
	}
}
