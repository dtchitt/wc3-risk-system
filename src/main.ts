import { W3TS_HOOK, addScriptHook } from 'w3ts/hooks';
import { MAP_NAME } from './app/utils/map-info';
import { ConcreteCityBuilder } from './app/city/concrete-city-builder';
import { ConcreteCountryBuilder } from './app/country/concrete-country-builder';
import { CountrySettings } from './app/country/countries';
import { ConcreteSpawnerBuilder } from './app/spawner/concrete-spawn-builder';
import { SetCountries } from './configs/city-country-setup';
import { NameManager } from './app/managers/names/name-manager';
import { ChatManager } from './app/managers/chat-manager';
import { TransportManager } from './app/managers/transport-manager';
import { SetConsoleUI } from './app/ui/console';
import { GameManager } from './app/game/game-manager';
import { OwnershipChangeEvent } from './app/triggers/ownership-change-event';
import { EnterRegionEvent } from './app/triggers/enter-region-event';
import { LeaveRegionEvent } from './app/triggers/leave-region-event';
import { SpellEffectEvent } from './app/triggers/spell-effect-event';
import { PlayerLeaveEvent } from './app/triggers/player-leave-event';
import { UnitDeathEvent } from './app/triggers/unit_death/unit-death-event';
import { UnitTrainedEvent } from './app/triggers/unit-trained-event';
import { KeyEvents } from './app/triggers/key-events';
import { AntiCheat } from './app/libs/anti-cheat';
import { Quests } from './app/quests/quests';
import CameraManager from './app/managers/camera-manager';
import { TimedEventManager } from './app/libs/timer/timed-event-manager';
import { AntiSpam } from './app/triggers/anti-spam';
import { SetRegions } from './configs/region-setup';
import { ConcreteRegionBuilder } from './app/region/concrete-region-builder';
import { RegionSettings } from './app/region/regions';
import { StringToCountry } from './app/country/country-map';
import { SetCommands } from './app/commands/commands';

//const BUILD_DATE = compiletime(() => new Date().toUTCString());

function tsMain() {
	try {
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
		SetRegions();
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
		//Build regions
		const regionBuilder = new ConcreteRegionBuilder();

		for (const region of RegionSettings) {
			region.countryNames.forEach((countryName) => {
				const country = StringToCountry.get(countryName);
				regionBuilder.addCountry(country);
			});

			regionBuilder.setGoldBonus(region.goldBonus);
			regionBuilder.build();
		}

		//Set up triggers
		EnterRegionEvent();
		LeaveRegionEvent();
		UnitDeathEvent();
		UnitTrainedEvent();
		//UnitUpgradeEvent();
		OwnershipChangeEvent();
		PlayerLeaveEvent();
		SpellEffectEvent();
		AntiSpam();
		KeyEvents();

		//Create Quests
		Quests.Create();

		//Set up actions on game load
		const onLoadTimer: timer = CreateTimer();

		TimerStart(onLoadTimer, 0.0, false, () => {
			FogEnable(false);
			FogMaskEnable(false);
			SetConsoleUI();

			AntiCheat.checkMultiAccounts(() => {
				PauseTimer(onLoadTimer);
				DestroyTimer(onLoadTimer);
				CameraManager.getInstance();
				ChatManager.getInstance();
				TransportManager.getInstance();
				TimedEventManager.getInstance();
				SetCommands(GameManager.getInstance());
			});
		});
	} catch (e) {
		print(e);
	}
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);
addScriptHook(W3TS_HOOK.CONFIG_AFTER, () => {
	SetMapName(MAP_NAME);
});
