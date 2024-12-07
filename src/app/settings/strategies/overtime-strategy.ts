import { VictoryManager } from 'src/app/managers/victory-manager';
import { SettingsStrategy } from './settings-strategy';
import { HexColors } from 'src/app/utils/hex-colors';

export interface OvertimeOptions {
	option: number;
}

export const OvertimeStrings: Record<number, string> = {
	0: `${HexColors.GREEN}Turbo (Turn 30)`,
	1: `${HexColors.RED}Long (Turn 120)`,
	2: `${HexColors.RED}Off`,
};

export class OvertimeStrategy implements SettingsStrategy {
	private readonly overtime: OvertimeOptions;
	private readonly strategyMap: Map<number, () => void> = new Map([
		[0, this.handleTurboOption],
		[1, this.handleLongOption],
		[2, this.handleOff],
	]);

	constructor(overtime: OvertimeOptions) {
		this.overtime = overtime;
	}

	public apply(): void {
		const handler = this.strategyMap.get(this.overtime.option);
		if (handler) {
			handler();
		}
	}

	private handleTurboOption(): void {
		VictoryManager.OVERTIME_ACTIVE_AT_TURN = 30;
		VictoryManager.OVERTIME_MODE = true;
	}

	private handleLongOption(): void {
		VictoryManager.OVERTIME_ACTIVE_AT_TURN = 120;
		VictoryManager.OVERTIME_MODE = true;
	}

	private handleOff(): void {
		VictoryManager.OVERTIME_ACTIVE_AT_TURN = 0;
		VictoryManager.OVERTIME_MODE = false;
	}
}
