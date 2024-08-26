import { W3TS_HOOK, addScriptHook } from 'w3ts/hooks';
import { MAP_NAME } from './app/utils/map-info';
import { ConcreteCityBuilder } from './app/city/concrete-city-builder';
import { ConcreteCountryBuilder } from './app/country/concrete-country-builder';
import { CountrySettings } from './app/country/countries';
import { ConcreteSpawnerBuilder } from './app/spawner/concrete-spawn-builder';
import { SetCountries } from './configs/city-country-setup';
import { NameManager } from './app/managers/names/name-manager';
import { ChatManager } from './app/managers/chat-manager';
import { SetConsoleUI } from './app/ui/console';
import { Quests } from './app/quests/quests';
import { SetRegions } from './configs/region-setup';
import { StringToCountry } from './app/country/country-map';
import { EventTimer } from './app/timer/EventTimer';
import { GameManager } from './app/game/game-manager';
import { CameraManager } from './app/managers/camera-manager';
import { ConcreteRegionBuilder } from './app/region/concrete-region-builder';
import { RegionSettings } from './app/region/regions';

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

		//Create Quests
		Quests.Create();

		//Set up actions on game load
		const onLoadTimer: timer = CreateTimer();

		TimerStart(onLoadTimer, 0.0, false, () => {
			PauseTimer(onLoadTimer);
			DestroyTimer(onLoadTimer);
			FogEnable(false);
			FogMaskEnable(false);
			SetConsoleUI();
			CameraManager.getInstance();
			ChatManager.getInstance();
			EventTimer.getInstance();
			GameManager.getInstance().start();
		});
	} catch (e) {
		print(e);
	}
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, tsMain);
addScriptHook(W3TS_HOOK.CONFIG_AFTER, () => {
	SetMapName(MAP_NAME);
});
