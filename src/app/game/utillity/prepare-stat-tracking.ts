import { PlayerManager } from 'src/app/player/player-manager';
import { PLAYER_STATUS } from 'src/app/player/status/status-enum';
import { ActivePlayer } from 'src/app/player/types/active-player';
import { MatchData } from '../state/match-state';
import { SettingsContext } from 'src/app/settings/settings-context';
import { ScoreboardManager } from 'src/app/scoreboard/scoreboard-manager';

export function setStatTracking(): void {
	const players: ActivePlayer[] = [...PlayerManager.getInstance().players.values()];
	players.forEach((player) => {
		SetPlayerState(player.getPlayer(), PLAYER_STATE_RESOURCE_GOLD, 0);
		player.status.set(PLAYER_STATUS.ALIVE);
		player.trackedData.bonus.showForPlayer(player.getPlayer());
		player.trackedData.bonus.repositon();

		MatchData.initialPlayers.push(player);

		if (MatchData.leader == null) {
			MatchData.leader = player;
		}
	});

	if (SettingsContext.getInstance().isFFA() || players.length <= 2) {
		ScoreboardManager.getInstance().ffaSetup(players);
	} else {
		ScoreboardManager.getInstance().teamSetup();
	}

	ScoreboardManager.getInstance().obsSetup(players, [...PlayerManager.getInstance().observers.keys()]);
}
