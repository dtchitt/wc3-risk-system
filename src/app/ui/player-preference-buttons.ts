import { createGuardButton } from '../factory/guard-button-factory';
import { ActivePlayer } from '../player/types/active-player';
import { HexColors } from '../utils/hex-colors';

export function buildGuardHealthButton(player: ActivePlayer): framehandle {
	return createGuardButton({
		player: player,
		createContext: GetPlayerId(player.getPlayer()),
		key: OSKEY_F6,
		textures: {
			primary: 'ReplaceableTextures\\CommandButtons\\BTNHeartBottleHalfEmpty.blp',
			secondary: 'ReplaceableTextures\\CommandButtons\\BTNHeartBottle_Full.blp',
		},
		xOffset: 0.01,
		action: (context: number, textures: { primary: string; secondary: string }) => {
			player.options.health = !player.options.health;

			const buttonBackdrop = BlzGetFrameByName('GuardButtonBackdrop', context);
			const texture = player.options.health ? textures.secondary : textures.primary;

			BlzFrameSetTexture(buttonBackdrop, texture, 0, false);

			const buttonTooltip = BlzGetFrameByName('GuardButtonToolTip', context);
			BlzFrameSetText(
				buttonTooltip,
				`Guard Health Preference ${HexColors.TANGERINE}(F6)|r\nSets your preference for unit health when taking possession of a city.\nCurrent preference: ` +
					`${player.options.health ? `${HexColors.RED}Highest` : `${HexColors.GREEN}Lowest`}`
			);
		},
	});
}

export function buildGuardValueButton(player: ActivePlayer): framehandle {
	return createGuardButton({
		player: player,
		createContext: GetPlayerId(player.getPlayer()) + 100,
		key: OSKEY_F7,
		textures: {
			primary: 'ReplaceableTextures\\CommandButtons\\BTNIncome.blp',
			secondary: 'ReplaceableTextures\\CommandButtons\\BTNGoldPile.blp',
		},
		xOffset: 0.033,
		action: (context: number, textures: { primary: string; secondary: string }) => {
			player.options.value = !player.options.value;

			const buttonBackdrop = BlzGetFrameByName('GuardButtonBackdrop', context);
			const texture = player.options.value ? textures.secondary : textures.primary;

			BlzFrameSetTexture(buttonBackdrop, texture, 0, false);

			const buttonTooltip = BlzGetFrameByName('GuardButtonToolTip', context);
			BlzFrameSetText(
				buttonTooltip,
				`Guard Value Preference ${HexColors.TANGERINE}(F7)|r\nSets your preference for unit value when taking possession of a city.\nCurrent preference: ` +
					`${player.options.value ? `${HexColors.RED}Highest` : `${HexColors.GREEN}Lowest`}`
			);
		},
	});
}
