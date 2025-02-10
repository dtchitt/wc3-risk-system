import { Country } from '../country/country';
import { Resetable } from '../interfaces';
import { Region } from './region';

export interface RegionBuilder extends Resetable {
	addCountry(country: Country): RegionBuilder;
	setGoldBonus(goldBonus: number): RegionBuilder;
	build(): Region;
}
