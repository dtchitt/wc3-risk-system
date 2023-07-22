import { Resetable } from 'src/app/libs/resetable';

export interface Bonus extends Resetable {
	reset(): void;
	add(val: number): void;
}
