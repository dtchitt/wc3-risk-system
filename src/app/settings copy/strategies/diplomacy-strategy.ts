// import { SettingsStrategy } from './settings-strategy';
// import { AllyMenuFFASetup } from 'src/app/ui/console';
// import { HexColors } from 'src/app/utils/hex-colors';

// export interface DiplomacySubOptions {
// 	option: number;
// 	allyLimit: number;
// }

// export const DiplomacyOptions: Record<number, string> = {
// 	0: `${HexColors.GREEN}FFA`,
// 	1: `${HexColors.RED}Team Pick`,
// 	2: `${HexColors.RED}Random Teams`,
// };

// export class DiplomacyStrategy implements SettingsStrategy {
// 	private readonly diplomacy: DiplomacySubOptions;
// 	private readonly strategyMap: Map<number, () => void> = new Map([
// 		[0, this.handleFFA],
// 		[1, this.handleLobbyTeams],
// 		[2, this.handleRandomTeams],
// 	]);

// 	public constructor(diplomacy: DiplomacySubOptions) {
// 		this.diplomacy = diplomacy;
// 	}

// 	public apply(): void {
// 		const handler = this.strategyMap.get(this.diplomacy.option);
// 		if (handler) {
// 			handler();
// 		}
// 	}

// 	private handleFFA(): void {
// 		AllyMenuFFASetup();
// 		//TODO Break teams
// 	}

// 	private handleLobbyTeams(): void {
// 		//TODO allowed full control
// 		//TODO Start team pick process
// 	}

// 	private handleRandomTeams(): void {
// 		//TODO Generate teams and allow full control
// 	}
// }
