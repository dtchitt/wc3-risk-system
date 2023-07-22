import { CityGuardXOffSet, CityGuardYOffSet, DefaultCityType, CityRegionSize } from 'src/configs/city-settings';
import { DefaultBarrackType, DefaultGuardType } from 'src/configs/country-settings';
import { UNIT_ID } from 'src/configs/unit-id';
import { NEUTRAL_HOSTILE } from '../utils/utils';
import { City } from './city';
import { CityBuilder } from './city-builder';
import { UnitToCity, RegionToCity } from './city-map';
import { CityType, CityTypes } from './city-type';
import { Barracks } from './components/barracks';
import { Guard } from './components/guard';
import { UnitData } from '../libs/unit-data';
import { EnterRegionEvent } from '../triggers/on-enter-event';
import { LeaveRegionEvent } from '../triggers/on-leave-event';
import { UnitTrainedEvent } from '../triggers/unit-trained-event';

const GetRaxXOffSet = (rax: unit) => GetUnitX(rax) - CityGuardXOffSet;
const GetRaxYOffSet = (rax: unit) => GetUnitY(rax) - CityGuardYOffSet;

export class ConcreteCityBuilder implements CityBuilder {
	private _barracks: Barracks;
	private _guard: Guard;
	private _cop: unit;
	private _cityType: CityType;

	public setBarracks(building: unit | UnitData): CityBuilder {
		if (typeof building === 'object') {
			const rax: UnitData = building as UnitData;

			if (!rax.typeId) {
				rax.typeId = DefaultBarrackType;
			}

			this._barracks = new Barracks(CreateUnit(NEUTRAL_HOSTILE, rax.typeId, rax.x, rax.y, 270));
		} else {
			this._barracks = new Barracks(building);
		}

		return this;
	}

	public setName(name?: string): CityBuilder {
		if (name) {
			BlzSetUnitName(this._barracks.unit, name);
		}

		return this;
	}

	public setGuard(guard: number): CityBuilder {
		const x: number = GetRaxXOffSet(this._barracks.unit);
		const y: number = GetRaxYOffSet(this._barracks.unit);

		if (!guard) {
			guard = DefaultGuardType;
		}

		this._guard = new Guard(guard, x, y);

		return this;
	}

	public setCOP(cop?: unit): CityBuilder {
		if (cop) {
			this._cop = cop;
		} else {
			const x: number = GetRaxXOffSet(this._barracks.unit);
			const y: number = GetRaxYOffSet(this._barracks.unit);

			this._cop = CreateUnit(NEUTRAL_HOSTILE, UNIT_ID.CONTROL_POINT, x, y, 270);
		}

		return this;
	}

	public setCityType(cityType?: CityType): CityBuilder {
		if (cityType) {
			this._cityType = cityType;
		} else {
			this._cityType = DefaultCityType;
		}

		return this;
	}

	public build(): City {
		if (!this._barracks || !this._guard || !this._cop || !this._cityType) {
			print('City builder is missing required components.');
		}

		const CityConstructor = CityTypes[this._cityType];

		if (!CityConstructor) {
			print(`No city terrain type of "${this._cityType}" found`);
		}

		const city = new CityConstructor(this._barracks, this._guard, this._cop);

		this.setRegion(city);
		TriggerRegisterUnitEvent(UnitTrainedEvent, city.barrack.unit, EVENT_UNIT_TRAIN_FINISH);
		UnitToCity.set(this._barracks.unit, city);
		UnitToCity.set(this._guard.unit, city);
		city.setOwner(NEUTRAL_HOSTILE);

		this.reset();

		return city;
	}

	public reset(): void {
		this._barracks = null;
		this._guard = null;
		this._cop = null;
		this._cityType = null;
	}

	private setRegion(city: City): void {
		const rect = Rect(
			city.guard.defaultX - CityRegionSize / 2,
			city.guard.defaultY - CityRegionSize / 2,
			city.guard.defaultX + CityRegionSize / 2,
			city.guard.defaultY + CityRegionSize / 2
		);

		const region = CreateRegion();
		RegionAddRect(region, rect);
		RemoveRect(rect);
		TriggerRegisterEnterRegion(EnterRegionEvent, region, null);
		TriggerRegisterLeaveRegion(LeaveRegionEvent, region, null);
		RegionToCity.set(region, city);
	}
}
