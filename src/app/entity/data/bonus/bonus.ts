import { Resetable } from 'src/app/interfaces/resetable';

export interface Bonus extends Resetable {
	add(val: number): void;
	getTotal(): number;
}
