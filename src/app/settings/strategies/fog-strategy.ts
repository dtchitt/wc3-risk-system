import { FogService } from 'src/app/libs/fog-service';
import { SettingsStrategy } from './settings-strategy';
import { HexColors } from 'src/app/utils/hex-colors';

export const FogOptions: Record<number, string> = {
	0: `${HexColors.GREEN}Off`,
	1: `${HexColors.RED}On`,
	2: `${HexColors.RED}Night`,
};

export class FogStrategy implements SettingsStrategy {
	private static fogService: FogService;
	private readonly fog: number;
	private readonly strategyMap: Map<number, () => void> = new Map([
		[0, this.handleOff],
		[1, this.handleOn],
		[2, this.handleNight],
	]);

	constructor(fog: number) {
		this.fog = fog;
		FogStrategy.fogService = new FogService();

		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			FogStrategy.fogService.add(Player(i));
		}
	}

	public apply(): void {
		const handler = this.strategyMap.get(this.fog);
		if (handler) {
			handler();
		}
	}

	private handleOff(): void {
		FogStrategy.fogService.off();
	}

	private handleOn(): void {
		FogStrategy.fogService.on();
	}

	private handleNight(): void {
		// handle night case
	}
}
