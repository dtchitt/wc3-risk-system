import { VictoryManager } from 'src/app/managers/victory-manager';
import { SettingsStrategy } from './settings-strategy';
import { HexColors } from 'src/app/utils/hex-colors';

export interface OvertimeOptions {
	option: number;
}

export const OvertimeStrings: Record<number, string> = {
	0: `${HexColors.GREEN}Off`,
	1: `${HexColors.RED}Turn 30`,
	2: `${HexColors.RED}Turn 60`,
	3: `${HexColors.RED}Turn 90`,
};

export class OvertimeStrategy implements SettingsStrategy {
	private readonly overtime: OvertimeOptions;
	private readonly strategyMap: Map<number, () => void> = new Map([
		[0, this.handleOff],
		[1, this.handleTurn30],
		[2, this.handleTurn60],
		[3, this.handleTurn90],
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

	private handleTurn30(): void {
		VictoryManager.THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_TURN = 30;
		VictoryManager.OVERTIME_MODE = true;
	}

	private handleTurn60(): void {
		VictoryManager.THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_TURN = 60;
		VictoryManager.OVERTIME_MODE = true;
	}

	private handleTurn90(): void {
		VictoryManager.THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_TURN = 90;
		VictoryManager.OVERTIME_MODE = true;
	}
}
