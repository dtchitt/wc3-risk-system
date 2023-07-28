import { PlayGlobalSound, PlayLocalSound } from './utils';

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

type localMessages = {
	timer: timer;
	msg: string;
};

const localMsgMap: Map<player, localMessages> = new Map<player, localMessages>();

export function LocalMessage(player: player, msg: string, soundPath: string, duration: number = 3) {
	const frame: framehandle = BlzGetFrameByName('LocalMessageFrameOne', 0);
	let str: string = '';

	if (BlzFrameGetText(frame) != '') {
		str = BlzFrameGetText(frame);
		str = `${str}\n${msg}`;
	}

	BlzFrameSetText(frame, msg);
	PlayLocalSound(soundPath, player);

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
