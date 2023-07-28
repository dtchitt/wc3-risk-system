import { CityRegionSize } from 'src/configs/city-settings';
import { Ownable } from '../libs/ownable';
import { Resetable } from '../libs/resetable';
import { DistanceBetweenCoords, NEUTRAL_HOSTILE } from '../utils/utils';
import { Barracks } from './components/barracks';
import { Guard } from './components/guard';
import { UnitToCity } from './city-map';
import { UNIT_TYPE } from '../utils/unit-types';
import { UNIT_ID } from 'src/configs/unit-id';

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

	protected validGuardHandler(unit: unit): boolean {
		if (!UnitAlive(unit)) return false;
		if (IsUnitLoaded(unit)) return false;
		if (IsUnitType(unit, UNIT_TYPE_STRUCTURE)) return false;
		if (IsUnitType(unit, UNIT_TYPE.TRANSPORT)) return false;
		if (GetUnitTypeId(unit) == UNIT_ID.DUMMY_GUARD) return false;
		if (unit == null || unit == undefined) return false;
		if (IsUnitType(unit, UNIT_TYPE.GUARD) && unit != this.guard.unit) return false;

		return true;
	}

	protected castHandler() {
		const targUnit: unit = GetSpellTargetUnit();
		const x: number = GetUnitX(targUnit);
		const y: number = GetUnitY(targUnit);
		const oldGuard: unit = this.guard.unit;

		UnitToCity.delete(this.guard.unit);
		this.guard.replace(targUnit);
		UnitToCity.set(this.guard.unit, this);
		SetUnitPosition(oldGuard, x, y);
		this.guard.reposition();
	}

	protected checkGuardDistance() {
		const distance: number = DistanceBetweenCoords(
			GetUnitX(this.guard.unit),
			GetUnitY(this.guard.unit),
			this.guard.defaultX,
			this.guard.defaultY
		);

		if (distance >= CityRegionSize - 15) {
			const group: group = CreateGroup();

			GroupEnumUnitsInRange(
				group,
				this.guard.defaultX,
				this.guard.defaultY,
				CityRegionSize - 15,
				Filter(() => this.isValidGuard(GetFilterUnit()) && IsUnitOwnedByPlayer(GetFilterUnit(), this.getOwner()))
			);

			if (BlzGroupGetSize(group) >= 1) {
				print('replacing');
				UnitToCity.delete(this.guard.unit);
				this.guard.replace(GroupPickRandomUnit(group));
				UnitToCity.set(this.guard.unit, this);
			} else {
				print('dummy');
				UnitToCity.delete(this.guard.unit);
				this.guard.replace(CreateUnit(this.getOwner(), UNIT_ID.DUMMY_GUARD, this.guard.defaultX, this.guard.defaultY, 270));
				UnitToCity.set(this.guard.unit, this);
			}

			DestroyGroup(group);
		}
	}
}
