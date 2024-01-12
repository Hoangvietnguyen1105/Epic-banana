import { GameConstant } from "../../../gameConstant";
import { UIScreen } from "../../../template/ui/uiScreen";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { ELEMENTTYPE_IMAGE, Entity, Vec2, Vec4 } from "playcanvas";
import { LoadingBar } from "../objects/loadingBar";
import { Util } from "../../../helpers/util";
import { Game } from "../../../game";


export class LoadingScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_LOADING);

    this.bg = new Entity("bg");
    this.bg.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      spriteAsset: AssetLoader.getAssetByKey("bg_0"),
      anchor: new Vec4(0, 0, 1, 1),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(),
    });
    this.addChild(this.bg);


    this._initGameName();
    this._initLoadingBar();
  }

  create() {
    super.create();
  }

  _initGameName() {
    this.gameName = ObjectFactory.createImageElement("game-logo", {
      anchor: new Vec4(0.5, 0.8, 0.5, 0.8),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(),
      height: 150,
      width: 533,
    });
    this.addChild(this.gameName);
    this.onResizeGameName();

  }

  _initLoadingBar() {
    this.loadingBar = new LoadingBar({
      anchor: new Vec4(0.5, 0.2, 0.5, 0.2),
      width: 500,
      height: 50,
      color: Util.createColor(255, 255, 255)
    });
    this.loadingBar.start();
    this.addChild(this.loadingBar);
  }

  onResizeGameLogo() {
    let anchor = new Vec4(0.5, 0.7, 0.5, 0.7);
    if (Game.isLandscape()) {
      anchor = new Vec4(0.2, 0.65, 0.2, 0.65);
    }
    this.gameLogo.element.anchor = anchor;
  }

  onResizeGameName() {
    let anchor = new Vec4(0.5, 0.7, 0.5, 0.7)
    if (Game.isLandscape()) {
      anchor = new Vec4(0.5, 0.8, 0.5, 0.8);
    }
    this.gameName.element.anchor = anchor;
  }

  resize() {
    super.resize();
    // this.onResizeGameLogo();
    // this.onResizeGameName();
  }

  update() {
    super.update();
    this.loadingBar.update();
  }

}