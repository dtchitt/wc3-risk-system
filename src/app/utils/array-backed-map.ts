export class ArrayBackedMap<K, V> {
	private map: Map<K, V>;
	private array: V[];

	constructor() {
		this.map = new Map<K, V>();
		this.array = [];
	}

	public set(key: K, value: V) {
		if (!this.map.has(key)) {
			this.map.set(key, value);
			this.array.push(value);
		}
	}

	public delete(key: K): boolean {
		if (this.map.has(key)) {
			const value = this.map.get(key);
			this.map.delete(key);
			if (value) {
				const index = this.array.indexOf(value);
				this.array.splice(index, 1);
			}
			return true;
		}
		return false;
	}

	public has(key: K): boolean {
		return this.map.has(key);
	}

	public get(key: K): V | undefined {
		return this.map.get(key);
	}

	public size(): number {
		return this.array.length;
	}

	public getRandomValue(): V | undefined {
		const randomIndex = Math.floor(Math.random() * this.array.length);
		return this.array[randomIndex];
	}
}
