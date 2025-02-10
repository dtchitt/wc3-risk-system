import { Resetable } from '../interfaces';

export interface Bonus extends Resetable {
	add(val: number): void;
	getTotal(): number;
}
