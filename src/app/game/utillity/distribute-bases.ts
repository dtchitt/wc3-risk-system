import { RegionToCity } from 'src/app/city/city-map';
import { DistributionService } from '../services/distribution-service';
import { NEUTRAL_HOSTILE } from 'src/app/utils/utils';
import { PlayerManager } from 'src/app/player/player-manager';

export function distributeBases(): void {
	new DistributionService().runDistro(() => {
		RegionToCity.forEach((city) => {
			city.guard.reposition();
			//Prevent guards from moving and update unit counts
			IssueImmediateOrder(city.guard.unit, 'stop');

			if (GetOwningPlayer(city.guard.unit) != NEUTRAL_HOSTILE) {
				PlayerManager.getInstance().players.get(GetOwningPlayer(city.guard.unit)).trackedData.units.add(city.guard.unit);
			}

			SetUnitInvulnerable(city.guard.unit, false);
		});
	});
}
