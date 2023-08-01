import { NameManager } from 'src/app/managers/names/name-manager';
import { ActivePlayer } from '../../types/active-player';
import { StatusStrategy } from './status-strategy';
import { TrackedData } from '../../data/tracked-data';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { PLAYER_STATUS } from '../status-enum';
import { GlobalMessage } from 'src/app/utils/messages';

export class DeadStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		if (gamePlayer.status.isForfeit() || gamePlayer.status.isLeft()) return;

		gamePlayer.status.status = PLAYER_STATUS.DEAD;

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
		GlobalMessage(
			`${NameManager.getInstance().getDisplayName(gamePlayer.getPlayer())} has been defeated!`,
			'Sound\\Interface\\SecretFound.flac'
		);
	}
}
