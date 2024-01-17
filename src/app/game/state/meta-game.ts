import { VictoryManager } from 'src/app/managers/victory-manager';
import { PlayerManager } from 'src/app/player/player-manager';
import { PLAYER_STATUS } from 'src/app/player/status/status-enum';
import { MiniBoard } from 'src/app/scoreboard/miniboard';
import { Scoreboards } from 'src/app/scoreboard/scoreboard-array';
import { StandardBoard } from 'src/app/scoreboard/standard-board';
import { GameManager } from '../game-manager';
import { GameState } from './game-state';
import { SettingsContext } from 'src/app/settings/settings-context';
import { TimerService } from '../services/timer-service';
import { NameManager } from 'src/app/managers/names/name-manager';
import { CountdownMessage } from 'src/app/utils/messages';
import { PlayGlobalSound } from 'src/app/utils/utils';
import { ObserverBoard } from 'src/app/scoreboard/observer-board';
import { ActivePlayer } from 'src/app/player/types/active-player';

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
			const players: ActivePlayer[] = [...PlayerManager.getInstance().players.values()];
			const observers: player[] = [...PlayerManager.getInstance().observers.keys()];

			SettingsContext.getInstance().applyStrategy('Fog');
			Scoreboards.push(new StandardBoard(players));
			const mbFrame: framehandle = BlzGetFrameByName('Multiboard', 0);
			Scoreboards.push(new MiniBoard(players));
			Scoreboards[0].setVisibility(true);

			if (observers.length >= 1) {
				Scoreboards.push(new ObserverBoard(players));

				observers.forEach((handle) => {
					if (GetLocalPlayer() == handle) {
						Scoreboards[0].setVisibility(false);
						Scoreboards[2].setVisibility(true);
					}
				});
			}

			players.forEach((player) => {
				SetPlayerState(player.getPlayer(), PLAYER_STATE_RESOURCE_GOLD, 0);
				player.status.set(PLAYER_STATUS.ALIVE);
				player.trackedData.bonus.showForPlayer(player.getPlayer());
				player.trackedData.bonus.repositon(mbFrame);
				VictoryManager.getInstance().addPlayer(player);
			});

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
			print('Error in Metagame' + error);
		}
	}

	public end(): void {
		Scoreboards.forEach((board) => {
			board.destory();
		});

		Scoreboards.length = 0;

		PlayerManager.getInstance().players.forEach((player) => {
			player.trackedData.bonus.hideUI();

			if (SettingsContext.getInstance().isPromode()) {
				NameManager.getInstance().setName(player.getPlayer(), 'acct');
			} else {
				NameManager.getInstance().setName(player.getPlayer(), 'btag');
			}
		});

		this.timer.reset();

		this.manager.updateState(this.nextState);
	}
}
