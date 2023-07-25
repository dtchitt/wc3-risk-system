import { PlayerManager } from '../player/player-manager';
import { ActivePlayer } from '../player/types/active-player';
import { Scoreboards } from '../scoreboard/scoreboard-array';

export function keyEvents() {
	const t: trigger = CreateTrigger();

	for (let i = 0; i < bj_MAX_PLAYERS; i++) {
		BlzTriggerRegisterPlayerKeyEvent(t, Player(i), OSKEY_F5, 0, false);
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			const player: ActivePlayer = PlayerManager.getInstance().players.get(GetTriggerPlayer());

			if (player.options.board == 0) {
				player.options.board = 1;

				if (player.getPlayer() == GetLocalPlayer()) {
					Scoreboards[0].setVisibility(false);
					Scoreboards[1].setVisibility(true);
				}
			} else if (player.options.board == 1) {
				player.options.board = 0;

				if (player.getPlayer() == GetLocalPlayer()) {
					Scoreboards[1].setVisibility(false);
					Scoreboards[0].setVisibility(true);
				}
			}
		})
	);
}
