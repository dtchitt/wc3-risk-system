import { GamePlayer } from '../entity/player/game-player';
import { PlayerManager } from '../entity/player/player-manager';
import { PLAYER_STATUS } from '../entity/player/status/status-enum';
import { GameManager } from '../game/game-manager';
import { PLAYER_SLOTS } from '../utils/utils';

export function PlayerLeaveEvent() {
	const t: trigger = CreateTrigger();

	for (let i = 0; i < PLAYER_SLOTS; i++) {
		TriggerRegisterPlayerEvent(t, Player(i), EVENT_PLAYER_LEAVE);
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			if (!GameManager.getInstance().isStateMetaGame()) return false;

			const player: GamePlayer = PlayerManager.getInstance().getPlayerMap().get(GetTriggerPlayer());

			player.getStatus().set(PLAYER_STATUS.LEFT);
		})
	);
}
