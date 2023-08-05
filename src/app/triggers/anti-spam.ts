import { GameManager } from '../game/game-manager';
import { PlayerManager } from '../player/player-manager';
import { PLAYER_STATUS } from '../player/status/status-enum';
import { ActivePlayer } from '../player/types/active-player';
import { PLAYER_SLOTS } from '../utils/utils';

type AntiSpamData = {
	timer: timer;
	string: string;
	count: number;
};

export const antiSpam = () => {
	const spamMap: Map<player, AntiSpamData> = new Map<player, AntiSpamData>();
	const threshold: number = 2;
	const t: trigger = CreateTrigger();

	for (let i = 0; i < PLAYER_SLOTS; i++) {
		TriggerRegisterPlayerChatEvent(t, Player(i), '', false);
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			const player: player = GetTriggerPlayer();

			if (spamMap.has(player)) {
				if (
					GetEventPlayerChatString().includes(spamMap.get(player).string) &&
					GetEventPlayerChatString().length >= 21 &&
					spamMap.get(player).string.length >= 21
				) {
					spamMap.get(player).count++;
				}
			} else {
				spamMap.set(player, <AntiSpamData>{
					timer: CreateTimer(),
					string: GetEventPlayerChatString(),
					count: 1,
				});

				let duration: number = 1;
				let tick: number = 0.03;
				let timer: timer = spamMap.get(player).timer;

				TimerStart(timer, tick, true, () => {
					if (duration <= 0) {
						if (spamMap.get(player).count >= threshold) {
							if (!GameManager.getInstance().isStateMetaGame()) return;

							const gPlayer: ActivePlayer = PlayerManager.getInstance().players.get(player);

							gPlayer.status.set(PLAYER_STATUS.FORFEIT);
							SetPlayerState(gPlayer.getPlayer(), PLAYER_STATE_OBSERVER, 1);
						}

						spamMap.delete(player);
						PauseTimer(timer);
						DestroyTimer(timer);
					}

					duration -= tick;
				});
			}

			return true;
		})
	);
};
