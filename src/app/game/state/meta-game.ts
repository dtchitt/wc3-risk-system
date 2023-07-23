import { VictoryManager } from 'src/app/managers/victory-manager';
import { PlayerManager } from 'src/app/player/player-manager';
import { PLAYER_STATUS } from 'src/app/player/status/status-enum';
import { MiniBoard } from 'src/app/scoreboard/miniboard';
import { Scoreboards } from 'src/app/scoreboard/scoreboard-array';
import { StandardBoard } from 'src/app/scoreboard/standard-board';
import { PlayGlobalSound } from 'src/app/utils/utils';
import { GameManager } from '../game-manager';
import { GameState } from './game-state';
import { SettingsContext } from 'src/app/settings/settings-context';
import { TimerService } from '../services/timer-service';

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
		print('Starting MetaGame phase');

		try {
			SettingsContext.getInstance().applyStrategy('Fog');

			const startDelayTimer: timer = CreateTimer();

			//TODO do a countdown so players know
			TimerStart(startDelayTimer, 3, false, () => {
				EnableSelect(true, true);
				EnableDragSelect(true, true);
				Scoreboards.push(new StandardBoard([...PlayerManager.getInstance().players.values()]));
				const mbFrame: framehandle = BlzGetFrameByName('Multiboard', 0);
				Scoreboards.push(new MiniBoard([...PlayerManager.getInstance().players.values()]));
				Scoreboards[0].setVisibility(true);

				PlayerManager.getInstance().players.forEach((player) => {
					player.status.set(PLAYER_STATUS.ALIVE);
					player.trackedData.bonus.showForPlayer(player.getPlayer());
					player.trackedData.bonus.repositon(mbFrame);
					VictoryManager.getInstance().addPlayer(player);
				});

				this.timer.start();
				PlayGlobalSound('Sound\\Interface\\SecretFound.flac');
			});
		} catch (error) {
			print(error);
		}
	}

	public end(): void {
		this.manager.updateState(this.nextState);
	}
}
