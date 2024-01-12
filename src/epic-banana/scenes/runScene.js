import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import * as pc from "playcanvas";
import { Util } from "../../helpers/util";
import { GameBackground } from "../../template/objects/gameBackground";
import { Game } from "../../game";
import { Level } from "../objects/level/level";
import { DataManager } from "../data/dataManager";
import { InputHandler, InputHandlerEvent } from "../scripts/input/inputHandler";
import { SwipeMovement } from "../scripts/input/swipeMovement";
import { CameraController } from "../scripts/controllers/cameraController";
import { Player } from "../objects/player/player";
import { PlayerRunEvent } from "../scripts/controllers/playerRunSoliderController";
import { Tween } from "../../template/systems/tween/tween";
import { GameState, GameStateManager } from "../../template/gameStateManager";
import { SceneManager } from "../../template/scene/sceneManager";
import { SpawningEvent } from "../scripts/spawners/spawningEvent";
import { PlayRunScreen } from "../ui/screens/run/playRunScreen";
import { LoseScreen, LoseScreenEvent } from "../ui/screens/run/loseScreen";
import { HomeRunScreen, HomeRunScreenEvent } from "../ui/screens/run/homeRunScreen";
import { AssetLoader } from "../../assetLoader/assetLoader";
import { SoundManager } from "../../template/soundManager";
import { PopupScreen } from "../ui/screens/arena/popupScreen";
import { AdVideoConfig, AdVideoType } from "../../../ads/adsConstant";
import { AdsManager } from "../../../ads/adsManager";
import { NumberCharacterBar } from "../objects/numberCharacterBar/numberCharacterBar";
import { FollowWorldTarget } from "../scripts/controllers/followWorldTarget";
import { DataLocal } from "../data/dataLocal";
import { UserData } from "../data/userData";

export const RunSceneEvent = Object.freeze({
  LevelLoaded: "level-loaded",
  GameOver: "game-over",
  GameWin: "game-win",
  GameStart: "game-start",
  GameArena: "game-arena",
  GameWait: "game-wait",
});


