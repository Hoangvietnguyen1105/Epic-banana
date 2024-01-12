import { ELEMENTTYPE_TEXT, Entity, Vec2, Vec4 } from "playcanvas";
import { GameConstant } from "../../../../gameConstant";
import { Util } from "../../../../helpers/util";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { UIScreen } from "../../../../template/ui/uiScreen"
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { DataManager } from "../../../data/dataManager";
import { UserData } from "../../../data/userData";
import { Tween } from "../../../../template/systems/tween/tween";
import { SceneManager } from "../../../../template/scene/sceneManager";
import { SoundManager } from "../../../../template/soundManager";
import { AdsManager } from "../../../../../ads/adsManager";
import { AdVideoConfig, AdVideoType } from "../../../../../ads/adsConstant";

export const LoseArenaScreenEvent = Object.freeze({
  ButtonClaimClicked: "buttonClaimClicked",
});


export class LoseArenaScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_ARENA_LOSE);

    this.numberCoin = 10;
    this._initFakeBg();
    this._initButtonClaim();
    this._initBody();
    this._initCoin();
    this._initHeader();
    this._initBonus();
    this._initNoThanks();
  }

  _initNoThanks() {
    this.textNoThanks = new Entity();
    this.textNoThanks.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(
        DataManager.getDataReposive().vic_arena_screen.btnNoThank.anchor_x,
        DataManager.getDataReposive().vic_arena_screen.btnNoThank.anchor_y,
        DataManager.getDataReposive().vic_arena_screen.btnNoThank.anchor_x,
        DataManager.getDataReposive().vic_arena_screen.btnNoThank.anchor_y
      ),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 36,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: "No, thanks",
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.addChild(this.textNoThanks);
    this.textNoThanks.setLocalScale(
      DataManager.getDataReposive().vic_arena_screen.btnNoThank.scale,
      DataManager.getDataReposive().vic_arena_screen.btnNoThank.scale,
      DataManager.getDataReposive().vic_arena_screen.btnNoThank.scale
    );
    Util.registerOnTouch(this.textNoThanks.element, this._onTapNoThank, this);
  }

  _initCoin() {
    this.coin = ObjectFactory.createImageElement("bg-coin", {
      anchor: new Vec4(
        DataManager.getDataReposive().home_run.coin.anchor_x,
        DataManager.getDataReposive().home_run.coin.anchor_y,
        DataManager.getDataReposive().home_run.coin.anchor_x,
        DataManager.getDataReposive().home_run.coin.anchor_y),
      pivot: new Vec2(0.5, 0.5),
      scale: 1.3,
    });
    this.addChild(this.coin);

    let icCoin = ObjectFactory.createImageElement("ic-coin", {
      anchor: new Vec4(1, 0.5, 1, 0.5),
      pivot: new Vec2(0.5, 0.5),
    });
    this.coin.addChild(icCoin);

    this.coin.text = new Entity();
    this.coin.text.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.37, 0.5, 0.37, 0.5),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 46,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: Util.getCashFormat(UserData.currency),
    });
    this.coin.addChild(this.coin.text);

    this.coin.setLocalScale(
      DataManager.getDataReposive().home_run.coin.scale,
      DataManager.getDataReposive().home_run.coin.scale,
      DataManager.getDataReposive().home_run.coin.scale
    );
  }

  updateCoin() {
    this.coin.text.element.text = Util.getCashFormat(UserData.currency);
  }

  _initBody() {
    this.panel = ObjectFactory.createImageElement("layout-red", {
      anchor: new Vec4(
        DataManager.getDataReposive().vic_arena_screen.panel.anchor_x,
        DataManager.getDataReposive().vic_arena_screen.panel.anchor_y,
        DataManager.getDataReposive().vic_arena_screen.panel.anchor_x,
        DataManager.getDataReposive().vic_arena_screen.panel.anchor_y),
    });
    this.panel.setLocalPosition(0, 0, 0);
    this.addChild(this.panel);

    this.text = new Entity();
    this.text.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.74, 0.5, 0.74),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 42,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: "You Earned:",
    });
    this.panel.addChild(this.text);

    this.textCoin = new Entity();
    this.textCoin.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.42, 0.3, 0.42, 0.3),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 78,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: this.numberCoin.toString(),
    });
    this.panel.addChild(this.textCoin);

    let icCoin = ObjectFactory.createImageElement("ic-coin", {
      anchor: new Vec4(1, 0.5, 1, 0.5),
      pivot: new Vec2(0.5, 0.5),
    });
    icCoin.setLocalPosition(80, 0, 0)
    icCoin.setLocalScale(0.65, 0.65, 0.65);
    this.textCoin.addChild(icCoin);
  }

  _initFakeBg() {
    this.fakeBg = ObjectFactory.createUIBackground();
    this.addChild(this.fakeBg);
    this.fakeBg.element.opacity = 0.7;
  }

  _initButtonClaim() {
    this.btnClaim = ObjectFactory.createImageElement("spr_btn_yellow_big", {
      anchor: new Vec4(
        DataManager.getDataReposive().vic_arena_screen.btnClaim.anchor_x,
        DataManager.getDataReposive().vic_arena_screen.btnClaim.anchor_y,
        DataManager.getDataReposive().vic_arena_screen.btnClaim.anchor_x,
        DataManager.getDataReposive().vic_arena_screen.btnClaim.anchor_y
      ),
    });
    this.btnClaim.setLocalScale(
      DataManager.getDataReposive().vic_arena_screen.btnClaim.scale,
      DataManager.getDataReposive().vic_arena_screen.btnClaim.scale,
      DataManager.getDataReposive().vic_arena_screen.btnClaim.scale
    );
    this.btnClaim.setLocalPosition(0, 0, 0);
    this.addChild(this.btnClaim);

    let ic = ObjectFactory.createImageElement("ic-ads", {
      anchor: new Vec4(0.2, 0.5, 0.2, 0.5),
      pivot: new Vec2(0.5, 0.5),
    });
    ic.setLocalScale(0.5, 0.5, 0.5);
    this.btnClaim.addChild(ic);


    let textClaim = new Entity();
    textClaim.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.6, 0.75, 0.6, 0.75),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 34,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: "Claim",
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.btnClaim.addChild(textClaim);
    Util.registerOnTouch(this.btnClaim.element, this._onTapButtonClaim, this);

    this.textAdsCoin = new Entity();
    this.textAdsCoin.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.17, 0.5, 0.17),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 40,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: this.numberCoin.toString(),
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.btnClaim.addChild(this.textAdsCoin);

    let icCoin = ObjectFactory.createImageElement("ic-coin", {
      anchor: new Vec4(1, 0.5, 1, 0.5),
      pivot: new Vec2(0.5, 0.5),
    });
    icCoin.setLocalScale(0.18, 0.18, 0.18);
    icCoin.setLocalPosition(20, 0, 0)
    this.textAdsCoin.addChild(icCoin);

  }

  _initHeader() {
    this.header = ObjectFactory.createImageElement("ribbon-lose", {
      anchor: new Vec4(0.5, 1, 0.5, 1),
      pivot: new Vec2(0.5, 0.1),
    });
    this.panel.addChild(this.header);
    this.header.setLocalScale(0.7, 0.7, 0.7);

    let text = new Entity();
    text.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.6, 0.5, 0.6),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 130,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: "You lose",
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.header.addChild(text);
  }

  _initBonus() {
    this.bonus = ObjectFactory.createImageElement("bonus-frame", {
      anchor: new Vec4(
        DataManager.getDataReposive().vic_arena_screen.bonus.anchor_x,
        DataManager.getDataReposive().vic_arena_screen.bonus.anchor_y,
        DataManager.getDataReposive().vic_arena_screen.bonus.anchor_x,
        DataManager.getDataReposive().vic_arena_screen.bonus.anchor_y
      ),
      pivot: new Vec2(0.5, 0.5),
    });
    this.bonus.setLocalScale(
      DataManager.getDataReposive().vic_arena_screen.bonus.scale,
      DataManager.getDataReposive().vic_arena_screen.bonus.scale,
      DataManager.getDataReposive().vic_arena_screen.bonus.scale
    );
    this.bonus.setLocalPosition(0, -10, 0);
    this.addChild(this.bonus);

    this.bonus.addChild(this._createTextXp("x2", new Vec4(0.1, 0.4, 0.1, 0.4), new Vec2(0.5, 0.5)));
    this.bonus.addChild(this._createTextXp("x3", new Vec4(0.3, 0.4, 0.3, 0.4), new Vec2(0.5, 0.5)));
    this.bonus.addChild(this._createTextXp("x5", new Vec4(0.5, 0.4, 0.5, 0.4), new Vec2(0.5, 0.5)));
    this.bonus.addChild(this._createTextXp("x3", new Vec4(0.7, 0.4, 0.7, 0.4), new Vec2(0.5, 0.5)));
    this.bonus.addChild(this._createTextXp("x2", new Vec4(0.9, 0.4, 0.9, 0.4), new Vec2(0.5, 0.5)));

    this.arrow = ObjectFactory.createImageElement("arrow", {
      anchor: new Vec4(0.5, 0, 0.5, 0),
      pivot: new Vec2(0.5, 0.5),
    });
    this.arrow.setLocalScale(0.6, 0.6, 0.6);
    this.arrow.setLocalPosition(-360, 0, 0);
    this.arrow.setLocalEulerAngles(0, 0, 180);
    this.bonus.addChild(this.arrow);

    this.tweenArrow = Tween.createLocalTranslateTween(this.arrow, { x: 365 }, {
      duration: 0.9,
      onUpdate: () => {
        var val = this.getValuesBonus();
        this.textAdsCoin.element.text = Util.getCashFormat(val * this.numberCoin);
      },
      loop: true,
      yoyo: true,
    }).start();
  }

  getValuesBonus() {
    var posX_arrow = this.arrow.getLocalPosition().x;
    if (Math.abs(posX_arrow) / 365 >= 0.6) {
      return 2;
    }
    else if (Math.abs(posX_arrow) / 365 >= 0.2) {
      return 3;
    }
    else {
      return 5;
    }
  }

  _createTextXp(xp, anchor, pivot) {
    let text = new Entity();
    text.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: anchor,
      pivot: pivot,
      fontSize: 72,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: xp,
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    return text;
  }

  _onTapButtonClaim() {
    this.tweenArrow.stop();
    var val = parseFloat(this.numberCoin * this.getValuesBonus());
    let config = new AdVideoConfig();
    config.onStarted = () => {
      this.btnClaim.enabled = false;
    }
    config.onFinished = () => {
      UserData.currency += val
      SceneManager.updateCoin();
      this.fire(LoseArenaScreenEvent.ButtonClaimClicked);
      this.btnClaim.enabled = true;
    }
    config.onError = (err) => {
      if (err.breakType !== "dismissed") {
        let scene = SceneManager.getScene(GameConstant.SCENE_RUN);
        Tween.createCountTween({
          duration: 0.8,
          onStart: () => {
            scene.enablePopup("Ads not ready");
          },
          onComplete: () => {
            scene.disablePopup();
          },
        }).start();
      }
      else {
        let scene = SceneManager.getScene(GameConstant.SCENE_RUN);
        Tween.createCountTween({
          duration: 0.8,
          onStart: () => {
            scene.enablePopup("Reward not received");
          },
          onComplete: () => {
            scene.disablePopup();
          },
        }).start();
      }
      this.btnClaim.enabled = true;
      this.tweenArrow.start();
    }
    AdsManager.showVideo(AdVideoType.REWARDED, config);
  }

  _onTapNoThank() {
    SoundManager.play("sfx_game_click");
    this.tweenArrow.stop();
    UserData.currency += parseFloat(this.numberCoin);
    SceneManager.updateCoin();
    this.fire(LoseArenaScreenEvent.ButtonClaimClicked);
  }

  updateNumberCoin(numberCoin) {
    this.numberCoin = numberCoin;
    this.textCoin.element.text = this.numberCoin.toString()
  }

  reloadData() {
    this.tweenArrow.start();
  }

  resize() {
    super.resize();
    this.textNoThanks.setLocalScale(
      DataManager.getDataReposive().vic_arena_screen.btnNoThank.scale,
      DataManager.getDataReposive().vic_arena_screen.btnNoThank.scale,
      DataManager.getDataReposive().vic_arena_screen.btnNoThank.scale
    );

    this.textNoThanks.element.anchor = new Vec4(
      DataManager.getDataReposive().vic_arena_screen.btnNoThank.anchor_x,
      DataManager.getDataReposive().vic_arena_screen.btnNoThank.anchor_y,
      DataManager.getDataReposive().vic_arena_screen.btnNoThank.anchor_x,
      DataManager.getDataReposive().vic_arena_screen.btnNoThank.anchor_y
    );

    this.coin.setLocalScale(
      DataManager.getDataReposive().home_run.coin.scale,
      DataManager.getDataReposive().home_run.coin.scale,
      DataManager.getDataReposive().home_run.coin.scale
    );

    this.coin.element.anchor = new Vec4(
      DataManager.getDataReposive().home_run.coin.anchor_x,
      DataManager.getDataReposive().home_run.coin.anchor_y,
      DataManager.getDataReposive().home_run.coin.anchor_x,
      DataManager.getDataReposive().home_run.coin.anchor_y);

    this.panel.element.anchor = new Vec4(
      DataManager.getDataReposive().vic_arena_screen.panel.anchor_x,
      DataManager.getDataReposive().vic_arena_screen.panel.anchor_y,
      DataManager.getDataReposive().vic_arena_screen.panel.anchor_x,
      DataManager.getDataReposive().vic_arena_screen.panel.anchor_y);

    this.bonus.element.anchor = new Vec4(
      DataManager.getDataReposive().vic_arena_screen.bonus.anchor_x,
      DataManager.getDataReposive().vic_arena_screen.bonus.anchor_y,
      DataManager.getDataReposive().vic_arena_screen.bonus.anchor_x,
      DataManager.getDataReposive().vic_arena_screen.bonus.anchor_y
    );
    this.bonus.setLocalScale(
      DataManager.getDataReposive().vic_arena_screen.bonus.scale,
      DataManager.getDataReposive().vic_arena_screen.bonus.scale,
      DataManager.getDataReposive().vic_arena_screen.bonus.scale
    );

    this.btnClaim.element.anchor = new Vec4(
      DataManager.getDataReposive().vic_arena_screen.btnClaim.anchor_x,
      DataManager.getDataReposive().vic_arena_screen.btnClaim.anchor_y,
      DataManager.getDataReposive().vic_arena_screen.btnClaim.anchor_x,
      DataManager.getDataReposive().vic_arena_screen.btnClaim.anchor_y
    );
    this.btnClaim.setLocalScale(
      DataManager.getDataReposive().vic_arena_screen.btnClaim.scale,
      DataManager.getDataReposive().vic_arena_screen.btnClaim.scale,
      DataManager.getDataReposive().vic_arena_screen.btnClaim.scale
    );
  }
}