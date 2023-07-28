export const NEUTRAL_HOSTILE: player = Player(PLAYER_NEUTRAL_AGGRESSIVE);

export function PlayLocalSound(soundPath: string, player: player) {
	let sound = CreateSound(soundPath, false, false, true, 10, 10, '');

	if (GetLocalPlayer() != player) SetSoundVolume(sound, 0);

	StartSound(sound);
	KillSoundWhenDone(sound);
	sound = null;
}

export function PlayGlobalSound(soundPath: string) {
	let sound = CreateSound(soundPath, false, false, true, 10, 10, '');

	StartSound(sound);
	KillSoundWhenDone(sound);
	sound = null;
}

export function ShuffleArray(arr: any[]): void {
	for (let i: number = arr.length - 1; i > 0; i--) {
		const j: number = Math.floor(Math.random() * (i + 1));

		const temp: any = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
}

export function GetRandomElements(arr: any[], numElements: number): any[] {
	const shuffledArray = arr.sort(() => Math.random() - 0.5);
	const selectedElements = shuffledArray.splice(0, numElements);

	return selectedElements;
}

export function isNonEmptySubstring(substring: string, string: string): boolean {
	substring = substring.toLowerCase().trim();
	string = string.toLowerCase().trim();

	return substring !== '' && string.includes(substring);
}

export function DistanceBetweenCoords(x1: number, y1: number, x2: number, y2: number) {
	return SquareRoot(Pow(x2 - x1, 2) + Pow(y2 - y1, 2));
}

//TODO figure out a better way to do this
export function IsUnitMelee(unit: unit): boolean {
	return IsUnitType(unit, UNIT_TYPE_MELEE_ATTACKER);
}
