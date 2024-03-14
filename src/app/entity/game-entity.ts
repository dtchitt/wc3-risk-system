import { Resetable } from '../interfaces/resetable';
import { EntityActions } from './entity-actions';
import { EntityData } from './entity-data';

export interface GameEntity extends EntityActions, Resetable {
	getData(): EntityData;
}
