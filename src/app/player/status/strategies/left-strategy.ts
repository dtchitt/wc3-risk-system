import { NameManager } from 'src/app/managers/names/name-manager';
import { GlobalMessage } from 'src/app/utils/utils';
import { ActivePlayer } from '../../types/active-player';
import { StatusStrategy } from './status-strategy';
import { TrackedData } from '../../data/tracked-data';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { PLAYER_STATUS } from '../status-enum';

export class LeftStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		gamePlayer.status.status = PLAYER_STATUS.LEFT;

		if (gamePlayer.status.isDead() || gamePlayer.status.isForfeit()) return; //Player already died or forfeit

		const data: TrackedData = gamePlayer.trackedData;

		data.income.income = 0;
		data.income.end = 0;
		data.gold.end = GetPlayerState(gamePlayer.getPlayer(), PLAYER_STATE_RESOURCE_GOLD);
		data.cities.end = data.cities.cities.length;
		data.turnDied = S2I(BlzFrameGetText(BlzGetFrameByName('ResourceBarSupplyText', 0)));

		NameManager.getInstance().setName(gamePlayer.getPlayer(), 'btag');
		GlobalMessage(`${NameManager.getInstance().getDisplayName(gamePlayer.getPlayer())} has left the game!`);
		VictoryManager.getInstance().removePlayer(gamePlayer);
	}
}
