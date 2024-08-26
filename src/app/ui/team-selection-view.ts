import { PlayerManager } from '../entity/player/player-manager';
import { GameState } from '../game/game-state';
import { NameManager } from '../managers/names/name-manager';
import { SettingsController } from '../settings/settings-controller';
import { EventTimer } from '../timer/EventTimer';
import { HexColors } from '../utils/hex-colors';

interface playerData {
	bench: number;
	team: number;
	slot: number;
}

export class TeamSelectionView {
	private static backdrop: framehandle;
	private static bench: Set<player> = new Set<player>();
	private static playerPosition: Map<player, playerData> = new Map<player, playerData>();
	private static team: Map<number, Set<player>> = new Map<number, Set<player>>();
	private static teamSlots: Map<number, boolean[]> = new Map<number, boolean[]>();
	private static teamColumnPositions: Record<number, { x: number; y: number }> = {
		0: { x: 0.038, y: -0.06 },
		1: { x: 0.158, y: -0.06 },
		2: { x: 0.278, y: -0.06 },
		3: { x: 0.398, y: -0.06 },
		4: { x: 0.518, y: -0.06 },
		5: { x: 0.038, y: -0.23 },
		6: { x: 0.158, y: -0.23 },
		7: { x: 0.278, y: -0.23 },
		8: { x: 0.398, y: -0.23 },
		9: { x: 0.518, y: -0.23 },
		10: { x: 0.038, y: -0.4 },
	};

	public static build(duration: number, gameState: GameState) {
		PlayerManager.getInstance()
			.getPlayers()
			.forEach((player) => {
				TeamSelectionView.bench.add(player.getPlayer());
			});

		const cols: number = 11; //Math.ceil(TeamSelectionView.bench.size / SettingsController.getInstance().getTeamSize());
		const backdropWidth: number = 1;

		TeamSelectionView.backdrop = BlzCreateFrame('QuestButtonBaseTemplate', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0);
		BlzFrameSetPoint(TeamSelectionView.backdrop, FRAMEPOINT_TOP, BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), FRAMEPOINT_TOP, 0, -0.021);
		BlzFrameSetSize(TeamSelectionView.backdrop, backdropWidth, 0.56);

		const titleText: framehandle = BlzCreateFrameByType('TEXT', 'TeamSelectionTitle', TeamSelectionView.backdrop, '', 0);
		BlzFrameSetPoint(titleText, FRAMEPOINT_TOP, TeamSelectionView.backdrop, FRAMEPOINT_TOP, 0.0, -0.01);
		BlzFrameSetText(titleText, `${HexColors.TANGERINE}Team Selection|r`);
		BlzFrameSetScale(titleText, 2);

		const benchText: framehandle = BlzCreateFrameByType('TEXT', 'PlayerBenchTitle', TeamSelectionView.backdrop, '', 0);
		BlzFrameSetPoint(benchText, FRAMEPOINT_TOPLEFT, TeamSelectionView.backdrop, FRAMEPOINT_TOPLEFT, 0.448, -0.045);
		BlzFrameSetText(benchText, `${HexColors.TANGERINE}Player Bench|r`);
		BlzFrameSetScale(benchText, 1.5);

		const benchButton: framehandle = BlzCreateFrameByType(
			'GLUETEXTBUTTON',
			'TeamSelectionStartButton',
			TeamSelectionView.backdrop,
			'ScriptDialogButton',
			0
		);

		BlzFrameSetText(benchButton, 'Join Bench');
		BlzFrameSetSize(benchButton, 0.095, 0.025);
		BlzFrameSetPoint(benchButton, FRAMEPOINT_TOP, benchText, FRAMEPOINT_BOTTOM, 0, -0.004);

		const benchTrig: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(benchTrig, benchButton, FRAMEEVENT_CONTROL_CLICK);
		TriggerAddCondition(
			benchTrig,
			Condition(() => {
				const triggerPlayer: player = GetTriggerPlayer();
				const playerData = TeamSelectionView.playerPosition.get(triggerPlayer);

				if (playerData.team != -1) {
					const playerName = NameManager.getInstance().getAcct(triggerPlayer);

					BlzFrameSetText(BlzGetFrameByName(`TeamSlot`, playerData.slot), `-`);
					TeamSelectionView.teamSlots.get(playerData.team)[playerData.slot] = false;
					BlzFrameSetText(BlzGetFrameByName('PlayerList', playerData.bench), `${playerName}`);
					TeamSelectionView.team.get(playerData.team).delete(triggerPlayer);
					playerData.slot = -1;
					playerData.team = -1;
				}
			})
		);

		let x: number = 0;
		let initialOffset: number = -0.003;
		const offSetModifier: number = -0.015;

		TeamSelectionView.bench.forEach((player) => {
			const playerList: framehandle = BlzCreateFrameByType('TEXT', 'PlayerList', TeamSelectionView.backdrop, '', x);
			BlzFrameSetPoint(playerList, FRAMEPOINT_TOP, benchButton, FRAMEPOINT_BOTTOM, 0, initialOffset);
			BlzFrameSetText(playerList, `${NameManager.getInstance().getAcct(player)}`);
			TeamSelectionView.playerPosition.set(player, { bench: x, team: -1, slot: -1 });
			x++;
			initialOffset += offSetModifier;
		});

		const timer: framehandle = BlzCreateFrameByType('TEXT', 'TeamSelectionTimer', TeamSelectionView.backdrop, '', 0);
		BlzFrameSetScale(timer, 1.2);
		BlzFrameSetPoint(timer, FRAMEPOINT_TOPRIGHT, TeamSelectionView.backdrop, FRAMEPOINT_TOPRIGHT, -0.01, -0.01);
		BlzFrameSetText(timer, `${duration}`);

