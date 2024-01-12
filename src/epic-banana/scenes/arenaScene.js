import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { Util } from "../../helpers/util";
import { GameBackground } from "../../template/objects/gameBackground";
import { Game } from "../../game";
import { Arena } from "../objects/arena/arena";
import { PlayScreen, PlayScreenEvent } from "../ui/screens/arena/playScreen";
import { ArenaSlot } from "../objects/arena/arenaSlot";
import { Entity } from "playcanvas";
import { SlotManager } from "../scripts/managers/slotManager";
import { Spawner } from "../scripts/spawners/spawner";
import { MergeManager } from "../scripts/managers/mergeManager";
import { InputHandler, InputHandlerEvent } from "../scripts/input/inputHandler";
import { BattleEvent, BattleManager } from "../scripts/managers/battleManager";
import { HealthBarScreen } from "../ui/screens/arena/healthBarScreen";
import { LevelLoader } from "../scripts/level/levelLoader";
import { CharacterFactory } from "../objects/character/characterFactory";
import { MergeEffect } from "../objects/effects/mergeEffect";
import { RangeToy2Projectile } from "../objects/projectile/rangeToy2Projectile";
import { RangeToy1Projectile } from "../objects/projectile/rangeToy1Projectile";
import { RangeToy3Projectile } from "../objects/projectile/rangeToy3Projectile";
import { RangeToy4Projectile } from "../objects/projectile/rangeToy4Projectile";
import { RangeToy5Projectile } from "../objects/projectile/rangeToy5Projectile";
import { RangeToy6Projectile } from "../objects/projectile/rangeToy6Projectile";
import { RangeToy7Projectile } from "../objects/projectile/rangeToy7Projectile";
import { RangeToy8Projectile } from "../objects/projectile/rangeToy8Projectile";
import { RangeToy9Projectile } from "../objects/projectile/rangeToy9Projectile";
import { RangeToy10Projectile } from "../objects/projectile/rangeToy10Projectile";
import { SceneManager } from "../../template/scene/sceneManager";
import { DataManager } from "../data/dataManager";
import { UserData } from "../data/userData";
import { DataLocal } from "../data/dataLocal";
import { WinArenaScreen, WinArenaScreenEvent } from "../ui/screens/arena/winArenaScreen";
import { LoseArenaScreen, LoseArenaScreenEvent } from "../ui/screens/arena/loseArenaScreen";
import { AssetLoader } from "../../assetLoader/assetLoader";
import { GameState, GameStateManager } from "../../template/gameStateManager";
import { SoundManager } from "../../template/soundManager";
import { LineManager, LineManagerEvent } from "../scripts/managers/lineManager";
import { PopupScreen } from "../ui/screens/arena/popupScreen";


export class SceneArena extends Scene {
    constructor() {
        super(GameConstant.SCENE_ARENA);
    }

    create() {
        super.create();
        this.ui.addScreens(
            new PlayScreen(),
            new HealthBarScreen(),
            new WinArenaScreen(),
            new LoseArenaScreen(),
            new PopupScreen(),
        );
        this.playScreen = this.ui.getScreen(GameConstant.SCREEN_PLAY);
        this.healthBarScreen = this.ui.getScreen(GameConstant.SCREEN_HEALTH_BAR);
        this.winScreen = this.ui.getScreen(GameConstant.SCREEN_ARENA_WIN);
        this.loseScreen = this.ui.getScreen(GameConstant.SCREEN_ARENA_LOSE);
        this._runScene = SceneManager.getScene(GameConstant.SCENE_RUN);
        this.popupScreen = this.ui.getScreen(GameConstant.POPUPSCREEN);

        this.playScreen.on(PlayScreenEvent.BtnBattleClicked, this._startBattle, this);
        this.playScreen.on(PlayScreenEvent.CardStackMeleeClicked, () => {
            if (UserData.priceMelee > UserData.currency && UserData.stackMelee <= 0) return;
            this.playerSlotManager.addCharToNullSlot(1, "melee") && this.playScreen.onClickedCardMelee();
        }, this);
        this.playScreen.on(PlayScreenEvent.CardStackRangeClicked, () => {
            if (UserData.priceRange > UserData.currency && UserData.stackRange <= 0) return;
            this.playerSlotManager.addCharToNullSlot(1, "range") && this.playScreen.onClickedCardRange();
        }, this);

        this.ui.setScreenActive(GameConstant.SCREEN_HEALTH_BAR);
        this.ui.setScreenActive(GameConstant.SCREEN_PLAY);
        this._initialize();

        this.winScreen.on(WinArenaScreenEvent.ButtonClaimClicked, () => {
            if (GameStateManager.state === GameState.Challenge) {
                DataManager.nextLevelChallenge();
                this._removeDataSlot();
                this._reLoadLevel();
                GameStateManager.state = GameState.HomeRun;
            }
            else {
                this._removeDataEnemySlot();
                this._nextLevel()
            }
        }, this);

        this.loseScreen.on(LoseArenaScreenEvent.ButtonClaimClicked, () => {
            this._removeDataSlot();
            this._reLoadLevel();
        });
    }

