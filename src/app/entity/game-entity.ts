import { Resetable } from '../interfaces';
import { EntityActions } from './entity-actions';
import { EntityData } from './entity-data';

export interface GameEntity<T> extends EntityActions, Resetable {
	getData(): EntityData<T>;
}
