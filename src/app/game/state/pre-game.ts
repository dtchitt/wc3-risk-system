import { RegionToCity } from 'src/app/city/city-map';
import { PlayerManager } from 'src/app/entity/player/player-manager';
import { PLAYER_STATUS } from 'src/app/entity/player/status/status-enum';
import { NEUTRAL_HOSTILE } from 'src/app/utils/utils';
import { GameManager } from '../game-manager';
import { DistributionService } from '../services/distribution-service';
import { TreeManager } from '../services/tree-service';
import { GameState } from './game-state';

export class PreGame implements GameState {
	private manager: GameManager;
	private nextState: GameState;
	private distributionService: DistributionService;

	public constructor(nextState: GameState) {
		this.nextState = nextState;
		TreeManager.getInstance();
	}

	public setObserver(observer: GameManager) {
		this.manager = observer;
	}

	public start(): void {
		PlayerManager.getInstance()
			.getPlayerMap()
			.forEach((val) => {
				val.getData().setKDMaps();

				if (GetPlayerSlotState(val.getPlayer()) == PLAYER_SLOT_STATE_PLAYING) {
					val.getStatus().set(PLAYER_STATUS.ALIVE);
				} else {
					val.getStatus().set(PLAYER_STATUS.LEFT);

					PlayerManager.getInstance().getPlayerMap().delete(val.getPlayer());
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
		const playerManager: PlayerManager = PlayerManager.getInstance();

		this.distributionService = new DistributionService();
		this.distributionService.runDistro(() => {
			RegionToCity.forEach((city) => {
				//Prevent guards from moving and update unit counts
				IssueImmediateOrder(city.guard.unit, 'stop');

				if (GetOwningPlayer(city.guard.unit) != NEUTRAL_HOSTILE) {
					playerManager.getPlayerMap().get(GetOwningPlayer(city.guard.unit)).getData().getUnits().add(city.guard.unit);
				}
			});

			this.manager.updateState(this.nextState);
		});
	}
}
