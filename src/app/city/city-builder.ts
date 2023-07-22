import { Resetable } from '../libs/resetable';
import { UnitData } from '../libs/unit-data';
import { City } from './city';
import { CityType } from './city-type';

export interface CityBuilder extends Resetable {
	setBarracks(building: unit | UnitData): CityBuilder;
	setGuard(guard: number): CityBuilder;
	setName(name?: string): CityBuilder;
	setCOP(cop?: unit): CityBuilder;
	setCityType(cityType?: CityType): CityBuilder;
	build(): City;
}
