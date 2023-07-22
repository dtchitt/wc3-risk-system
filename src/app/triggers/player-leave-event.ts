// import { RoundManager } from '../game/round-manager';
// import { PlayerManager } from '../player/player-manager';
// import { PLAYER_STATUS } from '../player/status/player-status-enum';
// import { ActivePlayer } from '../player/types/active-player';

// export function onPlayerLeave() {
// 	const t: trigger = CreateTrigger();

// 	for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
// 		TriggerRegisterPlayerEvent(t, Player(i), EVENT_PLAYER_LEAVE);
// 	}

// 	TriggerAddCondition(
// 		t,
// 		Condition(() => {
// 			if (!RoundManager.getInstance().isGameActive()) return false;

// 			const player: ActivePlayer = PlayerManager.getInstance().players.get(GetTriggerPlayer());

// 			if (!player.getStatus().isAlive()) return;

// 			player.getStatus().set(player, PLAYER_STATUS.LEFT);
// 		})
// 	);
// }