    showNewCharacterUI(type, level) {
        this.playScreen.showNewCharacterUI(type, level);
    }

    enablePopup(text) {
        this.ui.setScreenActive(GameConstant.POPUPSCREEN);
        this.popupScreen.enablePopup(text);
    }

    disablePopup() {
        this.popupScreen.disablePopup(() => {
            this.ui.setScreenActive(GameConstant.POPUPSCREEN, false);
        });
    }

    _removeDataSlot() {
        this.playerSlotHolder.children.forEach((slot, index) => {
            if (slot.controller.character != null) {
                slot.controller.removeCurCharacter();
            }
        });

        this._removeDataEnemySlot();
    }

    _removeDataEnemySlot() {
        this.enemySlotHolder.children.forEach((slot, index) => {
            if (slot.controller.character != null) {
                slot.controller.removeCurCharacter();
            }
        });
    }

    startChallenge() {
        this._removeDataSlot();
        var data = DataManager.getChallengeData();
        this.levelLoader.loadLevel(data.enemy, data.player);
        this.enableControl();
        this.playScreen.enabled = false;

        this.inputHandlerBattle.enabled = false;
        this.inputHandlerChallenge.enabled = true;
    }

    _initialize() {
        this._initInputHandler();
        this._initLight();
        this._initCamera();
        this._initMergeFXSpawner();
        this._initProjectileSpawner();
        this._initArena();
        this._initArenaSlot();
        this._initBattleManager();
        this._initLevelLoader();
        this._startLevel();
        this._initAudio();
    }

    _initAudio() {
        this.audioMusicEntity = new pc.Entity();
        this.addChild(this.audioMusicEntity);
        this.audioMusicEntity.addComponent("sound");
        this.musicBg = this.audioMusicEntity.sound.addSlot("sfx_BGM_home_arena", {
            asset: AssetLoader.getAssetByKey("sfx_BGM_home_arena"),
            pitch: 1,
            loop: true,
            autoPlay: false,
        });

        this.musicBattle = this.audioMusicEntity.sound.addSlot("sfx_BGM_battle", {
            asset: AssetLoader.getAssetByKey("sfx_BGM_battle"),
            pitch: 1,
            loop: true,
            autoPlay: false,
        });

        this.disableMusic();
    }

    disableMusic() {
        this.audioMusicEntity.enabled = false;
    }

    enableMusic() {
        this.audioMusicEntity.enabled = true;
        GameStateManager.state == GameState.HomeArena && this.musicBg.play();
        if (GameStateManager.state == GameState.PlayingArena || GameStateManager.state == GameState.Challenge) {
            this.musicBattle.play();
        }
    }

    pauseMucic() {
        GameState.HomeArena && this.musicBg.pause();
        this.musicBattle.pause();

    }

    resumeMusic() {
        GameStateManager.state == GameState.HomeArena && this.musicBg.resume();
        if (GameStateManager.state == GameState.PlayingArena || GameStateManager.state == GameState.Challenge) {
            this.musicBattle.resume();
        }
    }

    stopAllMusic() {
        this.musicBg.stop();
        this.musicBattle.stop();
    }

