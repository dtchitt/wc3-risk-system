import { Bonus } from './bonus';

export class Bounty implements Bonus {
	public static readonly factor: number = 0.25;
	public static readonly interval: number = 1;

	private _delta: number;
	private _earned: number;

	constructor() {
		this._delta = 0;
		this._earned = 0;
	}

	public reset(): void {
		this._delta = 0;
	}

	public add(val: number): number {
		let bonusAmount: number = 0;

		try {
			this._delta += val * Bounty.factor;

			if (this._delta >= Bounty.interval) {
				bonusAmount = this.processBonus();
			}
		} catch (error) {
			print(error);
		}

		return bonusAmount;
	}

	public get earned(): number {
		return this._earned;
	}

	private processBonus(): number {
		let bonusAmount: number = Math.floor(this._delta);

		this._delta -= bonusAmount;
		this._earned += bonusAmount;

		return bonusAmount;
	}
}
