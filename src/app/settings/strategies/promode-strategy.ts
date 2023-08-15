import { NameManager } from 'src/app/managers/names/name-manager';
import { PlayerManager } from 'src/app/player/player-manager';
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
	private readonly playerManager: PlayerManager = PlayerManager.getInstance();
	private readonly nameManager: NameManager = NameManager.getInstance();

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
		const colors: playercolor[] = PLAYER_COLORS.slice(0, this.playerManager.players.size);

		ShuffleArray(colors);

		this.playerManager.players.forEach((val, playerHandle) => {
			this.nameManager.setColor(playerHandle, colors.pop());
			this.nameManager.setName(playerHandle, 'color');
		});

		this.handleObs();
	}

	private handleOn(): void {
		this.playerManager.players.forEach((val, playerHandle) => {
			this.nameManager.setColor(playerHandle, GetPlayerColor(playerHandle));
			this.nameManager.setName(playerHandle, 'acct');
		});

		this.handleObs();
	}

	private handleObs(): void {
		this.playerManager.observers.forEach((val, playerHandle) => {
			this.nameManager.setColor(playerHandle, PLAYER_COLOR_SNOW);
			this.nameManager.setName(playerHandle, 'acct');
		});
	}
}