    _initInputHandler() {
        let inputHandlerEntity = new Entity("input");
        this.inputHandlerBattle = inputHandlerEntity.addScript(InputHandler);
        this.addChild(inputHandlerEntity);

        let inputHandlerChallengeEntity = new Entity("inputChallenge");
        this.inputHandlerChallenge = inputHandlerChallengeEntity.addScript(InputHandler);
        this.addChild(inputHandlerChallengeEntity);
    }

    _initMergeFXSpawner() {
        let mergeEffectSpawnerEntity = new Entity();
        this.addChild(mergeEffectSpawnerEntity);
        this.mergeEffectSpawner = mergeEffectSpawnerEntity.addScript(Spawner, {
            class: MergeEffect,
            poolSize: 1,
        });
    }

    _initArena() {
        CharacterFactory.initSpawner(this);
        this.arena = new Arena();
        this.addChild(this.arena);

        this.mergeManager = this.arena.addScript(MergeManager, {
            cameraEntity: this.mainCamera,
            mergeEffectSpawner: this.mergeEffectSpawner,
        });
        this.inputHandlerBattle.on(InputHandlerEvent.PointerDown, this.mergeManager.onPointerDown, this.mergeManager);
        this.inputHandlerBattle.on(InputHandlerEvent.PointerMove, this.mergeManager.onPointerMove, this.mergeManager);
        this.inputHandlerBattle.on(InputHandlerEvent.PointerUp, this.mergeManager.onPointerUp, this.mergeManager);

        this.lineManager = this.arena.addScript(LineManager, {
            cameraEntity: this.mainCamera,
        });
        this.inputHandlerChallenge.on(InputHandlerEvent.PointerDown, this.lineManager.onPointerDown, this.lineManager);
        this.inputHandlerChallenge.on(InputHandlerEvent.PointerMove, this.lineManager.onPointerMove, this.lineManager);
        this.inputHandlerChallenge.on(InputHandlerEvent.PointerUp, this.lineManager.onPointerUp, this.lineManager);
        this.lineManager.on(LineManagerEvent.OnMerge, () => {
            this._startBattle();
            this.inputHandlerChallenge.enabled = false;
        }, this);

        this.inputHandlerChallenge.enabled = false;
    }

