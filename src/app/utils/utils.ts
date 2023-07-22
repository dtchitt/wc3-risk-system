export const NEUTRAL_HOSTILE: player = Player(PLAYER_NEUTRAL_AGGRESSIVE);

const errorMap: Map<player, timer> = new Map<player, timer>();

export function ErrorMsg(player: player, msg: string, duration: number = 2) {
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

export function PlayerMsg(msg: string, duration: number = 4) {
	const frame: framehandle = BlzGetFrameByName('PlayerMessageFrame', 0);
	let str: string = '';

	if (BlzFrameGetText(frame) != '') {
		str = BlzFrameGetText(frame);
		str = `${str}\n${msg}`;
	}

	BlzFrameSetText(frame, msg);
	PlayGlobalSound('Sound\\Interface\\SecretFound.flac');

	const playerMsgTimer: timer = CreateTimer();

	TimerStart(playerMsgTimer, duration, false, () => {
		BlzFrameSetText(frame, '');

		PauseTimer(playerMsgTimer);
		DestroyTimer(playerMsgTimer);
	});
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
