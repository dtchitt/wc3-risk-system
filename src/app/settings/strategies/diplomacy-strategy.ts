import { AllianceManager } from 'src/app/managers/alliances/alliance-manager';
import { SettingsStrategy } from './settings-strategy';

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
		AllianceManager.getInstance().clearAlliances();
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
