export const NEUTRAL_HOSTILE: player = Player(PLAYER_NEUTRAL_AGGRESSIVE);

const errorMap: Map<player, timer> = new Map<player, timer>();

export function ErrorMsg(player: player, msg: string, duration: number = 3) {
	if (errorMap.has(player)) {
		PauseTimer(errorMap.get(player));
		DestroyTimer(errorMap.get(player));
	}

	if (player == GetLocalPlayer()) {
		BlzFrameSetText(BlzGetFrameByName('ErrorMessageFrame', 0), msg);
	}

	PlayLocalSound('Sound\\Interface\\Error.flac', player);

	const errorTimer: timer = CreateTimer();
	errorMap.set(player, errorTimer);

	TimerStart(errorTimer, duration, false, () => {
		if (player == GetLocalPlayer()) {
			BlzFrameSetText(BlzGetFrameByName('ErrorMessageFrame', 0), '');
		}

		PauseTimer(errorTimer);
		DestroyTimer(errorTimer);
	});
}

export function GlobalMessage(msg: string, soundPath: string, duration: number = 3) {
	const frame: framehandle = BlzGetFrameByName('GlobalMessageFrame', 0);
	let str: string = '';

	if (BlzFrameGetText(frame) != '') {
		str = BlzFrameGetText(frame);
		str = `${str}\n${msg}`;
	}

	BlzFrameSetText(frame, msg);
	PlayGlobalSound(soundPath);

	const playerMsgTimer: timer = CreateTimer();

	TimerStart(playerMsgTimer, duration, false, () => {
		BlzFrameSetText(frame, '');

		PauseTimer(playerMsgTimer);
		DestroyTimer(playerMsgTimer);
	});
}

export function CountdownMessage(msg: string) {
	const frame: framehandle = BlzGetFrameByName('CountdownFrame', 0);
	BlzFrameSetText(frame, msg);
}

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
