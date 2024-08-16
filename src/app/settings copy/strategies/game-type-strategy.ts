// import { HexColors } from 'src/app/utils/hex-colors';
// import { SettingsStrategy } from './settings-strategy';

// export const GameTypeOptions: Record<number, string> = {
// 	0: `${HexColors.GREEN}Standard`,
// 	1: `${HexColors.GREEN}Tournament`,
// 	2: `${HexColors.GREEN}Promode`,
// 	3: `${HexColors.GREEN}Capitals`,
// };

// export class GameTypeStrategy implements SettingsStrategy {
// 	private readonly gameType: number;
// 	private readonly strategyMap: Map<number, () => void> = new Map([
// 		[0, this.handleStandard],
// 		[1, this.handleTournament],
// 		[2, this.handlePromode],
// 		[3, this.handleCapitals],
// 	]);

// 	public constructor(gameType: number) {
// 		this.gameType = gameType;
// 	}

// 	public apply(): void {
// 		const handler = this.strategyMap.get(this.gameType);
// 		if (handler) {
// 			handler();
// 		}
// 	}

// 	private handleStandard(): void {
// 		//TODO
// 	}

// 	private handlePromode(): void {
// 		//TODO
// 	}

// 	private handleTournament(): void {
// 		//TODO
// 	}

// 	private handleCapitals(): void {
// 		//TODO
// 	}
// }
