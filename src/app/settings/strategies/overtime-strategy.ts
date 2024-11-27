import { VictoryManager } from 'src/app/managers/victory-manager';
import { SettingsStrategy } from './settings-strategy';
import { HexColors } from 'src/app/utils/hex-colors';

export interface OvertimeOptions {
	option: number;
}

export const OvertimeStrings: Record<number, string> = {
	0: `${HexColors.GREEN}Off`,
	1: `${HexColors.RED}Turn 60`,
	2: `${HexColors.RED}Turn 90`,
	3: `${HexColors.RED}Turn 120`,
};

export class OvertimeStrategy implements SettingsStrategy {
	private readonly overtime: OvertimeOptions;
	private readonly strategyMap: Map<number, () => void> = new Map([
		[0, this.handleOff],
		[1, this.handleOption1],
		[2, this.handleOption2],
		[3, this.handleOption3],
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

	private handleOff(): void {
		VictoryManager.THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_TURN = 0;
		VictoryManager.OVERTIME_MODE = false;
	}

	private handleOption1(): void {
		VictoryManager.THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_TURN = 60;
		VictoryManager.OVERTIME_MODE = true;
	}

	private handleOption2(): void {
		VictoryManager.THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_TURN = 90;
		VictoryManager.OVERTIME_MODE = true;
	}

	private handleOption3(): void {
		VictoryManager.THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_TURN = 120;
		VictoryManager.OVERTIME_MODE = true;
	}
}
