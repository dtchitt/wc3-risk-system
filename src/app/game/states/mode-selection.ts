import { SettingsView } from 'src/app/settings/settings-view';
import { GameManager } from '../game-manager';
import { GameState } from '../game-state';
import { SettingsContext } from 'src/app/settings/settings-context';
import { EventTimer } from 'src/app/timer/EventTimer';

export class ModeSelection implements GameState {
	private manager: GameManager;
	private duration: number;
	private settingsView: SettingsView;

	public constructor(manager: GameManager) {
		this.manager = manager;
		this.duration = 15;
		this.settingsView = new SettingsView(this.duration);
	}

	public start(): void {
		EventTimer.getInstance().addEvent('settingsTimer', 15, false, () => {
			this.settingsView.update();
			this.checkTimer();
		});
	}

	public end(): void {
		const settings: SettingsContext = SettingsContext.getInstance();

		settings.applyStrategies();

		this.manager.updateState();
	}

	private checkTimer(): void {
		const timer: EventTimer = EventTimer.getInstance();

		if (timer.getEvent('settingsTimer').remainingTime <= 1) {
			timer.addEvent('delay', 1, false, () => {
				this.settingsView.hide();
				this.end();
			});
		}
	}
}
