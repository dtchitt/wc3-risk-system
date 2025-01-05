import { RegionToCity } from 'src/app/city/city-map';
import { NEUTRAL_HOSTILE } from 'src/app/utils/utils';
import { DistributionService } from './distribution-service';
import { TreeManager } from './tree-service';
import { PlayerManager } from 'src/app/player/player-manager';

export class MapSetupService {
	private distributionService: DistributionService;

	public run() {
		TreeManager.getInstance();

		EnableSelect(false, false);
		EnableDragSelect(false, false);
		FogEnable(true);

		const playerManager: PlayerManager = PlayerManager.getInstance();

		this.distributionService = new DistributionService();
		this.distributionService.runDistro(() => {
			RegionToCity.forEach((city) => {
				city.guard.reposition();
				//Prevent guards from moving and update unit counts
				IssueImmediateOrder(city.guard.unit, 'stop');

				if (GetOwningPlayer(city.guard.unit) != NEUTRAL_HOSTILE) {
					playerManager.players.get(GetOwningPlayer(city.guard.unit)).trackedData.units.add(city.guard.unit);
				}

				SetUnitInvulnerable(city.guard.unit, false);
			});
		});
	}
}
