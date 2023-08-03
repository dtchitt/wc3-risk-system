//This mostly works, but I am putting it on hold. There is issues with removing the players from the game.

// import { File } from 'w3ts';
// import { NameManager } from '../managers/names/name-manager';
// import { GlobalMessage } from '../utils/messages';

// type Multis = {
// 	player: player;
// 	name: string;
// 	multiName: string;
// };

// export class AntiCheat {
// 	private static multis: Multis[] = [];

// 	public static checkMultiAccounts(onComplete: () => void) {
// 		GlobalMessage(`Processing Players, please wait.`, null);

// 		try {
// 			const path: string = 'check.pld';
// 			const nameManager: NameManager = NameManager.getInstance();

// 			for (let i = 0; i < bj_MAX_PLAYERS; i++) {
// 				const player: player = Player(i);

// 				if (GetPlayerController(player) == MAP_CONTROL_USER && GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING) {
// 					const name: string = nameManager.getBtag(player);

// 					if (player == GetLocalPlayer()) {
// 						File.write(path, name);
// 					}
// 				}
// 			}

// 			const waitTimer: timer = CreateTimer();

// 			TimerStart(waitTimer, 1, false, () => {
// 				for (let i = 0; i < bj_MAX_PLAYERS; i++) {
// 					const player: player = Player(i);

// 					if (GetPlayerController(player) == MAP_CONTROL_USER && GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING) {
// 						const name: string = nameManager.getBtag(player);
// 						let contents: string = '';

// 						if (player == GetLocalPlayer()) {
// 							contents = File.read(path);
// 						}

// 						if (contents != name) {
// 							AntiCheat.multis.push({
// 								player: player,
// 								name: name,
// 								multiName: contents,
// 							});
// 						}
// 					}
// 				}

// 				AntiCheat.processMultis();
// 				PauseTimer(waitTimer);
// 				DestroyTimer(waitTimer);
// 				onComplete();
// 			});
// 		} catch (error) {
// 			print(error);
// 		}
// 	}

// 	private static processMultis() {
// 		AntiCheat.multis.forEach((player) => {
// 			print('loop');
// 			try {
// 				const multiAcct: player = NameManager.getInstance().getPlayerFromBtag(player.multiName);

// 				if (multiAcct) {
// 					print(`ma ${multiAcct} ${NameManager.getInstance().getBtag(multiAcct)}`);
// 					RemovePlayer(multiAcct, PLAYER_GAME_RESULT_DEFEAT);

// 					print(`main ${NameManager.getInstance().getBtag(player.player)} name ${player.name}`);
// 					RemovePlayer(player.player, PLAYER_GAME_RESULT_DEFEAT);
// 				}
// 			} catch (error) {
// 				print(error);
// 			}
// 		});
// 	}
// }
