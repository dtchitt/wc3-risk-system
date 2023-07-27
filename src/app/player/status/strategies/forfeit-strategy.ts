import { NameManager } from 'src/app/managers/names/name-manager';
import { GlobalMessage, PlayLocalSound } from 'src/app/utils/utils';
import { ActivePlayer } from '../../types/active-player';
import { StatusStrategy } from './status-strategy';
import { TrackedData } from '../../data/tracked-data';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { PLAYER_STATUS } from '../status-enum';

export class ForfeitStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		if (gamePlayer.status.isDead() || gamePlayer.status.isForfeit()) return;

		gamePlayer.status.status = PLAYER_STATUS.FORFEIT;

		const data: TrackedData = gamePlayer.trackedData;

		data.income.income = 1;
		data.income.end = 0;
		data.gold.end = GetPlayerState(gamePlayer.getPlayer(), PLAYER_STATE_RESOURCE_GOLD);
		data.cities.end = data.cities.cities.length;
		data.turnDied = S2I(BlzFrameGetText(BlzGetFrameByName('ResourceBarSupplyText', 0)));

		if (gamePlayer.getPlayer() == GetLocalPlayer()) {
			EnableSelect(false, false);
			EnableDragSelect(false, false);
		}

		NameManager.getInstance().setName(gamePlayer.getPlayer(), 'btag');
		VictoryManager.getInstance().removePlayer(gamePlayer);
		SetPlayerState(gamePlayer.getPlayer(), PLAYER_STATE_RESOURCE_GOLD, 0);
		GlobalMessage(`${NameManager.getInstance().getDisplayName(gamePlayer.getPlayer())} has forfeit the game!`);
		PlayLocalSound('Sounds\\UR_DONE.mp3', gamePlayer.getPlayer());
	}
}
