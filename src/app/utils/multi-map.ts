//Credit to Eonfuzz@github aka Boar @hiveworkshop discord

export class MultiMap<key1, key2, value> {
	private data = new Map<key1, Map<key2, value>>();

	get(k1: key1, k2: key2): value | undefined {
		if (this.data.has(k1)) {
			return this.data.get(k1).get(k2);
		}
	}

	set(k1: key1, k2: key2, val: value): void {
		if (!this.data.has(k1)) {
			this.data.set(k1, new Map<key2, value>());
		}

		this.data.get(k1).set(k2, val);
	}

	has(k1: key1, k2: key2): boolean {
		return this.data.has(k1) && this.data.get(k1)?.has(k2);
	}

	delete(k1: key1): boolean {
		return this.data?.delete(k1);
	}

	deleteChild(k1: key1, k2: key2): boolean {
		if (this.data.has(k1)) {
			return this.data.get(k1).delete(k2);
		}
	}

	clear(): void {
		this.data.clear();
	}
}
