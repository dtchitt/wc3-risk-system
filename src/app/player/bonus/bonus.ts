import { Resetable } from 'src/app/interfaces/resetable';

export interface Bonus extends Resetable {
	reset(): void;
	add(val: number): void;
}