		const timerLabel: framehandle = BlzCreateFrameByType('TEXT', 'TeamSelectionTimerLabel', TeamSelectionView.backdrop, '', 0);
		BlzFrameSetText(timerLabel, `${HexColors.TANGERINE}Auto Start in:`);
		BlzFrameSetScale(timerLabel, 1.2);
		BlzFrameSetPoint(timerLabel, FRAMEPOINT_TOPRIGHT, TeamSelectionView.backdrop, FRAMEPOINT_TOPRIGHT, -0.03, -0.01);

		const startButton: framehandle = BlzCreateFrameByType(
			'GLUETEXTBUTTON',
			'TeamSelectionStartButton',
			TeamSelectionView.backdrop,
			'ScriptDialogButton',
			0
		);

		BlzFrameSetText(startButton, 'Start Now');
		BlzFrameSetSize(startButton, 0.095, 0.025);
		BlzFrameSetPoint(startButton, FRAMEPOINT_TOP, timerLabel, FRAMEPOINT_BOTTOM, 0.015, 0);

		const buttonTrig: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(buttonTrig, startButton, FRAMEEVENT_CONTROL_CLICK);
		TriggerAddCondition(
			buttonTrig,
			Condition(() => {
				if (TeamSelectionView.bench.size <= 0) {
					TeamSelectionView.hide();
					EventTimer.getInstance().stopEvent('uiTimer');
					gameState.end();
				} else {
					//TODO Sound bite
				}
			})
		);

		for (let i = 0; i < cols; i++) {
			const position = TeamSelectionView.teamColumnPositions[i];
			TeamSelectionView.addColumn(i + 1, position.x, position.y);
		}
	}

	public static addColumn(num: number, x: number, y: number) {
		const editbox = BlzCreateFrame('EscMenuEditBoxTemplate', TeamSelectionView.backdrop, 0, num);
		BlzFrameSetPoint(editbox, FRAMEPOINT_TOPLEFT, TeamSelectionView.backdrop, FRAMEPOINT_TOPLEFT, x, y);
		BlzFrameSetSize(editbox, 0.1, 0.026);
		BlzFrameSetText(editbox, `Team #${num}`);
		BlzFrameSetTextSizeLimit(editbox, 16);

		const button = BlzCreateFrameByType('GLUETEXTBUTTON', 'TeamSlotButton', TeamSelectionView.backdrop, 'ScriptDialogButton', num);
		BlzFrameSetText(button, 'Join Team');
		BlzFrameSetPoint(button, FRAMEPOINT_TOP, editbox, FRAMEPOINT_BOTTOM, 0, 0);
		BlzFrameSetSize(button, 0.08, 0.025);

		const buttonTrig: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(buttonTrig, button, FRAMEEVENT_CONTROL_CLICK);
		TriggerAddCondition(
			buttonTrig,
			Condition(() => {
				const triggerPlayer: player = GetTriggerPlayer();
				const playerData = TeamSelectionView.playerPosition.get(triggerPlayer);

				if (playerData.team != num) {
					const playerName = NameManager.getInstance().getAcct(triggerPlayer);

					if (playerData.team != -1) {
						BlzFrameSetText(BlzGetFrameByName(`TeamSlot`, playerData.slot), `-`);
						TeamSelectionView.teamSlots.get(playerData.team)[playerData.slot] = false;
					}

					const availableSlot = TeamSelectionView.findFirstAvailableSlot(num);

					if (availableSlot !== -1) {
						BlzFrameSetText(BlzGetFrameByName(`TeamSlot`, availableSlot), playerName);
						playerData.slot = availableSlot;
						playerData.team = num;
						TeamSelectionView.teamSlots.get(num)[availableSlot] = true;

						if (!TeamSelectionView.team.has(num)) {
							TeamSelectionView.team.set(num, new Set<player>());
						}

						TeamSelectionView.team.get(num).add(triggerPlayer);
						BlzFrameSetText(BlzGetFrameByName('PlayerList', playerData.bench), `-`);
						TeamSelectionView.bench.delete(triggerPlayer);
					} else {
						//TODO maybe a sound bite?
					}
				}
			})
		);

		const teamsize: number = SettingsController.getInstance().getTeamSize();
		let initialOffset: number = -0.002;
		const offSetModifier: number = -0.015;
		const slots = [];

		for (let i = 0; i < teamsize; i++) {
			slots.push(false);
		}

		TeamSelectionView.teamSlots.set(num, slots);

		for (let i = 0; i < teamsize; i++) {
			const slotNumber: number = i * 100 + num;
			const frame = BlzCreateFrameByType('TEXT', 'TeamSlot', TeamSelectionView.backdrop, '', slotNumber);
			BlzFrameSetPoint(frame, FRAMEPOINT_TOP, button, FRAMEPOINT_BOTTOM, 0, initialOffset);
			BlzFrameSetText(frame, `-`);
			BlzFrameSetScale(frame, 1.1);

			initialOffset += offSetModifier;
		}
	}

	private static findFirstAvailableSlot(teamNumber: number): number {
		const slots = TeamSelectionView.teamSlots.get(teamNumber);

		if (slots) {
			for (let i = 0; i < slots.length; i++) {
				if (!slots[i]) {
					return i * 100 + teamNumber;
				}
			}
		}
		return -1;
	}

	public static update() {
		const event = EventTimer.getInstance().getEvent('uiTimer');
		BlzFrameSetText(BlzGetFrameByName('TeamSelectionTimer', 0), I2S(event.remainingTime));
	}

	public static hide() {
		BlzFrameSetEnable(TeamSelectionView.backdrop, false);
		BlzFrameSetVisible(TeamSelectionView.backdrop, false);
		TeamSelectionView.bench.clear();
	}
}
