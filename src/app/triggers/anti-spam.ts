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

export const AntiSpam = () => {
	const spamMap: Map<player, AntiSpamData> = new Map<player, AntiSpamData>();
	const threshold: number = 3;
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
					if (onSpamDetection(spamMap, player, threshold)) {
						spamMap.delete(player);
						PauseTimer(spamMap.get(player).timer);
						DestroyTimer(spamMap.get(player).timer);
					}
				}
			} else {
				spamMap.set(player, <AntiSpamData>{
					timer: CreateTimer(),
					string: GetEventPlayerChatString(),
					count: 1,
				});

				let duration: number = 5;
				let tick: number = 0.03;
				let timer: timer = spamMap.get(player).timer;

				TimerStart(timer, tick, true, () => {
					if (duration <= 0) {
						onSpamDetection(spamMap, player, threshold);

						spamMap.delete(player);
						PauseTimer(spamMap.get(player).timer);
						DestroyTimer(spamMap.get(player).timer);
					}

					duration -= tick;
				});
			}

			return true;
		})
	);
};

function onSpamDetection(spamMap: Map<player, AntiSpamData>, player: player, threshold: number): boolean {
	if (!GameManager.getInstance().isStateMetaGame()) return false;

	if (spamMap.get(player).count >= threshold) {
		const gPlayer: ActivePlayer = PlayerManager.getInstance().players.get(player);

		gPlayer.status.set(PLAYER_STATUS.FORFEIT);
		SetPlayerState(gPlayer.getPlayer(), PLAYER_STATE_OBSERVER, 1);

		return true;
	}

	return false;
}
