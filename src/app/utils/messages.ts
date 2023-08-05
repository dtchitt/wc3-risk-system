import { PlayGlobalSound, PlayLocalSound } from './utils';

export function CountdownMessage(msg: string) {
	const frame: framehandle = BlzGetFrameByName('CountdownFrame', 0);
	BlzFrameSetText(frame, msg);
}

export function GlobalMessage(msg: string, soundPath: string, duration: number = 3) {
	const frame: framehandle = BlzGetFrameByName('GlobalMessageFrame', 0);
	let str: string = '';

	if (BlzFrameGetText(frame) != '') {
		str = BlzFrameGetText(frame);
		str = `${str}\n${msg}`;
	}

	BlzFrameSetText(frame, msg);

	if (soundPath) PlayGlobalSound(soundPath);

	const playerMsgTimer: timer = CreateTimer();

	TimerStart(playerMsgTimer, duration, false, () => {
		BlzFrameSetText(frame, '');

		PauseTimer(playerMsgTimer);
		DestroyTimer(playerMsgTimer);
	});
}

const errorMap: Map<player, timer> = new Map<player, timer>();

export function ErrorMsg(player: player, msg: string, duration: number = 3) {
	if (errorMap.has(player)) {
		PauseTimer(errorMap.get(player));
		DestroyTimer(errorMap.get(player));
	}

	BlzFrameSetText(BlzGetFrameByName('ErrorMessageFrame', GetPlayerId(player)), msg);
	PlayLocalSound('Sound\\Interface\\Error.flac', player);

	const errorTimer: timer = CreateTimer();
	errorMap.set(player, errorTimer);

	TimerStart(errorTimer, duration, false, () => {
		BlzFrameSetText(BlzGetFrameByName('ErrorMessageFrame', GetPlayerId(player)), '');
		PauseTimer(errorTimer);
		DestroyTimer(errorTimer);
		errorMap.delete(player);
	});
}

const localMsgMap: Map<player, timer> = new Map<player, timer>();
//TODO add support for multi message display, each message should have its own duration
export function LocalMessage(player: player, msg: string, soundPath: string, duration: number = 3) {
	if (localMsgMap.has(player)) {
		PauseTimer(localMsgMap.get(player));
		DestroyTimer(localMsgMap.get(player));
		BlzFrameSetText(BlzGetFrameByName('LocalMessageFrame', GetPlayerId(player)), '');
	}

	BlzFrameSetText(BlzGetFrameByName('LocalMessageFrame', GetPlayerId(player)), msg);
	PlayLocalSound(soundPath, player);

	const localTimer: timer = CreateTimer();
	localMsgMap.set(player, localTimer);

	TimerStart(localTimer, duration, false, () => {
		BlzFrameSetText(BlzGetFrameByName('LocalMessageFrame', GetPlayerId(player)), '');
		PauseTimer(localTimer);
		DestroyTimer(localTimer);
		localMsgMap.delete(player);
	});
}
