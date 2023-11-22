import { PlayerManager } from 'src/app/player/player-manager';
import { PLAYER_STATUS } from 'src/app/player/status/status-enum';
import { GameManager } from '../game-manager';
import { GameState } from './game-state';
import { TreeService } from '../services/tree-service';
import { RegionToCity } from 'src/app/city/city-map';
import { NEUTRAL_HOSTILE } from 'src/app/utils/utils';
import { SlavePlayer } from 'src/app/player/types/slave-player';
import { DistributionService } from '../services/distribution-service';

export class PreGame implements GameState {
	private manager: GameManager;
	private nextState: GameState;
	private treeService: TreeService;
	private distributionService: DistributionService;

	public constructor(nextState: GameState) {
		this.nextState = nextState;
		this.treeService = new TreeService();
	}

	public setObserver(observer: GameManager) {
		this.manager = observer;
	}

	public start(): void {
		this.treeService.reset();

		PlayerManager.getInstance().players.forEach((val) => {
			val.trackedData.setKDMaps();

			if (GetPlayerSlotState(val.getPlayer()) == PLAYER_SLOT_STATE_PLAYING) {
				val.status.set(PLAYER_STATUS.ALIVE);
			} else {
				val.status.set(PLAYER_STATUS.LEFT);

				PlayerManager.getInstance().slaves.set(val.getPlayer(), new SlavePlayer(val.getPlayer()));
				PlayerManager.getInstance().players.delete(val.getPlayer());
			}
		});

		EnableSelect(false, false);
		EnableDragSelect(false, false);
		FogEnable(true);

		const gameDelayTimer: timer = CreateTimer();

		TimerStart(gameDelayTimer, 3, false, () => {
			this.end();
			DestroyTimer(gameDelayTimer);
		});

		//TODO capital selection
	}

	public end(): void {
		this.distributionService = new DistributionService();
		this.distributionService.runDistro(() => {
			RegionToCity.forEach((city) => {
				//Prevent guards from moving and update unit counts
				IssueImmediateOrder(city.guard.unit, 'stop');

				if (GetOwningPlayer(city.guard.unit) != NEUTRAL_HOSTILE) {
					PlayerManager.getInstance().players.get(GetOwningPlayer(city.guard.unit)).trackedData.units.add(city.guard.unit);
				}
			});

			this.manager.updateState(this.nextState);
		});
	}
}
