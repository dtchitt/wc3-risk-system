import { City } from './city';
import { Barracks } from './components/barracks';
import { Guard } from './components/guard';
import { LandCity } from './land-city';
import { SeaCity } from './sea-city';

export type CityType = 'land' | 'port';

type CityConstructor = new (barracks: Barracks, guard: Guard, cop: unit) => City;

export const CityTypes: Record<CityType, CityConstructor> = {
	land: LandCity,
	port: SeaCity,
};
