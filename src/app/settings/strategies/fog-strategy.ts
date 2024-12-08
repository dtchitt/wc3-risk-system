import { SettingsStrategy } from './settings-strategy';
import { HexColors } from 'src/app/utils/hex-colors';

export const FogOptions: Record<number, string> = {
	0: `${HexColors.GREEN}Off|r`,
	1: `${HexColors.RED}On|r`,
	2: `${HexColors.RED}Night|r`,
};

export class FogStrategy implements SettingsStrategy {
	//private static fogService: FogService;
	private readonly fog: number;
	private readonly strategyMap: Map<number, () => void> = new Map([
		[0, this.handleOff],
		[1, this.handleOn],
		[2, this.handleNight],
	]);

	constructor(fog: number) {
		this.fog = fog;
		//FogStrategy.fogService = new FogService();

		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			const player: player = Player(i);

			if (IsPlayerObserver(player)) {
				FogModifierStart(CreateFogModifierRect(player, FOG_OF_WAR_VISIBLE, GetWorldBounds(), true, false));
			}
		}
	}

	public apply(): void {
		const handler = this.strategyMap.get(this.fog);
		if (handler) {
			handler();
		}
	}

	private handleOff(): void {
		//FogStrategy.fogService.off();
		FogEnable(false);
	}

	private handleOn(): void {
		//FogStrategy.fogService.on();
		FogEnable(true);
	}

	private handleNight(): void {
		// handle night case
	}
}
