import { NameManager } from 'src/app/managers/names/name-manager';
import { PLAYER_COLORS } from 'src/app/utils/player-colors';
import { PLAYER_SLOTS, ShuffleArray } from 'src/app/utils/utils';
import { SettingsStrategy } from './settings-strategy';
import { HexColors } from 'src/app/utils/hex-colors';
import { SettingsController } from '../settings-context';
import { Settings } from '../settings';

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
	private readonly settingsContext: SettingsController;

	public constructor(promode: number, settings: SettingsController) {
		this.promode = promode;
		this.settingsContext = settings;
	}

	public apply(): void {
		const handler = this.strategyMap.get(this.promode);

		if (handler) {
			handler();
		}
	}

	private handleOff(): void {
		const nameManager: NameManager = NameManager.getInstance();
		const colors: playercolor[] = [];
		const activePlayers: player[] = [];

		for (let i = 0; i < PLAYER_SLOTS; i++) {
			const player = Player(i);

			if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_LEFT) continue;
			if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_EMPTY) continue;
			if (IsPlayerObserver(player)) continue;

			activePlayers.push(player);
			colors.push(PLAYER_COLORS[colors.length]);
		}

		ShuffleArray(colors);

		activePlayers.forEach((player) => {
			nameManager.setColor(player, colors.pop());
			nameManager.setName(player, 'color');
		});
	}

	private handleOn(): void {
		const settings: Settings = this.settingsContext.getSettings();
		settings.Diplomacy.option = 1;
		settings.Fog = 1;

		const nameManager: NameManager = NameManager.getInstance();

		for (let i = 0; i < PLAYER_SLOTS; i++) {
			const player = Player(i);

			if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_LEFT) continue;
			if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_EMPTY) continue;
			if (IsPlayerObserver(player)) continue;

			nameManager.setColor(player, GetPlayerColor(player));
			nameManager.setName(player, 'acct');
			//TODO find somewhere to disable bonus
			//val.trackedData.bonus.disable();
		}
	}
}
