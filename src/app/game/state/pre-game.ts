import { PlayerManager } from 'src/app/player/player-manager';
import { PLAYER_STATUS } from 'src/app/player/status/status-enum';
import { GameManager } from '../game-manager';
import { GameState } from './game-state';
import { TreeService } from '../services/tree-service';
import { RegionToCity } from 'src/app/city/city-map';
import { NEUTRAL_HOSTILE } from 'src/app/utils/utils';
import { DistributionService } from '../services/distribution-service';

export class PreGame implements GameState {
	private manager: GameManager;
	private nextState: GameState;
	private treeService: TreeService;
	private distributionService: DistributionService;

	public constructor(nextState: GameState) {
		this.nextState = nextState;
	}

	public setObserver(observer: GameManager) {
		this.manager = observer;
	}

	public start(): void {
		print('Starting PreGame phase');

		if (!this.treeService) {
			this.treeService = new TreeService();
		} else {
			this.treeService.reset();
		}

		PlayerManager.getInstance().players.forEach((val) => {
			val.trackedData.setKDMaps();

			if (GetPlayerSlotState(val.getPlayer()) == PLAYER_SLOT_STATE_PLAYING) {
				val.status.set(PLAYER_STATUS.ALIVE);
			} else {
				val.status.set(PLAYER_STATUS.LEFT);
				PlayerManager.getInstance().players.delete(val.getPlayer());
				//TODO add to slave players
			}
		});

		EnableSelect(false, false);
		EnableDragSelect(false, false);
		FogEnable(true);

		//TODO capital selection
		this.end();
	}

	public end(): void {
		print('End Pregame');
		this.distributionService = new DistributionService();
		this.distributionService.standardDistro();

		//Prevent guards from moving and update unit counts
		RegionToCity.forEach((city) => {
			IssueImmediateOrder(city.guard.unit, 'stop');

			if (GetOwningPlayer(city.guard.unit) != NEUTRAL_HOSTILE) {
				PlayerManager.getInstance().players.get(GetOwningPlayer(city.guard.unit)).trackedData.units.add(city.guard.unit);
			}
		});

		this.manager.updateState(this.nextState);
	}
}
