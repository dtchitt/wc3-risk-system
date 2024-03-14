import { HexColors } from 'src/app/utils/hex-colors';
import { SettingsStrategy } from './settings-strategy';

export const GameTypeOptions: Record<number, string> = {
	0: `${HexColors.GREEN}Standard`,
	1: `${HexColors.GREEN}Capitals`,
};

export class GameTypeStrategy implements SettingsStrategy {
	private readonly gameType: number;
	private readonly strategyMap: Map<number, () => void> = new Map([
		[0, this.handleConquest],
		[1, this.handleCapitals],
	]);

	public constructor(gameType: number) {
		this.gameType = gameType;
	}

	public apply(): void {
		const handler = this.strategyMap.get(this.gameType);
		if (handler) {
			handler();
		}
	}

	private handleConquest(): void {
		//TODO
	}

	private handleCapitals(): void {
		//TODO
	}
}
