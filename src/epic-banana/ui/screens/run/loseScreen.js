import { ELEMENTTYPE_TEXT, Entity, Vec2, Vec4 } from "playcanvas";
import { GameConstant } from "../../../../gameConstant";
import { Util } from "../../../../helpers/util";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { UIScreen } from "../../../../template/ui/uiScreen"
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { DataManager } from "../../../data/dataManager";
import { SoundManager } from "../../../../template/soundManager";


export const LoseScreenEvent = Object.freeze({
  ButtonTryAgainClicked: "buttonTryAgainClicked",
});


export class LoseScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_LOSE);

    this._initFakeBg();
    this._initButtonTryAgain();
    this._initHead();
  }

  _initHead() {
    this.panel = ObjectFactory.createImageElement("layout-red", {
      anchor: new Vec4(0.5, 0.7, 0.5, 0.7),
    });
    this.panel.setLocalPosition(0, 0, 0);
    this.addChild(this.panel);

    this.headerLose = ObjectFactory.createImageElement("you-lose", {
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
    });
    this.panel.addChild(this.headerLose);

    this.text = new Entity();
    this.text.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0, 0.5, 0),
      pivot: new Vec2(0.5, 1),
      fontSize: 46,
      fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
      text: "Emotional damage",
    });
    this.text.setLocalPosition(0, -25, 0);
    this.panel.addChild(this.text);
  }

  _initFakeBg() {
    this.fakeBg = ObjectFactory.createUIBackground();
    this.addChild(this.fakeBg);
    this.fakeBg.element.opacity = 0.7;
  }

  _initButtonTryAgain() {
    this.btnTryAgain = ObjectFactory.createImageElement("spr_btn_yellow_big", {
      anchor: new Vec4(
        DataManager.getDataReposive().lose_screen_run.btn_tryAgain.anchor_x,
        DataManager.getDataReposive().lose_screen_run.btn_tryAgain.anchor_y,
        DataManager.getDataReposive().lose_screen_run.btn_tryAgain.anchor_x,
        DataManager.getDataReposive().lose_screen_run.btn_tryAgain.anchor_y
      ),
    });
    this.btnTryAgain.setLocalScale(1.2, 1.2, 1.2);
    this.btnTryAgain.setLocalPosition(0, 0, 0);
    this.addChild(this.btnTryAgain);
    let textTryAgain = new Entity();
    textTryAgain.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.6, 0.5, 0.6),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 42,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: GameConstant.TRY_AGAIN_TEXT,
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.btnTryAgain.addChild(textTryAgain);
    Util.registerOnTouch(this.btnTryAgain.element, this._onTapButtonTryAgain, this);

  }

  _onTapButtonTryAgain() {
    SoundManager.play("sfx_game_click");
    this.fire(LoseScreenEvent.ButtonTryAgainClicked);
  }

  resize() {
    super.resize();
    this.btnTryAgain.anchor = new Vec4(
      DataManager.getDataReposive().lose_screen_run.btn_tryAgain.anchor_x,
      DataManager.getDataReposive().lose_screen_run.btn_tryAgain.anchor_y,
      DataManager.getDataReposive().lose_screen_run.btn_tryAgain.anchor_x,
      DataManager.getDataReposive().lose_screen_run.btn_tryAgain.anchor_y
    );
  }
}