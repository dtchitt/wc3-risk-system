import { FogService } from 'src/app/libs/fog-service';
import { SettingsStrategy } from './settings-strategy';

export const FogOptions: Record<number, string> = {
	0: 'off',
	1: 'on',
	2: 'night',
};

export class FogStrategy implements SettingsStrategy {
	private readonly fogService: FogService;
	private readonly fog: number;
	private readonly strategyMap: Map<number, () => void> = new Map([
		[0, this.handleOff],
		[1, this.handleOn],
		[2, this.handleNight],
	]);

	constructor(fog: number) {
		this.fog = fog;
		this.fogService = new FogService();

		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			this.fogService.add(Player(i));
		}
	}

	public apply(): void {
		const handler = this.strategyMap.get(this.fog);
		if (handler) {
			handler();
		}
	}

	private handleOff(): void {
		this.fogService.off();
	}

	private handleOn(): void {
		this.fogService.on();
	}

	private handleNight(): void {
		// handle night case
	}
}
