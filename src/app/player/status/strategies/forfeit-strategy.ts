import { NameManager } from 'src/app/managers/names/name-manager';
import { PlayerMsg } from 'src/app/utils/utils';
import { ActivePlayer } from '../../types/active-player';
import { StatusStrategy } from './status-strategy';
import { TrackedData } from '../../data/tracked-data';

export class ForfeitStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		const data: TrackedData = gamePlayer.trackedData;

		data.income.income = 1;
		data.income.end = 0;
		data.gold.end = GetPlayerState(gamePlayer.getPlayer(), PLAYER_STATE_RESOURCE_GOLD);
		data.cities.end = data.cities.cities.length;

		NameManager.getInstance().setName(gamePlayer.getPlayer(), 'btag');
		PlayerMsg(`${NameManager.getInstance().getDisplayName(gamePlayer.getPlayer())} has forfeit the game!`);
		//VictoryManager.getInstance().removePlayer(gamePlayer); //TODO
	}
}
