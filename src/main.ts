import { W3TS_HOOK, addScriptHook } from 'w3ts/hooks';
import { MAP_NAME } from './app/utils/map-info';
import { ConcreteCityBuilder } from './app/city/concrete-city-builder';
import { ConcreteCountryBuilder } from './app/country/concrete-country-builder';
import { CountrySettings } from './app/country/countries';
import { ConcreteSpawnerBuilder } from './app/spawner/concrete-spawn-builder';
import { SetCountries } from './configs/city-country-setup';
import { NameManager } from './app/managers/names/name-manager';
import CameraManager from './app/managers/camera-manager';
import { ChatManager } from './app/managers/chat-manager';
import { TransportManager } from './app/managers/transport-manager';
import { SetConsoleUI } from './app/ui/console';
import { GameManager } from './app/game/game-manager';
import { onOwnerChange } from './app/triggers/ownership-change-event';
import { antiSpam } from './app/triggers/anti-spam';
import { onEnter } from './app/triggers/on-enter-event';
import { onLeave } from './app/triggers/on-leave-event';
import { onSpellEffect } from './app/triggers/on-spell-effect-event';
import { onPlayerLeave } from './app/triggers/player-leave-event';
import { onDeath } from './app/triggers/unit-killed-event';
import { unitTrained } from './app/triggers/unit-trained-event';
import { keyEvents } from './app/triggers/key-events';

//const BUILD_DATE = compiletime(() => new Date().toUTCString());

function tsMain() {
	try {
		//DoNotSaveReplay();

		if (!BlzLoadTOCFile('war3mapimported\\Risk.toc')) {
			print('Failed to load TOC file!');
			return;
		}

		if (!BlzChangeMinimapTerrainTex('minimap.blp')) {
			print('Failed to load minimap file!');
			return;
		}

		SetGameSpeed(MAP_SPEED_FASTEST);
		SetMapFlag(MAP_LOCK_SPEED, true);
		SetMapFlag(MAP_USE_HANDICAPS, false);
		SetMapFlag(MAP_LOCK_ALLIANCE_CHANGES, false);
		SetTimeOfDay(12.0);
		SetTimeOfDayScale(0.0);
		SetAllyColorFilterState(0);

		//Handle names to prevent namebug
		NameManager.getInstance();

		//Set up countries
		SetCountries();
		//Build countries, spawners, and cities
		const countryBuilder = new ConcreteCountryBuilder();
		const cityBuilder = new ConcreteCityBuilder();
		const spawnerBuilder = new ConcreteSpawnerBuilder();

		for (const country of CountrySettings) {
			countryBuilder.setName(country.name);
			country.cities.forEach((city) => {
				countryBuilder.addCity(city, cityBuilder, country.guardType);
			});

			countryBuilder.setSpawn(country.spawnerData, spawnerBuilder);
			countryBuilder.build();
		}

		//Set up triggers
		onEnter();
		onLeave();
		onDeath();
		unitTrained();
		onOwnerChange();
		onPlayerLeave();
		onSpellEffect();
		antiSpam();
		keyEvents();

		//Set up actions on game load
		const onLoadTimer: timer = CreateTimer();

		TimerStart(onLoadTimer, 0.0, false, () => {
			FogEnable(false);
			FogMaskEnable(false);
			SetConsoleUI();
			CameraManager.getInstance();
			ChatManager.getInstance();
			TransportManager.getInstance();
			GameManager.getInstance();
			ChatManager.getInstance().addCmd(['-cam', '-zoom'], () => CameraManager.getInstance().update(GetTriggerPlayer()));

			PauseTimer(onLoadTimer);
			DestroyTimer(onLoadTimer);
		});
	} catch (e) {
		print(e);
	}
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);
addScriptHook(W3TS_HOOK.CONFIG_AFTER, () => {
	SetMapName(MAP_NAME);
});
//Force push test
