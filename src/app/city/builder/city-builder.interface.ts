import { ICityData } from './city-data.interface';
import { City } from '../city';
import { Resetable } from 'src/app/interfaces';

export interface ICityBuilder extends Resetable {
	setData(cityData: ICityData): void;
	build(): City;
}
