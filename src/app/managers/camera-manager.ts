import { File } from 'w3ts';

type CamData = {
	distance: number;
	angle: number;
	rotation: number;
};

export enum CamSettings {
	MIN_DISTANCE = 1000.0,
	MAX_DISTANCE = 8500.0,
	DEFAULT_DISTANCE = 4000.0,

	MIN_ANGLE = 270.0,
	MAX_ANGLE = 350.0,
	DEFAULT_ANGLE = 290.0,

	MIN_ROTATION = 0.0,
	MAX_ROTATION = 360.0,
	DEFAULT_ROTATION = 90.0,
}

export default class CameraManager {
	private static _instance: CameraManager;
	private _pathFolderName: string = 'risk';
	private _fileName: string = 'camera.pld';
	private _camData: Map<player, CamData> = new Map<player, CamData>();

	public static getInstance() {
		if (this._instance == null) {
			this._instance = new CameraManager();
		}
		return this._instance;
	}

	private constructor() {
		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			const player: player = Player(i);

			let sDist: number;
			let sAngle: number;
			let sRot: number;

			if (GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING && GetPlayerController(player) == MAP_CONTROL_USER) {
				let contents: string;

				if (player == GetLocalPlayer()) {
					contents = File.read(this.getFilePath(player));
				}

				if (contents) {
					sDist = S2R(contents.split(' ')[0]);
					sAngle = S2R(contents.split(' ')[1]);
					sRot = S2R(contents.split(' ')[2]);
				} else {
					if (player == GetLocalPlayer()) {
						File.write(
							this.getFilePath(player),
							`${CamSettings.DEFAULT_DISTANCE} ${CamSettings.DEFAULT_ANGLE} ${CamSettings.DEFAULT_ROTATION}`
						);
					}
				}

				this._camData.set(player, {
					distance: !sDist ? CamSettings.DEFAULT_DISTANCE : sDist,
					angle: !sAngle ? CamSettings.DEFAULT_ANGLE : sAngle,
					rotation: !sRot ? CamSettings.DEFAULT_ROTATION : sRot,
				});
			}
		}

		this.camReset();
	}

	public update(player: player) {
		let distance: string = GetEventPlayerChatString().split(' ')[1];
		let angle: string = GetEventPlayerChatString().split(' ')[2];
		let rotation: string = GetEventPlayerChatString().split(' ')[3];

		distance = this.isNumber(distance) ? distance : `${CamSettings.DEFAULT_DISTANCE}`;
		angle = this.isNumber(angle) ? angle : `${CamSettings.DEFAULT_ANGLE}`;
		rotation = this.isNumber(rotation) ? rotation : `${CamSettings.DEFAULT_ROTATION}`;

		this.checkCamData(this._camData.get(player), [distance, angle, rotation]);

		if (player == GetLocalPlayer()) {
			File.write(this.getFilePath(player), `${distance} ${angle} ${rotation}`);
		}
	}

	private camReset() {
		const camTimer: timer = CreateTimer();

		TimerStart(camTimer, 0.5, true, () => {
			for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
				if (this._camData.has(Player(i))) this.setCameraFields(Player(i), this._camData.get(Player(i)));
			}
		});
	}

	private checkCamData(data: CamData, vals: string[]) {
		if (vals[0]) this.checkDistance(data, S2R(vals[0]));
		if (vals[1]) this.checkAngle(data, S2R(vals[1]));
		if (vals[2]) this.checkRotation(data, S2R(vals[2]));
	}

	private checkDistance(data: CamData, val: number) {
		if (val > CamSettings.MAX_DISTANCE) val = CamSettings.MAX_DISTANCE;
		if (val < CamSettings.MIN_DISTANCE) val = CamSettings.MIN_DISTANCE;

		return (data.distance = val);
	}

	private checkAngle(data: CamData, val: number) {
		if (val > CamSettings.MAX_ANGLE) val = CamSettings.MAX_ANGLE;
		if (val < CamSettings.MIN_ANGLE) val = CamSettings.MIN_ANGLE;

		return (data.angle = val);
	}

	private checkRotation(data: CamData, val: number) {
		if (val > CamSettings.MAX_ROTATION) val = CamSettings.MAX_ROTATION;
		if (val < CamSettings.MIN_ROTATION) val = CamSettings.MIN_ROTATION;

		return (data.rotation = val);
	}

	private setCameraFields(p: player, data: CamData) {
		SetCameraFieldForPlayer(p, CAMERA_FIELD_TARGET_DISTANCE, data.distance, 0.0);
		SetCameraFieldForPlayer(p, CAMERA_FIELD_ANGLE_OF_ATTACK, data.angle, 0.0);
		SetCameraFieldForPlayer(p, CAMERA_FIELD_ROTATION, data.rotation, 0.0);
		SetCameraFieldForPlayer(p, CAMERA_FIELD_FARZ, 10000, 0.0);
	}

	private isNumber(str: string): boolean {
		if (typeof str !== 'string') return false;
		if (str.trim() === '') return false;

		return !Number.isNaN(Number(str));
	}

	private getFilePath(player: player): string {
		return `${this._pathFolderName}/${GetPlayerName(player)}/${this._fileName}`;
	}
}