import { NameManager } from 'src/app/managers/names/name-manager';
import { PlayerManager } from 'src/app/player/player-manager';
import { ActivePlayer } from 'src/app/player/types/active-player';
import { PLAYER_COLORS } from 'src/app/utils/player-colors';
import { ShuffleArray } from 'src/app/utils/utils';
import { SettingsStrategy } from './settings-strategy';

export const PromodeOptions: Record<number, string> = {
	0: 'off',
	1: 'on',
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
		const activePlayers: Map<player, ActivePlayer> = PlayerManager.getInstance().players;
		const nameManager: NameManager = NameManager.getInstance();
		const colors: playercolor[] = PLAYER_COLORS.slice(0, activePlayers.size);

		ShuffleArray(colors);

		activePlayers.forEach((val, playerHandle) => {
			nameManager.setColor(playerHandle, colors.pop());
			nameManager.setName(playerHandle, 'color');
		});
	}

	private handleOn(): void {
		const activePlayers: Map<player, ActivePlayer> = PlayerManager.getInstance().players;
		const nameManager: NameManager = NameManager.getInstance();

		activePlayers.forEach((val, playerHandle) => {
			nameManager.setColor(playerHandle, GetPlayerColor(playerHandle));
			nameManager.setName(playerHandle, 'acct');
		});
	}
}