    _initArenaSlot() {
        this.playerSlotHolder = new Entity();
        this.addChild(this.playerSlotHolder);
        let offsetX = GameConstant.ARENA_OFFSET_X;
        let offsetY = -15;
        let rangeX = GameConstant.ARENA_GRID_RANGE_X;
        let rangeY = GameConstant.ARENA_GRID_RANGE_Y;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                let slot = new ArenaSlot();
                slot.setLocalPosition(j * rangeX + offsetX, 0.1, i * rangeY + offsetY);
                this.playerSlotHolder.addChild(slot);
            }
        }
        this.mergeManager.slots = this.playerSlotHolder.children;
        this.lineManager.slots = this.playerSlotHolder.children;
        this.playerSlotManager = this.playerSlotHolder.addScript(SlotManager, {
            isPlayerTeam: true,
        });

        this.enemySlotHolder = new Entity();
        this.addChild(this.enemySlotHolder);
        offsetY = 7;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                let slot = new ArenaSlot();
                slot.setLocalPosition(j * rangeX + offsetX, 0.1, i * rangeY + offsetY);
                this.enemySlotHolder.addChild(slot);
            }
        }
        this.enemySlotManager = this.enemySlotHolder.addScript(SlotManager, {
            isPlayerTeam: false,
        });
    }

    _initLevelLoader() {
        let levelLoaderEntity = new Entity();
        this.levelLoader = levelLoaderEntity.addScript(LevelLoader, {
            playerSlotManager: this.playerSlotManager,
            enemySlotManager: this.enemySlotManager,
        });
    }

    _initProjectileSpawner() {
        let RangeToy1ProjectileSpawnerEntity = new Entity();
        this.addChild(RangeToy1ProjectileSpawnerEntity);
        this.RangeToy1ProjectileSpawner = RangeToy1ProjectileSpawnerEntity.addScript(Spawner, {
            class: RangeToy1Projectile,
            poolSize: 5,
        });

        let RangeToy2ProjectileSpawnerEntity = new Entity();
        this.addChild(RangeToy2ProjectileSpawnerEntity);
        this.RangeToy2ProjectileSpawner = RangeToy2ProjectileSpawnerEntity.addScript(Spawner, {
            class: RangeToy2Projectile,
            poolSize: 5,
        });

        let RangeToy3ProjectileSpawnerEntity = new Entity();
        this.addChild(RangeToy3ProjectileSpawnerEntity);
        this.RangeToy3ProjectileSpawner = RangeToy3ProjectileSpawnerEntity.addScript(Spawner, {
            class: RangeToy3Projectile,
            poolSize: 5,
        });

        let RangeToy4ProjectileSpawnerEntity = new Entity();
        this.addChild(RangeToy4ProjectileSpawnerEntity);
        this.RangeToy4ProjectileSpawner = RangeToy4ProjectileSpawnerEntity.addScript(Spawner, {
            class: RangeToy4Projectile,
            poolSize: 5,
        });

        let RangeToy5ProjectileSpawnerEntity = new Entity();
        this.addChild(RangeToy5ProjectileSpawnerEntity);
        this.RangeToy5ProjectileSpawner = RangeToy5ProjectileSpawnerEntity.addScript(Spawner, {
            class: RangeToy5Projectile,
            poolSize: 5,
        });

        let RangeToy6ProjectileSpawnerEntity = new Entity();
        this.addChild(RangeToy6ProjectileSpawnerEntity);
        this.RangeToy6ProjectileSpawner = RangeToy6ProjectileSpawnerEntity.addScript(Spawner, {
            class: RangeToy6Projectile,
            poolSize: 5,
        });

        let RangeToy7ProjectileSpawnerEntity = new Entity();
        this.addChild(RangeToy7ProjectileSpawnerEntity);
        this.RangeToy7ProjectileSpawner = RangeToy7ProjectileSpawnerEntity.addScript(Spawner, {
            class: RangeToy7Projectile,
            poolSize: 5,
        });

        let RangeToy8ProjectileSpawnerEntity = new Entity();
        this.addChild(RangeToy8ProjectileSpawnerEntity);
        this.RangeToy8ProjectileSpawner = RangeToy8ProjectileSpawnerEntity.addScript(Spawner, {
            class: RangeToy8Projectile,
            poolSize: 5,
        });

        let RangeToy9ProjectileSpawnerEntity = new Entity();
        this.addChild(RangeToy9ProjectileSpawnerEntity);
        this.RangeToy9ProjectileSpawner = RangeToy9ProjectileSpawnerEntity.addScript(Spawner, {
            class: RangeToy9Projectile,
            poolSize: 5,
        });

        let RangeToy10ProjectileSpawnerEntity = new Entity();
        this.addChild(RangeToy10ProjectileSpawnerEntity);
        this.RangeToy10ProjectileSpawner = RangeToy10ProjectileSpawnerEntity.addScript(Spawner, {
            class: RangeToy10Projectile,
            poolSize: 5,
        });

        this.projectileSpawnerMap = new Map();
        this.projectileSpawnerMap.set("range1", this.RangeToy1ProjectileSpawner);
        this.projectileSpawnerMap.set("range2", this.RangeToy2ProjectileSpawner);
        this.projectileSpawnerMap.set("range3", this.RangeToy3ProjectileSpawner);
        this.projectileSpawnerMap.set("range4", this.RangeToy4ProjectileSpawner);
        this.projectileSpawnerMap.set("range5", this.RangeToy5ProjectileSpawner);
        this.projectileSpawnerMap.set("range6", this.RangeToy6ProjectileSpawner);
        this.projectileSpawnerMap.set("range7", this.RangeToy7ProjectileSpawner);
        this.projectileSpawnerMap.set("range8", this.RangeToy8ProjectileSpawner);
        this.projectileSpawnerMap.set("range9", this.RangeToy9ProjectileSpawner);
        this.projectileSpawnerMap.set("range10", this.RangeToy10ProjectileSpawner);
    }

    _initBattleManager() {
        let battleManagerEntity = new Entity();
        this.addChild(battleManagerEntity);

        this.battleManager = battleManagerEntity.addScript(BattleManager, {
            projectileSpawnerMap: this.projectileSpawnerMap,
            healthBarScreen: this.healthBarScreen,
            camera: this.mainCamera,
        });
    }

    pause() {
        super.pause();
        this.battleManager.pause();
    }

    resume() {
        super.resume();
        this.battleManager.resume();
    }

    _startBattle() {
        if (GameStateManager.state !== GameState.Challenge) {
            GameStateManager.state = GameState.PlayingArena;
        }
        this.playerSlotManager.disableGrid();
        this.mergeManager.onStartBattle();
        this.battleManager.startBattle(this.playerSlotHolder.children, this.enemySlotHolder.children);
        this.stopAllMusic();
        this.audioMusicEntity.enabled && this.musicBattle.play();

        this.inputHandlerBattle.enabled = false;
    }

    _startLevel() {
        this.levelLoader.loadLevel(DataManager.getLevelData().arena.enemyTeam);
        var coin = GameConstant.MIN_COIN_LEVEL + GameConstant.RISE_COIN * UserData.currentLevel;
        if (GameStateManager.state == GameState.Challenge) {
            coin *= GameConstant.RISE_COIN_CHALLENGE;
        }

        this.battleManager.once(BattleEvent.Win, (data) => {
            if (GameStateManager.state === GameState.PlayingArena) {
                GameStateManager.state = GameState.Win;
                UserData.chars = data;
                DataLocal.updateDataListByKey(GameConstant.INDEXEDDB_CHARS_KEY, UserData.chars)
                DataManager.nextLevel();
                this._updateDataLocal();
                this.ui.disableAllScreens();
                this.ui.setScreenActive(GameConstant.SCREEN_ARENA_WIN);
                this.winScreen.updateNumberCoin(coin)
                this.winScreen.reloadData();

                this.stopAllMusic();
                SoundManager.play("sfx_game_win");
            }
            if (GameStateManager.state === GameState.Challenge) {
                this._reloadDataLocal();
                this.ui.disableAllScreens();
                this.ui.setScreenActive(GameConstant.SCREEN_ARENA_WIN);
                this.winScreen.updateNumberCoin(coin)
                this.winScreen.reloadData();

                this.stopAllMusic();
                SoundManager.play("sfx_game_win");
            }
        });

        this.battleManager.once(BattleEvent.Lose, () => {
            if (GameStateManager.state === GameState.PlayingArena) {
                GameStateManager.state = GameState.Lose;
                this._reloadDataLocal();
                this.ui.disableAllScreens();
                this.ui.setScreenActive(GameConstant.SCREEN_ARENA_LOSE);
                this.winScreen.updateNumberCoin(coin * 0.5)
                this.loseScreen.reloadData();

                this.stopAllMusic();
                SoundManager.play("sfx_game_lose");
            }

            if (GameStateManager.state === GameState.Challenge) {
                this.ui.disableAllScreens();
                this.ui.setScreenActive(GameConstant.SCREEN_ARENA_LOSE);
                this.winScreen.updateNumberCoin(coin * 0.5)
                this.loseScreen.reloadData();

                this.stopAllMusic();
                SoundManager.play("sfx_game_lose");
            }
        });
    }

    _updateDataLocal() {
        DataLocal.updateDataByKey(GameConstant.INDEXEDDB_CURRENCY_KEY, UserData.currency);
        DataLocal.updateDataByKey(GameConstant.INDEXEDDB_PRICE_MELEE_KEY, UserData.priceMelee);
        DataLocal.updateDataByKey(GameConstant.INDEXEDDB_STACK_MELEE_KEY, UserData.stackMelee);
        DataLocal.updateDataByKey(GameConstant.INDEXEDDB_STACK_RANGE_KEY, UserData.stackRange);
        DataLocal.updateDataByKey(GameConstant.INDEXEDDB_PRICE_RANGE_KEY, UserData.priceRange);
        DataLocal.updateDataByKey(GameConstant.INDEXEDDB_KEYS, UserData.keys);
    }


    _reloadDataLocal() {
        DataLocal.getCurrency()
        UserData.currency = DataLocal.currency;
        DataLocal.getLevelMeleeUnlock()
        UserData.levelMeleeUnlock = DataLocal.levelMeleeUnlock;
        DataLocal.getLevelRangeUnlock()
        UserData.levelRangeUnlock = DataLocal.levelRangeUnlock;
        DataLocal.getChars()
        UserData.chars = DataLocal.chars;
        DataLocal.getPriceMelee()
        UserData.priceMelee = DataLocal.priceMelee;
        DataLocal.getPriceRange()
        UserData.priceRange = DataLocal.priceRange;
        DataLocal.getStackMelee()
        UserData.stackMelee = DataLocal.stackMelee;
        DataLocal.getStackRange()
        UserData.stackRange = DataLocal.stackRange;
        DataLocal.getKeys()
        UserData.keys = DataLocal.keys;
    }

    _nextLevel() {
        SoundManager.muteAll();
        this.disableControl();
        Game.replay();
        this.scree
        this.playerSlotManager.enableGrid();
        this._startLevel();
        this._runScene.rePlayScene();
    }

    _reLoadLevel() {
        SoundManager.muteAll();
        this.disableControl();
        Game.replay();
        this.playerSlotManager.enableGrid();
        this._startLevel();
        this._runScene.rePlayScene();
    }

    disableControl() {
        this.mainCamera.enabled = false;
        this.inputHandlerBattle.enabled = false;
        this.playScreen.btnBattle.enabled = false;
        this.ui.disableAllScreens();

        this.stopAllMusic();
    }

    enableControl() {
        this.mainCamera.enabled = true;
        this.inputHandlerBattle.enabled = true;

        this.playScreen.enableElement();

        this.ui.setScreenActive(GameConstant.SCREEN_PLAY);
        this.ui.setScreenActive(GameConstant.SCREEN_HEALTH_BAR);

        this.stopAllMusic();
        this.audioMusicEntity.enabled && this.musicBg.play();
    }

    _initLight() {
        this.directionalLight = new pc.Entity("light-directional");
        this.addChild(this.directionalLight);

        this.directionalLight.addComponent("light", {
            type: pc.LIGHTTYPE_DIRECTIONAL,
            color: new pc.Color(1, 1, 1),
            castShadows: false,
            shadowDistance: 50,
            shadowResolution: 512,
            shadowBias: 0.2,
            normalOffsetBias: 0.05,
            intensity: 1,
        });
        this.directionalLight.setLocalPosition(2, 30, -2);
        this.directionalLight.setLocalEulerAngles(45, 135, 0);
    }

    _initCamera() {
        this.mainCamera = new pc.Entity();
        this.addChild(this.mainCamera);
        this.mainCamera.addComponent("camera", {
            clearColor: Util.createColor(0, 0, 0),
            farClip: 1000,
            fov: 60,
            nearClip: 0.1,
            type: pc.PROJECTION_PERSPECTIVE,
            frustumCulling: false,
        });
        var pos = DataManager.getDataReposive().cameraArena.pos
        var rot = DataManager.getDataReposive().cameraArena.rot
        this.mainCamera.setLocalPosition(pos[0], pos[1], pos[2]);
        this.mainCamera.setLocalEulerAngles(rot[0], rot[1], rot[2]);
        if (!GameConstant.DEBUG_CAMERA) {
            return;
        }
        this.mainCamera.addComponent("script");
        this.mainCamera.script.create("orbitCamera", {
            attributes: {
                inertiaFactor: 0.3, // Override default of 0 (no inertia)
            },
        });

        this.mainCamera.script.create("orbitCameraInputMouse");
        this.mainCamera.script.create("orbitCameraInputTouch");

    }

    resize() {
        super.resize();
        var pos = DataManager.getDataReposive().cameraArena.pos
        var rot = DataManager.getDataReposive().cameraArena.rot
        this.mainCamera.setLocalPosition(pos[0], pos[1], pos[2]);
        this.mainCamera.setLocalEulerAngles(rot[0], rot[1], rot[2]);
    }

}