export class RunScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_RUN);
  }

  create() {
    super.create();
    this.ui.addScreens(
      new PlayRunScreen(),
      new LoseScreen(),
      new HomeRunScreen(),
      new PopupScreen(),
    );

    this.homeScreen = this.ui.getScreen(GameConstant.SCREEN_HOME_RUN);
    this.loseScreen = this.ui.getScreen(GameConstant.SCREEN_LOSE)
    this.playScreen = this.ui.getScreen(GameConstant.SCREEN_RUN_PLAY);
    this.popupScreen = this.ui.getScreen(GameConstant.POPUPSCREEN);
    this.ui.disableAllScreens();
    this.ui.setScreenActive(GameConstant.SCREEN_HOME_RUN);
    this._sceneArena = SceneManager.getScene(GameConstant.SCENE_ARENA);
    this._initialize();
    this.homeScreen.challenge.on(HomeRunScreenEvent.OnStartChallenge, this._goToChallenge, this);

    this.homeScreen.checkLuckybox();

  }

  _initialize() {
    this._initInputHandler();
    this._initLight();
    this._initBg();
    this._initLevel();
    this._initCamera();
    this._initAudio();
    this._initEvent();

    GameStateManager.state = GameState.HomeRun;

  }

  _initEvent() {
    this.loseScreen.on(LoseScreenEvent.ButtonTryAgainClicked, this.rePlayScene, this)

    this.homeScreen.on(HomeRunScreenEvent.OnTapBackground, this.startRun, this)
    this.homeScreen.on(HomeRunScreenEvent.OnTapButtonMoreFun, () => {
      this.ui.disableAllScreens();
      this.ui.setScreenActive(GameConstant.SCREEN_MORE_FUN);
    }, this);

  }

  _initAudio() {
    this.audioMusicEntity = new pc.Entity();
    this.addChild(this.audioMusicEntity);
    this.audioMusicEntity.addComponent("sound");

    this.musicBgMenu = this.audioMusicEntity.sound.addSlot("sfx_BGM_home_run", {
      asset: AssetLoader.getAssetByKey("sfx_BGM_home_run"),
      pitch: 1,
      loop: true,
      autoPlay: false,
      volume: 0.3,
    });
    this.musicBgMenu.play();

    this.musicRun = this.audioMusicEntity.sound.addSlot("sfx_BGM_run", {
      asset: AssetLoader.getAssetByKey("sfx_BGM_run"),
      pitch: 1,
      loop: true,
      autoPlay: false,
      volume: 0.3,
    });
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

  disableMusic() {
    this.audioMusicEntity.enabled = false;
  }

  enableMusic() {
    this.audioMusicEntity.enabled = true;
    GameStateManager.state == GameState.HomeRun && this.musicBgMenu.play();
    GameStateManager.state == GameState.PlayingRun && this.musicRun.play();
  }

  pauseMucic() {
    GameState.HomeRun && this.musicBgMenu.pause();
    GameState.PlayingRun && this.musicRun.pause();
  }

  resumeMusic() {
    GameStateManager.state == GameState.HomeRun && this.musicBgMenu.resume();
    GameStateManager.state == GameState.PlayingRun && this.musicRun.resume();
  }

  stopAllMusic() {
    this.musicBgMenu.stop();
    this.musicRun.stop();
  }

  _initInputHandler() {
    let inputHandlerEntity = new pc.Entity("input");
    this.inputHandler = inputHandlerEntity.addScript(InputHandler);
    this.addChild(inputHandlerEntity);
  }

  _initLevel() {
    let levelData = DataManager.getLevelData();
    this.level = new Level();
    this.addChild(this.level);
    this.level.generate(levelData.levelData);
    this.configArena(levelData.arena);
    this._initPlayer();
  }

  startRun() {
    GameStateManager.state = GameState.PlayingRun
    this.ui.disableAllScreens()
    this.ui.setScreenActive(GameConstant.SCREEN_RUN_PLAY);
    this.player.actionRun()
    this.player.move.enable()
    this.player.swipeMovementTest.enable()

    this.stopAllMusic()
    this.audioMusicEntity.enabled && this.musicRun.play()

  }

  configArena(arenaData) {
    this._sceneArena.setLocalPosition(arenaData.pos.x, arenaData.pos.y, arenaData.pos.z);
    this._sceneArena.setLocalScale(arenaData.scale.x, arenaData.scale.y, arenaData.scale.z);
  }

  _initPlayer() {
    this.player = new Player();
    let playerPos = DataManager.getLevelData().playerPos;
    this.player.setPosition(playerPos.x, GameConstant.PLAYER_POS_Y, playerPos.z);
    this.player.initialize();
    this.addChild(this.player);
    this.player.actionStand();

    this.player.swipeMovementTest = this.player.addScript(SwipeMovement, {
      screenEntity: this.playScreen,
      multiplier: GameConstant.SWIPE_MULTIPLIER,
      speed: GameConstant.PLAYER_SPEED,
      rangeLeft: 0,
      rangeRight: 0,
    });
    this.player.swipeMovementTest.disable();

    this.inputHandler.on(InputHandlerEvent.PointerDown, this.player.swipeMovementTest.onPointerDown, this.player.swipeMovementTest);
    this.inputHandler.on(InputHandlerEvent.PointerMove, this.player.swipeMovementTest.onPointerMove, this.player.swipeMovementTest);
    this.inputHandler.on(InputHandlerEvent.PointerUp, this.player.swipeMovementTest.onPointerUp, this.player.swipeMovementTest);

    this.player.on(PlayerRunEvent.Lose, this._onLose, this);
    this.player.on(PlayerRunEvent.Victory, this._onWin, this);

    this.player.on(PlayerRunEvent.ChangeSolider, () => {
      this.player.swipeMovementTest.setPadding(this.player.elements)
      this.player.numberCharacterBar.setText(this.player.elements.length)
      this.player.scriptNumberCharBar.target = this.player.elements[0]
    }, this);

  }

  pause() {
    super.pause();
    this.player.move.disable();
    this.player.swipeMovementTest.disable();
  }

  resume() {
    super.resume();
    if (GameStateManager.state == GameState.PlayingRun) {
      this.player.move.enable();
      this.player.swipeMovementTest.enable();
    }
  }

  rePlayScene() {
    GameStateManager.state = GameState.HomeRun;
    this.player.move.disable();
    this.enabledControl();
    this.level.reset();
    var levelData = DataManager.getLevelData();
    this.level.generate(levelData.levelData);
    this.configArena(levelData.arena);
    this.reInitPlayer(levelData.playerPos);
    this._resetCamera();
    this.ui.disableAllScreens()
    this.ui.setScreenActive(GameConstant.SCREEN_HOME_RUN)

    this.stopAllMusic()
    this.audioMusicEntity.enabled && this.musicBgMenu.play()

    this.homeScreen.updateCurrentLevel();

    this.homeScreen.checkLuckybox();

    this.player.scriptNumberCharBar.target = this.player.elements[0]
    this.player.numberCharacterBar.setText(this.player.elements.length)

    this.homeScreen.enableRun = false;
    let adConfig = new AdVideoConfig();
    adConfig.onFinished = () => {
      this.homeScreen.enableRun = true;
    }
    adConfig.onError = () => {
      this.homeScreen.enableRun = true;
    }

    AdsManager.showVideo(AdVideoType.INTERSTITIAL, adConfig);
  }

  reInitPlayer(data) {
    this.player.setPosition(data.x, GameConstant.PLAYER_POS_Y, data.z);
    this.player.initialize();
  }

  disableControl() {
    this.player.move.disable();
    this.cameraController.disable();
    this.mainCamera.enabled = false;
    this.inputHandler.enabled = false;
    this.ui.disableAllScreens();
  }

  enabledControl() {
    this.cameraController.enable();
    this.mainCamera.enabled = true;
    this.inputHandler.enabled = true;
    this.ui.setScreenActive(GameConstant.SCREEN_RUN_PLAY);
  }

  _goToChallenge() {
    this.disableControl();
    this._sceneArena.enableControl();
    this._sceneArena.startChallenge();
  }

  _resetCamera() {
    this.mainCamera.setLocalPosition(
      DataManager.getDataReposive().cameraRun.pos[0],
      DataManager.getDataReposive().cameraRun.pos[1],
      DataManager.getDataReposive().cameraRun.pos[2]
    );
    this.mainCamera.setLocalEulerAngles(
      DataManager.getDataReposive().cameraRun.rot[0],
      DataManager.getDataReposive().cameraRun.rot[1],
      DataManager.getDataReposive().cameraRun.rot[2]
    );
    this.cameraController.offset = this.mainCamera.getPosition().clone();
    this.mainCamera.enabled = true;
  }

  _onLose() {
    if (GameStateManager.state == GameState.Lose) {
      return;
    }
    this.player.move.disable();
    this.player.swipeMovementTest.disable();
    this.ui.disableAllScreens();
    GameStateManager.state == GameState.PlayingRun && this.ui.setScreenActive(GameConstant.SCREEN_LOSE);
    GameStateManager.state = GameState.Lose;

    DataLocal.getKeys()
    UserData.keys = DataLocal.keys;

    SoundManager.play("sfx_game_lose")
  }

  _onWin() {
    if (GameStateManager.state == GameState.Win) {
      return;
    }
    this.player.actionVictoty();
    this.stopAllMusic();
    SoundManager.play("sfx_game_win")
    GameStateManager.state = GameState.Win;
    this.player.swipeMovementTest.disable();
    Tween.createCountTween({
      duration: 2,
      onComplete: () => {
        this.mainCamera.enabled = false;
        this.ui.disableAllScreens();

        this._sceneArena.playerSlotManager.addChars(this.player.elements.length)
        this.player.elements.forEach(element => {
          element.fire(SpawningEvent.Despawn);
        });
        this.player.elements = [];

        GameStateManager.state = GameState.HomeArena;
        this.disableControl();
        this._sceneArena.enableControl();

        SoundManager.stop("sfx_game_win")
        SoundManager.play("sfx_ready")
      }
    }).start();
  }

  _initLight() {
    this.directionalLight = new pc.Entity("light-directional");
    this.addChild(this.directionalLight);

    this.directionalLight.addComponent("light", {
      type: pc.LIGHTTYPE_DIRECTIONAL,
      color: new pc.Color(1, 1, 1),
      castShadows: true,
      shadowDistance: 50,
      shadowResolution: 512,
      shadowBias: 0.2,
      normalOffsetBias: 0.05,
      intensity: 1,
    });
    this.directionalLight.setLocalPosition(-19, 15, -4);
    this.directionalLight.setLocalEulerAngles(-42, 42, 0);
  }

  _initCamera() {
    this.mainCamera = new pc.Entity();
    this.addChild(this.mainCamera);
    this.mainCamera.addComponent("camera", {
      clearColor: Util.createColor(0, 0, 0),
      farClip: 2000,
      fov: 60,
      nearClip: 0.1,
      type: pc.PROJECTION_PERSPECTIVE,
      frustumCulling: false,
    });
    this.mainCamera.setLocalPosition(
      DataManager.getDataReposive().cameraRun.pos[0],
      DataManager.getDataReposive().cameraRun.pos[1],
      DataManager.getDataReposive().cameraRun.pos[2]
    );
    this.mainCamera.setLocalEulerAngles(
      DataManager.getDataReposive().cameraRun.rot[0],
      DataManager.getDataReposive().cameraRun.rot[1],
      DataManager.getDataReposive().cameraRun.rot[2]
    );
    if (GameConstant.DEBUG_CAMERA) {
      this.mainCamera.addComponent("script");
      this.mainCamera.script.create("orbitCamera", {
        attributes: {
          inertiaFactor: 0.3, // Override default of 0 (no inertia)
        },
      });

      this.mainCamera.script.create("orbitCameraInputMouse");
      this.mainCamera.script.create("orbitCameraInputTouch");
    } else {
      this._initCameraController();
    }

    this._initNumberCharacterBar();

  }

  _initNumberCharacterBar() {
    this.player.numberCharacterBar = new NumberCharacterBar();
    this.playScreen.addChild(this.player.numberCharacterBar);

    this.player.scriptNumberCharBar = this.player.numberCharacterBar.addScript(FollowWorldTarget, {
      target: this.player.elements[0],
      camera: this.mainCamera,
      screen: this.playScreen,
    });

    this.player.numberCharacterBar.setText(this.player.elements.length)
  }

  _initCameraController() {
    this.cameraController = this.mainCamera.addScript(CameraController, {
      target: this.player,
      speed: 3,
      offset: this.mainCamera.getPosition().clone(),
      limitX: DataManager.getDataReposive().cameraRun.camera_limit_x,
    });
  }

  _initBg() {
    let topColor = [
      Util.createColor(25, 189, 255),
    ];
    let bottomColor = [
      Util.createColor(25, 189, 255),
    ];
    let textures = []
    for (let i = 0; i < topColor.length; i++) {
      const texWidth = 256;
      const texHeight = 512;
      let texture = new pc.Texture(Game.app.graphicsDevice, {
        width: texWidth,
        height: texHeight,
        format: pc.PIXELFORMAT_R8_G8_B8,
        addressU: pc.ADDRESS_CLAMP_TO_EDGE,
        addressV: pc.ADDRESS_CLAMP_TO_EDGE
      });
      let pixels = texture.lock();

      var count = 0;
      var result = new pc.Color();

      const topPixelColor = topColor[i];
      const bottomPixelColor = bottomColor[i];

      for (var h = 0; h < texHeight; h++) {
        for (var w = 0; w < texWidth; w++) {

          result.lerp(topPixelColor, bottomPixelColor, h / (texHeight - 1));

          // assign the result color to each texture pixel:
          pixels[count++] = result.r * 255;       // red
          pixels[count++] = result.g * 255;       // green
          pixels[count++] = result.b * 255;       // blue
        }
      }
      texture.unlock();
      textures.push(texture);
    }
    let texture = Util.randomFromList(textures);
    // let asset = AssetLoader.getAssetByKey(texture);
    this.bg = new GameBackground(texture);
    this.bg.setLocalEulerAngles(32, 0, 0);
    this.addChild(this.bg);
  }

  resize() {
    super.resize();
    this.cameraController.limitX = DataManager.getDataReposive().cameraRun.camera_limit_x;
    var pos_x = this.mainCamera.getLocalPosition().x;

    this.mainCamera.setLocalPosition(
      DataManager.getDataReposive().cameraRun.pos[0],
      DataManager.getDataReposive().cameraRun.pos[1],
      DataManager.getDataReposive().cameraRun.pos[2]
    );
    this.mainCamera.setLocalEulerAngles(
      DataManager.getDataReposive().cameraRun.rot[0],
      DataManager.getDataReposive().cameraRun.rot[1],
      DataManager.getDataReposive().cameraRun.rot[2]
    );

    this.cameraController.offset = this.mainCamera.getPosition().clone();

    this.player.numberCharacterBar.resize();
  }
}