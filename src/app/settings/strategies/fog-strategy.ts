import { FogService } from 'src/app/libs/fog-service';
import { SettingsStrategy } from './settings-strategy';

export const FogOptions: Record<number, string> = {
	0: 'off',
	1: 'on',
	2: 'night',
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
