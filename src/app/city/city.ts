import { Ownable } from '../libs/ownable';
import { Resetable } from '../libs/resetable';
import { NEUTRAL_HOSTILE } from '../utils/utils';
import { Barracks } from './components/barracks';
import { Guard } from './components/guard';

export abstract class City implements Resetable, Ownable {
	private owner: player;
	private _barrack: Barracks;
	private _guard: Guard;
	private _cop: unit;

	constructor(rax: Barracks, guard: Guard, cop: unit) {
		this.owner = NEUTRAL_HOSTILE;
		this._barrack = rax;
		this._guard = guard;
		this._cop = cop;
	}

	public abstract isValidGuard(unit: unit): boolean;
	public abstract onUnitTrain(unit: unit): void;
	public abstract onCast(): void;

	public reset(): void {
		this._guard.reset();
		this._barrack.reset();
		SetUnitOwner(this._cop, NEUTRAL_HOSTILE, true);
	}

	public setOwner(player: player): void {
		this.owner = player;
		this._barrack.setOwner(player);
		SetUnitOwner(this._cop, player, true);
	}

	public changeOwner(newOwner: player): void {
		this.setOwner(newOwner);
		IssuePointOrder(this._barrack.unit, 'setrally', this._barrack.defaultX - 70, this._barrack.defaultY - 155);
	}

	public getOwner(): player {
		return this.owner;
	}

	public get barrack(): Barracks {
		return this._barrack;
	}

	public get cop(): unit {
		return this._cop;
	}

	public get guard(): Guard {
		return this._guard;
	}

	public set guard(value: Guard) {
		this._guard = value;
	}
}
