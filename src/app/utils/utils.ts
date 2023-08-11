/** The player object for neutral hostile units. */
export const NEUTRAL_HOSTILE: player = Player(PLAYER_NEUTRAL_AGGRESSIVE);

/** The number of player slots in the game, excluding neutral players. */
export const PLAYER_SLOTS: number = bj_MAX_PLAYERS - 1;

/**
 * Play a local sound for a specific player.
 * @param soundPath - The path of the sound file to play.
 * @param player - The player for whom the sound should be played.
 */
export function PlayLocalSound(soundPath: string, player: player) {
	let sound = CreateSound(soundPath, false, false, true, 10, 10, '');

	if (GetLocalPlayer() != player) SetSoundVolume(sound, 0);

	StartSound(sound);
	KillSoundWhenDone(sound);
	sound = null;
}

/**
 * Play a global sound for all players.
 * @param soundPath - The path of the sound file to play.
 */
export function PlayGlobalSound(soundPath: string) {
	let sound = CreateSound(soundPath, false, false, true, 10, 10, '');

	StartSound(sound);
	KillSoundWhenDone(sound);
	sound = null;
}

/**
 * Shuffles the array in-place.
 * @param arr - The array to shuffle.
 */
export function ShuffleArray(arr: any[]): void {
	for (let i: number = arr.length - 1; i > 0; i--) {
		const j: number = Math.floor(Math.random() * (i + 1));

		const temp: any = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
}

/**
 * Selects a specified number of random elements from an array.
 * @param arr - The array to select from.
 * @param numElements - The number of elements to select.
 * @returns An array containing the selected elements.
 */
export function GetRandomElements(arr: any[], numElements: number): any[] {
	const shuffledArray = arr.sort(() => Math.random() - 0.5);
	const selectedElements = shuffledArray.splice(0, numElements);

	return selectedElements;
}

/**
 * Checks if a string is a non-empty substring of another string. Both strings are
 * transformed to lower case and trimmed before comparison.
 * @param substring - The string to search for.
 * @param string - The string to search in.
 * @returns True if the substring is non-empty and found within the string.
 */
export function isNonEmptySubstring(substring: string, string: string): boolean {
	substring = substring.toLowerCase().trim();
	string = string.toLowerCase().trim();

	return substring !== '' && string.includes(substring);
}

/**
 * Computes the distance between two sets of coordinates.
 * @param x1 - The x-coordinate of the first location.
 * @param y1 - The y-coordinate of the first location.
 * @param x2 - The x-coordinate of the second location.
 * @param y2 - The y-coordinate of the second location.
 * @returns The distance between the two locations.
 */
export function DistanceBetweenCoords(x1: number, y1: number, x2: number, y2: number) {
	return SquareRoot(Pow(x2 - x1, 2) + Pow(y2 - y1, 2));
}

/**
 * Determines if a unit is melee.
 * @param unit - The unit to test.
 * @returns True if the unit is melee, otherwise false
 */
export function IsUnitMelee(unit: unit): boolean {
	return IsUnitType(unit, UNIT_TYPE_MELEE_ATTACKER);
}

export function GetRandomElementFromArray<T>(items: T[]): T | null {
	if (items.length < 1) return null;

	const randomIndex = Math.floor(Math.random() * items.length);
	const lastIndex = items.length - 1;

	[items[randomIndex], items[lastIndex]] = [items[lastIndex], items[randomIndex]];

	const item = items.pop();

	return item;
}
