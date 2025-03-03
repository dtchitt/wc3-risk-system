import { NameManager } from 'src/app/managers/names/name-manager';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { PlayerManager } from 'src/app/player/player-manager';
import { PLAYER_STATUS } from 'src/app/player/status/status-enum';
import { ScoreboardManager } from 'src/app/scoreboard/scoreboard-manager';
import { SettingsContext } from 'src/app/settings/settings-context';
import { MatchData } from '../../state/match-state';
import { BaseState } from '../state/base-state';
import { StatisticsController } from 'src/app/statistics/statistics-controller';
import { StateData } from '../state/state-data';
import { debugPrint } from 'src/app/utils/debug-print';

export class SetupState<T extends StateData> extends BaseState<T> {
	onEnterState() {
		debugPrint('SetupState.onEnterState');
		this.runAsync();
	}

	async runAsync(): Promise<void> {
		debugPrint('SetupState.runAsync');
		FogEnable(false);

		StatisticsController.getInstance().setViewVisibility(false);

		if (!SettingsContext.getInstance().isPromode()) {
			MatchData.matchPlayers.forEach((val) => {
				NameManager.getInstance().setName(val.getPlayer(), 'color');
				val.trackedData.reset();
			});
		}

		debugPrint('1. SetupState.runAsync: MatchData.matchPlayers.length: ' + MatchData.matchPlayers.length);

		// Remove irrelevant players from the game
		MatchData.matchPlayers.forEach((val) => {
			val.trackedData.setKDMaps();
			if (GetPlayerSlotState(val.getPlayer()) == PLAYER_SLOT_STATE_PLAYING) {
				val.status.set(PLAYER_STATUS.ALIVE);
			} else {
				val.status.set(PLAYER_STATUS.LEFT);

				PlayerManager.getInstance().players.delete(val.getPlayer());
			}
		});

		const players = [...PlayerManager.getInstance().players.values()];

		MatchData.prepareMatchData(players);

		debugPrint('2. SetupState.runAsync: MatchData.matchPlayers.length: ' + MatchData.matchPlayers.length);

		MatchData.matchPlayers.forEach((player) => {
			player.status.status = PLAYER_STATUS.ALIVE;
		});

		// Prepare stat tracking
		MatchData.matchPlayers.forEach((player) => {
			debugPrint(NameManager.getInstance().getDisplayName(player.getPlayer()) + ' PlayerStatus: ' + player.status.status);

			SetPlayerState(player.getPlayer(), PLAYER_STATE_RESOURCE_GOLD, 0);
			player.status.set(PLAYER_STATUS.ALIVE);
			player.trackedData.bonus.showForPlayer(player.getPlayer());
			player.trackedData.bonus.repositon();

			if (MatchData.leader == null) {
				MatchData.leader = player;
			}
		});

		debugPrint('3. SetupState.runAsync: MatchData.matchPlayers.length: ' + MatchData.matchPlayers.length);

		if (SettingsContext.getInstance().isFFA() || MatchData.matchPlayers.length <= 2) {
			debugPrint('3.1. SetupState.runAsync: MatchData.matchPlayers.length: ' + MatchData.matchPlayers.length);
			ScoreboardManager.getInstance().ffaSetup(MatchData.matchPlayers);
			debugPrint('3.1. SetupState.runAsync: MatchData.matchPlayers.length: ' + MatchData.matchPlayers.length);
		} else {
			debugPrint('3.2. SetupState.runAsync: MatchData.matchPlayers.length: ' + MatchData.matchPlayers.length);
			ScoreboardManager.getInstance().teamSetup();
		}

		debugPrint('3.5. SetupState.runAsync: MatchData.matchPlayers.length: ' + MatchData.matchPlayers.length);

		ScoreboardManager.getInstance().obsSetup(MatchData.matchPlayers, [...PlayerManager.getInstance().observers.keys()]);

		debugPrint('4. SetupState.runAsync: MatchData.matchPlayers.length: ' + MatchData.matchPlayers.length);

		VictoryManager.getInstance().updateAndGetGameState();
		ScoreboardManager.getInstance().updateScoreboardTitle();

		EnableSelect(false, false);
		EnableDragSelect(false, false);
		FogEnable(true);

		debugPrint('5. SetupState.runAsync: MatchData.matchPlayers.length: ' + MatchData.matchPlayers.length);

		StatisticsController.getInstance().useCurrentActivePlayers();

		debugPrint('SetupState.runAsync: MatchData.matchPlayers.length: ' + MatchData.matchPlayers.length);

		this.nextState(this.stateData);
	}
}
