import { loadObitCameraPlugin } from "./libs/orbit-camera";
import { AssetLoader } from "./assetLoader/assetLoader";
import { SceneManager } from "./template/scene/sceneManager";
import { GameConstant } from "./gameConstant";
import { InputManager } from "./template/systems/input/inputManager";
import { GameState, GameStateManager } from "./template/gameStateManager";
import { Time } from "./template/systems/time/time";
import { Tween } from "./template/systems/tween/tween";
import { AdsManager } from "../ads/adsManager";
import { AdBannerSize, AdEvent } from "../ads/adsConstant";
import {
  Application,
  ElementInput,
  Keyboard,
  Mouse,
  TouchDevice,
  FILLMODE_FILL_WINDOW,
  RESOLUTION_AUTO,
} from "playcanvas";
import "./template/extensions/index";
import { Configurator } from "./epic-banana/configtor/configtor";
import { SoundManager } from "./template/soundManager";
import { Physics } from "./physics/physics";
import { DataLocal, DataLocalEvent } from "./epic-banana/data/dataLocal";
import { FPSRender } from "./libs/fpsRender";
import { LoadingScene } from "./epic-banana/scenes/loadingScene";
import { DataManager } from "./epic-banana/data/dataManager";
import { RunScene } from "./epic-banana/scenes/runScene";
import { SceneArena } from "./epic-banana/scenes/arenaScene";

export class Game {
  static init() {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.app = new Application(this.canvas, {
      elementInput: new ElementInput(this.canvas),
      keyboard: new Keyboard(window),
      mouse: new Mouse(this.canvas),
      touch: new TouchDevice(this.canvas),
    });
    this.app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
    this.app.setCanvasResolution(RESOLUTION_AUTO);
    this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
    window.addEventListener("resize", () => this.app.resizeCanvas);

    if (GameConstant.DEBUG_FPS) {
      this.debugFPS();
    }
    loadObitCameraPlugin();
    AssetLoader.loadAssets(this.app, () => {
      this.load();
      this.create();
      this.initBannerAds();
    });
  }

  static initBannerAds() {
    AdsManager.init();
    AdsManager.emitter.on(AdEvent.AD_ERROR, this.showPopup, this);
    let id = "banner-ads";
    this.bannerAdsElement = document.createElement("div");
    this.bannerAdsElement.id = id;
    this.bannerAdsStyle = this.bannerAdsElement.style;
    document.body.appendChild(this.bannerAdsElement);

    AdsManager.emitter.on(AdEvent.AD_INIT_COMPLETED, () => {
      this.showBannerAds();
    });
  }

  static showPopup() {
  }

  static showBannerAds() {
    AdsManager.hasAdblock((isBlock) => {
      if (isBlock) {
        return;
      }
      this.bannerAdsStyle.width = "100%";
      this.bannerAdsStyle.height = "auto";
      this.bannerAdsStyle.inset = "auto 0 0 0";

      this.bannerAdsStyle.transformOrigin = "center bottom";
      if (this.isLandscape() && window.innerHeight < 400) {
        this.bannerAdsStyle.transform = "scale(0.5)";
      }

      AdsManager.showBanner(this.bannerAdsElement.id, AdBannerSize.SIZE2);
      this.onResizeBannerAds();
    });
  }

  static disableBannerAds() {
    this.bannerAdsElement.style.display = "none";
  }

  static enableBannerAds() {
    this.bannerAdsElement.style.display = "flex";
  }

  static onResizeBannerAds() { }

  static debugFPS() {
    FPSRender();
    this.fpsDebug = new FPSMeter();
  }

  static load() {
    InputManager.init(this.app);
    GameStateManager.init(GameState.HomeRun);
    Time.init(this.app);
    Tween.init(this.app);
    Configurator.config(this.app);
    this.app.on(DataLocalEvent.Initialize, () => {
      DataManager.init();
    });
    DataLocal.init();
    Physics.init(this.app);
    this.app.start();
  }

  static create() {
    this.numberBatch = this.app.batcher.addGroup("Number", true, 1000);
    this.sphereBatch = this.app.batcher.addGroup("Sphere", true, 100);
    this.gameCreated = true;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
    this.app.resizeCanvas(this.width, this.height);
    SceneManager.init([new LoadingScene(), new RunScene(), new SceneArena()]);
    SceneManager.loadScene(SceneManager.getScene(GameConstant.SCENE_LOADING));
    this.sceneLoading = SceneManager.getScene(GameConstant.SCENE_LOADING);
    this.sceneRun = SceneManager.getScene(GameConstant.SCENE_RUN);
    this.sceneArena = SceneManager.getScene(GameConstant.SCENE_ARENA);
    this.app.on("update", this.update, this);
  }

  static update(dt) {
    SceneManager.update(Time.dt);
    if (GameConstant.DEBUG_FPS) {
      this.fpsDebug.tick();
    }
  }

  static resize(screenSize) {
    if (this.gameCreated) {
      this.width = screenSize.width;
      this.height = screenSize.height;
      this.app.graphicsDevice.maxPixelRatio = window.devicePixelRatio;
      this.app.resizeCanvas(this.width, this.height);
      SceneManager.resize();
      this.app.fire("resize");
      if (this.isLandscape()) {
        Game.app.scene.fogStart = 28 * 0.86;
        Game.app.scene.fogEnd = 40 * 0.86;
      } else {
        Game.app.scene.fogStart = 28;
        Game.app.scene.fogEnd = 40;
      }
      if (this.isLandscape() && window.innerHeight < 400) {
        this.bannerAdsStyle.transform = "scale(0.5)";
      }
      else {
        this.bannerAdsStyle.transform = "scale(1)";
      }
    }
  }

  static onStart() {
    GameStateManager.state = GameState.Playing;
  }

  static replay() {
    GameStateManager.state = GameState.HomeRun;
  }

  static setPause(isPause) {
    if (!this.gameCreated) {
      return;
    }

    if (isPause) {
      this.pause();
    } else if (GameStateManager.state === GameState.Paused) {
      this.resume();
    }
  }

  static pause() {
    GameStateManager.state = GameState.Paused;
    Time.scale = 0;
    SoundManager.muteAll(true);
    SceneManager.pause();
  }

  static resume() {
    GameStateManager.state = GameStateManager.prevState;
    Time.scale = 1;
    SoundManager.muteAll(false);
    SceneManager.resume();
  }

  static isPortrait() {
    return this.width < this.height;
  }

  static isLandscape() {
    return this.width > this.height;
  }
}

window.addEventListener("contextmenu", (e) => e.preventDefault());
// eslint-disable-next-line no-undef

window.onload = function () {
  Game.init();
};

window.addEventListener("resize", (event) => {
  Game.resize({ width: window.innerWidth, height: window.innerHeight });
});

window.addEventListener("focus", () => {
  Game.setPause(false);
});

window.addEventListener("blur", () => {
  Game.setPause(true);
});
