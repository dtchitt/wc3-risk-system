import { Resetable } from '../interfaces/resetable';
import { EntityData } from './entity-data';

export interface GameEntity extends Resetable {
	getData(): EntityData;
}
