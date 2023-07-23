import { NameManager } from 'src/app/managers/names/name-manager';
import { PlayerMsg } from 'src/app/utils/utils';
import { ActivePlayer } from '../../types/active-player';
import { StatusStrategy } from './status-strategy';
import { TrackedData } from '../../data/tracked-data';
import { VictoryManager } from 'src/app/managers/victory-manager';

export class DeadStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		const data: TrackedData = gamePlayer.trackedData;

		data.income.income = 0;
		data.income.end = 0;
		data.gold.end = GetPlayerState(gamePlayer.getPlayer(), PLAYER_STATE_RESOURCE_GOLD);
		data.cities.end = data.cities.cities.length;

		NameManager.getInstance().setName(gamePlayer.getPlayer(), 'btag');
		SetPlayerState(gamePlayer.getPlayer(), PLAYER_STATE_RESOURCE_GOLD, 0);

		if (gamePlayer.getPlayer() == GetLocalPlayer()) {
			EnableSelect(false, false);
			EnableDragSelect(false, false);
		}

		PlayerMsg(`${NameManager.getInstance().getDisplayName(gamePlayer.getPlayer())} has been defeated!`);
		VictoryManager.getInstance().removePlayer(gamePlayer);
	}
}
