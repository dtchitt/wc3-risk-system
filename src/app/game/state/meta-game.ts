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
			SettingsContext.getInstance().applyStrategy('Fog');
			BlzFrameSetVisible(BlzGetFrameByName('CountdownFrame', 0), true);
			PlayGlobalSound('Sound\\Interface\\ArrangedTeamInvitation.flac');
			Scoreboards.push(new StandardBoard([...PlayerManager.getInstance().players.values()]));
			const mbFrame: framehandle = BlzGetFrameByName('Multiboard', 0);
			Scoreboards.push(new MiniBoard([...PlayerManager.getInstance().players.values()]));
			Scoreboards.push(new ObserverBoard([...PlayerManager.getInstance().players.values()]));
			Scoreboards[0].setVisibility(true);

			PlayerManager.getInstance().observers.forEach((obj, handle) => {
				if (GetLocalPlayer() == handle) {
					Scoreboards[0].setVisibility(false);
					Scoreboards[2].setVisibility(true);
				}
			});

			PlayerManager.getInstance().players.forEach((player) => {
				player.status.set(PLAYER_STATUS.ALIVE);
				player.trackedData.bonus.showForPlayer(player.getPlayer());
				player.trackedData.bonus.repositon(mbFrame);
				VictoryManager.getInstance().addPlayer(player);
			});

			const startDelayTimer: timer = CreateTimer();
			let duration: number = 4;
			TimerStart(startDelayTimer, 1, true, () => {
				CountdownMessage(`The Game will start in:\n${duration}`);

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
			board.setVisibility(false);
		});

		PlayerManager.getInstance().players.forEach((player) => {
			player.trackedData.bonus.hideUI();
			NameManager.getInstance().setName(player.getPlayer(), 'btag');
		});

		this.manager.updateState(this.nextState);
	}
}
