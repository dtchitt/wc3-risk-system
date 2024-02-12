import { SettingsStrategy } from './settings-strategy';
import { HexColors } from 'src/app/utils/hex-colors';

export const PromodeOptions: Record<number, string> = {
	0: `${HexColors.GREEN}Off`,
	1: `${HexColors.RED}On`,
};

export class PromodeStrategy implements SettingsStrategy {
	private readonly promode: number;
	private readonly strategyMap: Map<number, () => void> = new Map([
		[0, this.handleOff],
		[1, this.handleOn],
	]);

	constructor(promode: number) {
		this.promode = promode;
	}

	public apply(): void {
		const handler = this.strategyMap.get(this.promode);

		if (handler) {
			handler();
		}
	}

	private handleOff(): void {
		//TODO
		// const activePlayers: Map<player, ActivePlayer> = PlayerManager.getInstance().players;
		// const nameManager: NameManager = NameManager.getInstance();
		// const colors: playercolor[] = PLAYER_COLORS.slice(0, activePlayers.size);
		// ShuffleArray(colors);
		// activePlayers.forEach((val, playerHandle) => {
		// 	nameManager.setColor(playerHandle, colors.pop());
		// 	nameManager.setName(playerHandle, 'color');
		// });
	}

	private handleOn(): void {
		//TODO
		// const playerManager: PlayerManager = PlayerManager.getInstance();
		// const nameManager: NameManager = NameManager.getInstance();
		// playerManager.players.forEach((val, playerHandle) => {
		// 	nameManager.setColor(playerHandle, GetPlayerColor(playerHandle));
		// 	nameManager.setName(playerHandle, 'acct');
		// 	val.trackedData.bonus.disable();
		// });
	}
}
