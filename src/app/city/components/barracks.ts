import { NEUTRAL_HOSTILE } from 'src/app/utils/utils';

export class Barracks {
	private _unit: unit;
	private readonly _unitType: number;
	private readonly _defaultX: number;
	private readonly _defaultY: number;

	constructor(unit: unit) {
		this._unit = unit;
		this._unitType = GetUnitTypeId(unit);
		this._defaultX = GetUnitX(unit);
		this._defaultY = GetUnitY(unit);
	}

	public setOwner(player: player): void {
		SetUnitOwner(this._unit, player, true);
	}

	public getOwner(): player {
		return GetOwningPlayer(this._unit);
	}

	public reset(): void {
		SetUnitOwner(this.unit, NEUTRAL_HOSTILE, true);
	}

	public get unit(): unit {
		return this._unit;
	}

	public get unitType(): number {
		return this._unitType;
	}

	public get defaultX(): number {
		return this._defaultX;
	}

	public get defaultY(): number {
		return this._defaultY;
	}
}
