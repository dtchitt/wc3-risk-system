import { GameManager } from '../game-manager';
import { GameState } from './game-state';
import { SettingsView } from 'src/app/settings/settings-view';
import { NameManager } from 'src/app/managers/names/name-manager';
import { SettingsContext } from 'src/app/settings/settings-context';
import { Quests } from 'src/app/quests/quests';
import { ExportGameSettings } from 'src/app/utils/export-statistics/export-game-settings';
import { StandardGameMode } from '../game-mode/modes/standard-game-mode';
import { MatchData } from './match-state';
import { EventEmitter } from 'src/app/utils/events/event-emitter';
import { EVENT_MODE_SELECTION, EVENT_SET_GAME_MODE, EVENT_START_GAME } from 'src/app/utils/events/event-constants';

export class ModeSelection implements GameState {
	private manager: GameManager;
	private ui: SettingsView;
	private eventEmitter: EventEmitter;

	private static instance: ModeSelection;

	private constructor() {
		this.ui = new SettingsView();
		this.eventEmitter = EventEmitter.getInstance();
		this.eventEmitter.on(EVENT_MODE_SELECTION, () => this.run());
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new ModeSelection();
		}

		return this.instance;
	}

	public setObserver(observer: GameManager) {
		this.manager = observer;
	}

	public async run(): Promise<void> {
		if (NameManager.getInstance().getAcct(Player(23)) == 'RiskBot') {
			const settingsContext: SettingsContext = SettingsContext.getInstance();
			settingsContext.getSettings().Promode = 0;
			settingsContext.getSettings().Fog = 0;
			settingsContext.getSettings().Diplomacy.option = 0;
			settingsContext.getSettings().Overtime.option = 0;
			this.ui.hide();
			this.end();
		} else {
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
	}

	public async end(): Promise<void> {
		const settings: SettingsContext = SettingsContext.getInstance();
		settings.initStrategies();
		settings.applyStrategy('Diplomacy');
		settings.applyStrategy('Promode');
		settings.applyStrategy('Overtime');

		this.setupSettingsQuest();
		ExportGameSettings.write(settings);

		MatchData.gameMode = 'ffa';

		this.eventEmitter.emit(EVENT_SET_GAME_MODE, new StandardGameMode());
		this.eventEmitter.emit(EVENT_START_GAME);
	}

	private setupSettingsQuest(): void {
		const settings: SettingsContext = SettingsContext.getInstance();
		Quests.AddSettingsQuest(settings);
	}
}
