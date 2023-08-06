import { AllianceManager } from 'src/app/managers/alliances/alliance-manager';
import { SettingsStrategy } from './settings-strategy';
import { AllyMenuFFASetup } from 'src/app/ui/console';
import { PLAYER_SLOTS } from 'src/app/utils/utils';

export interface DiplomacyOptions {
	option: number;
	allyLimit: number;
	sharedControl: number;
}

export const DiplomacyStrings: Record<number, string> = {
	0: 'ffa',
	1: 'lobbyTeams',
	2: 'randomTeams',
	3: 'freeAlly',
};

export class DiplomacyStrategy implements SettingsStrategy {
	private readonly diplomacy: DiplomacyOptions;
	private readonly strategyMap: Map<number, () => void> = new Map([
		[0, this.handleFFA],
		[1, this.handleLobbyTeams],
		[2, this.handleRandomTeams],
		[3, this.handleFreeAlly],
	]);

	constructor(diplomacy: DiplomacyOptions) {
		this.diplomacy = diplomacy;
	}

	public apply(): void {
		const handler = this.strategyMap.get(this.diplomacy.option);
		if (handler) {
			handler();
		}
	}

	private handleFFA(): void {
		//TODO This is temporary until I fix alliance manager
		for (let i = 0; i < PLAYER_SLOTS; i++) {
			const playerA: player = Player(i);

			for (let j = 0; j < PLAYER_SLOTS; j++) {
				const playerB: player = Player(j);

				SetPlayerAlliance(playerA, playerB, ALLIANCE_PASSIVE, false);
				SetPlayerAlliance(playerA, playerB, ALLIANCE_HELP_REQUEST, false);
				SetPlayerAlliance(playerA, playerB, ALLIANCE_HELP_RESPONSE, false);
				SetPlayerAlliance(playerA, playerB, ALLIANCE_SHARED_XP, false);
				SetPlayerAlliance(playerA, playerB, ALLIANCE_SHARED_SPELLS, false);
				SetPlayerAlliance(playerA, playerB, ALLIANCE_SHARED_VISION, false);
				SetPlayerAlliance(playerA, playerB, ALLIANCE_SHARED_CONTROL, false);
				SetPlayerAlliance(playerA, playerB, ALLIANCE_SHARED_ADVANCED_CONTROL, false);

				SetPlayerAlliance(playerB, playerA, ALLIANCE_PASSIVE, false);
				SetPlayerAlliance(playerB, playerA, ALLIANCE_HELP_REQUEST, false);
				SetPlayerAlliance(playerB, playerA, ALLIANCE_HELP_RESPONSE, false);
				SetPlayerAlliance(playerB, playerA, ALLIANCE_SHARED_XP, false);
				SetPlayerAlliance(playerB, playerA, ALLIANCE_SHARED_SPELLS, false);
				SetPlayerAlliance(playerB, playerA, ALLIANCE_SHARED_VISION, false);
				SetPlayerAlliance(playerB, playerA, ALLIANCE_SHARED_CONTROL, false);
				SetPlayerAlliance(playerB, playerA, ALLIANCE_SHARED_ADVANCED_CONTROL, false);
			}
		}

		//AllianceManager.getInstance().clearAlliances();
		AllyMenuFFASetup();
	}

	private handleLobbyTeams(): void {
		//TODO
		//I could maybe control scoreboard creation from this strategy.
	}

	private handleRandomTeams(): void {
		//TODO
	}

	private handleFreeAlly(): void {
		//TODO

		SetMapFlag(MAP_LOCK_ALLIANCE_CHANGES, false);
	}
}
