import { Coordinates } from 'src/app/interfaces';
import { CityType } from '../city-type';

export interface ICityData extends Coordinates {
	cityType?: CityType;
	guardType?: number;
}
