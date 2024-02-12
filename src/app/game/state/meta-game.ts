import { PlayerManager } from 'src/app/entity/player/player-manager';
import { PLAYER_STATUS } from 'src/app/entity/player/status/status-enum';
import { NameManager } from 'src/app/managers/names/name-manager';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { ScoreboardManager } from 'src/app/scoreboard/scoreboard-manager';
import { SettingsContext } from 'src/app/settings/settings-context';
import { CountdownMessage } from 'src/app/utils/messages';
import { PlayGlobalSound } from 'src/app/utils/utils';
import { GameManager } from '../game-manager';
import { TimerService } from '../services/timer-service';
import { GameState } from './game-state';
import { GamePlayer } from 'src/app/entity/player/game-player';

export class MetaGame implements GameState {
	private manager: GameManager;
	private nextState: GameState;
	private timer: TimerService;

	public constructor(nextState: GameState) {
		this.nextState = nextState;
		this.timer = new TimerService(this);
	}

	public setObserver(observer: GameManager) {
		this.manager = observer;
	}

	public start(): void {
		try {
			const players: GamePlayer[] = [...PlayerManager.getInstance().getPlayerMap().values()];

			players.forEach((player) => {
				SetPlayerState(player.getPlayer(), PLAYER_STATE_RESOURCE_GOLD, 0);
				player.getStatus().set(PLAYER_STATUS.ALIVE);
				player.getData().getBonus().showForPlayer(player.getPlayer());
				VictoryManager.getInstance().addPlayer(player);
			});

			const scoreboardManager: ScoreboardManager = ScoreboardManager.getInstance();
			const settingsContext: SettingsContext = SettingsContext.getInstance();

			if (settingsContext.isFFA() || players.length <= 2) {
				scoreboardManager.ffaSetup(players);
			} else {
				scoreboardManager.teamSetup();
			}

			scoreboardManager.obsSetup(players, [...PlayerManager.getInstance().getObservers()]);

			settingsContext.applyStrategy('Fog');

			PlayGlobalSound('Sound\\Interface\\ArrangedTeamInvitation.flac');

			const startDelayTimer: timer = CreateTimer();
			let duration: number = 3;

			TimerStart(startDelayTimer, 1, true, () => {
				CountdownMessage(`The Game will start in:\n${duration}`);

				if (duration == 3) {
					BlzFrameSetVisible(BlzGetFrameByName('CountdownFrame', 0), true);
				}

				if (duration <= 0) {
					PauseTimer(startDelayTimer);
					DestroyTimer(startDelayTimer);
					BlzFrameSetVisible(BlzGetFrameByName('CountdownFrame', 0), false);
					EnableSelect(true, true);
					EnableDragSelect(true, true);
					this.timer.start();
					PlayGlobalSound('Sound\\Interface\\Hint.flac');
				}

				duration--;
			});
		} catch (error) {
			print('Error in Metagame ' + error);
		}
	}

	public end(): void {
		ScoreboardManager.getInstance().destroyBoards();

		PlayerManager.getInstance()
			.getPlayerMap()
			.forEach((player) => {
				if (SettingsContext.getInstance().isPromode()) {
					NameManager.getInstance().setName(player.getPlayer(), 'acct');
				} else {
					NameManager.getInstance().setName(player.getPlayer(), 'btag');
					player.getData().getBonus().hideUI();
				}
			});

		this.timer.reset();

		this.manager.updateState(this.nextState);
	}
}
