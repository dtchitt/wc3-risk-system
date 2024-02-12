import { PlayerManager } from 'src/app/entity/player/player-manager';
import { NameManager } from 'src/app/managers/names/name-manager';
import { PLAYER_COLORS } from 'src/app/utils/player-colors';
import { ShuffleArray } from 'src/app/utils/utils';
import { SettingsStrategy } from './settings-strategy';
import { HexColors } from 'src/app/utils/hex-colors';
import { GamePlayer } from 'src/app/entity/player/game-player';

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
		const activePlayers: Map<player, GamePlayer> = PlayerManager.getInstance().getPlayerMap();
		const nameManager: NameManager = NameManager.getInstance();
		const colors: playercolor[] = PLAYER_COLORS.slice(0, activePlayers.size);
		ShuffleArray(colors);
		activePlayers.forEach((val, playerHandle) => {
			nameManager.setColor(playerHandle, colors.pop());
			nameManager.setName(playerHandle, 'color');
		});
	}

	private handleOn(): void {
		const playerManager: PlayerManager = PlayerManager.getInstance();
		const nameManager: NameManager = NameManager.getInstance();
		playerManager.getPlayerMap().forEach((val, playerHandle) => {
			nameManager.setColor(playerHandle, GetPlayerColor(playerHandle));
			nameManager.setName(playerHandle, 'acct');
			val.getData().getBonus().disable();
		});
	}
}
