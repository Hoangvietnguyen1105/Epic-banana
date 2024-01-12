import { Color, Entity, LIGHTTYPE_DIRECTIONAL, PROJECTION_PERSPECTIVE } from "playcanvas";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../template/scene/scene";
import { LoadingBarEvent } from "../ui/objects/loadingBar";
import { LoadingScreen } from "../ui/screens/loadingScreen";
import { SceneManager } from "../../template/scene/sceneManager";
import { GameState, GameStateManager } from "../../template/gameStateManager";
import { AdsManager } from "../../../ads/adsManager";
import { AdVideoType } from "../../../ads/adsConstant";


export class LoadingScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_LOADING);
  }

  create() {
    super.create();
    this.ui.addScreens(new LoadingScreen());
    this.ui.setScreenActive(GameConstant.SCREEN_LOADING);
    this.loadingScreen = this.ui.getScreen(GameConstant.SCREEN_LOADING);
    this.loadingScreen.loadingBar.on(LoadingBarEvent.COMPLETE, this.onLoadingCompleted, this);
    this._initialize();
  }

  _initialize() {
    this._initCamera();
    this._initLight();
  }

  onLoadingCompleted() {
    let sceneRun = SceneManager.getScene(GameConstant.SCENE_RUN);
    let sceneArena = SceneManager.getScene(GameConstant.SCENE_ARENA);
    this.enabled = false;
    SceneManager.removeScene(this);
    SceneManager.loadSceneAddtive(sceneArena)
    sceneArena.create();
    if (!GameConstant.DEBUG_ARENA) {
      SceneManager.loadSceneAddtive(sceneRun);
      sceneRun.create();
      sceneArena.disableControl();
    }
    if (GameConstant.DEBUG_CHALLENGE) {
      sceneArena.startChallenge();
    }

    GameStateManager.registerOnStateChangedCallback((state, prevState) => {
      if (state === GameState.Paused) {
        sceneRun.pauseMucic()
        sceneArena.pauseMucic()
      }

      if (prevState === GameState.Paused) {
        sceneRun.resumeMusic()
        sceneArena.resumeMusic()
      }
    })
  }

  _initCamera() {
    this.mainCamera = new Entity();
    this.addChild(this.mainCamera);
    this.mainCamera.addComponent("camera", {
      clearColor: new Color(0, 0, 0),
      farClip: 1000,
      fov: 60,
      nearClip: 0.1,
      type: PROJECTION_PERSPECTIVE
    });
    this.mainCamera.setLocalPosition(0, 5.625, -6);
    this.mainCamera.setLocalEulerAngles(-32, 180, 0);
  }

  _initLight() {
    this.directionalLight = new Entity("light-directional");
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
}