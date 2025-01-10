import { TURN_DURATION_IN_SECONDS } from 'src/configs/game-settings';

export interface GameData {
	turn: number;
	ticks: number;
}

export class MatchData {
	private static instance: MatchData;
	private data: GameData;

	private constructor() {}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new MatchData();
		}

		return this.instance;
	}

	public static resetMatchData() {
		this.getInstance().data = {
			turn: 1,
			ticks: TURN_DURATION_IN_SECONDS,
		};
	}

	public static get turnCount(): number {
		return this.getInstance().data.turn;
	}
	public static set turnCount(v: number) {
		this.getInstance().data.turn = v;
	}

	public static get tickCounter(): number {
		return this.getInstance().data.ticks;
	}
	public static set tickCounter(v: number) {
		this.getInstance().data.ticks = v;
	}
}
