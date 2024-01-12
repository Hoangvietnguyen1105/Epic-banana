import { Entity, Vec4, Vec2, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT } from "playcanvas";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { Util } from "../../../../helpers/util";
import { DataManager } from "../../../data/dataManager";
import { SoundManager } from "../../../../template/soundManager";
import { ChestBox } from "./chestBox";
import { KeyBar } from "./keyBar";
import { UserData } from "../../../data/userData";
import { DataLocal } from "../../../data/dataLocal";
import { GameConstant } from "../../../../gameConstant";
import { AdVideoConfig, AdVideoType } from "../../../../../ads/adsConstant";
import { Tween } from "../../../../template/systems/tween/tween";
import { AdsManager } from "../../../../../ads/adsManager";
import { SceneManager } from "../../../../template/scene/sceneManager";


export class LuckyBox extends Entity {
  constructor() {
    super();

    this.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      anchor: new Vec4(0, 0, 1, 1),
      pivot: new Vec2(0.5, 0.5),
      opacity: 0.6,
      color: Util.createColor(0, 0, 0),
    });

    Util.registerOnTouch(this.element, () => { }, this);

    this.groupChest = [];
    this.totalKey = 3
    this.maxPriceValue = 10000;

    this._initPanel();
    this._initText();
    this._initBox();
    this._initKeyBar();
    this._initMaxPrice();
    this._initButtonGetKey();
    this._initTextContinue();

    this.enableGetKey(false);

    this.reloadData();
  }

  _initPanel() {
    this.panel = ObjectFactory.createImageElement("frameCard1", {
      anchor: new Vec4(
        DataManager.getDataReposive().cardCharacter.anchor_x,
        DataManager.getDataReposive().cardCharacter.anchor_y,
        DataManager.getDataReposive().cardCharacter.anchor_x,
        DataManager.getDataReposive().cardCharacter.anchor_y
      ),
      pivot: new Vec2(0.5, 0.5),
    });
    var scale = DataManager.getDataReposive().cardCharacter.scale;
    this.panel.setLocalScale(scale, scale, scale);
    this.addChild(this.panel);
  }

  _initText() {
    let text = new Entity();
    text.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.47, 0.9, 0.47, 0.9),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 46,
      text: "Lucky Box",
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      color: Util.createColor(215, 215, 0),
    });
    this.panel.addChild(text);
  }

  _initBox() {
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        let chest = new ChestBox(new Vec4(0.2 + j * 0.25, 0.35 + i * 0.15, 0.23 + j * 0.25, 0.45 + i * 0.15), new Vec2(0.5, 0.5))
        this.panel.addChild(chest);
        this.groupChest.push(chest);
        Util.registerOnTouch(chest.bg.element, () => {
          if (this.totalKey > 0) {
            chest.setActiveCoin(true) && this.chestOpen(chest);
          }
        }, this);
      }
    }
  }

  _initKeyBar() {
    this.keyBar = new KeyBar(
      new Vec4(0.24, 0.23, 0.7, 0.28),
      new Vec2(0.5, 0.5)
    );
    this.panel.addChild(this.keyBar);
  }

  _initMaxPrice() {
    var textMaxPrice = new Entity();
    textMaxPrice.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.35, 0.84, 0.35, 0.84),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 36,
      text: "Max Price:",
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      color: Util.createColor(255, 255, 255),
    });
    this.panel.addChild(textMaxPrice);

    this.maxPrice = new Entity();
    this.maxPrice.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(1.05, 0, 1.05, 0),
      pivot: new Vec2(0, 0.5),
      fontSize: 40,
      text: Util.getCashFormat(this.maxPriceValue),
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      color: Util.createColor(255, 255, 255),
    });
    textMaxPrice.addChild(this.maxPrice);

    var icon = new Entity();
    icon.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      anchor: new Vec4(1.05, 0.2, 1.05, 0.2),
      pivot: new Vec2(0, 0.5),
      spriteAsset: AssetLoader.getAssetByKey("ic-coin"),
    });
    icon.setLocalScale(1.2, 1.2, 1.2)
    this.maxPrice.addChild(icon);
  }

  _initButtonGetKey() {
    this.btnGetKey = ObjectFactory.createImageElement("spr_btn_yellow_big", {
      anchor: new Vec4(0.5, -0.15, 0.5, -0.15),
      pivot: new Vec2(0.5, 1),
    });
    this.keyBar.addChild(this.btnGetKey);
    this.btnGetKey.setLocalScale(0.8, 0.8, 0.8)

    var ic_ads = ObjectFactory.createImageElement("ic-ads", {
      anchor: new Vec4(0.15, 0.5, 0.15, 0.5),
      pivot: new Vec2(0.5, 0.5),
    });
    ic_ads.setLocalScale(0.6, 0.6, 0.6)
    this.btnGetKey.addChild(ic_ads);

    var textGetKey = new Entity();
    textGetKey.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.35, 0.5, 0.35),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 52,
      text: "Get 3",
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.btnGetKey.addChild(textGetKey);

    var ic_key = ObjectFactory.createImageElement("ic-key", {
      anchor: new Vec4(0.85, 0.5, 0.85, 0.5),
      pivot: new Vec2(0.5, 0.5),
    });
    ic_key.setLocalScale(0.65, 0.65, 0.65)
    this.btnGetKey.addChild(ic_key);

    Util.registerOnTouch(this.btnGetKey.element, () => {
      this.enableGetKey(false);
      let config = new AdVideoConfig();
      config.onFinished = () => {
        this.enableGetKey(false);
        for (var i = 1; i <= 3; i++) {
          this.keyBar.setActiveKey(i, true);
        }
        this.totalKey = 3;

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
        this.enableGetKey(true);
      }
      AdsManager.showVideo(AdVideoType.REWARDED, config);
    }, this);
  }

  _initTextContinue() {
    this.textContinue = new Entity();
    this.textContinue.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, -1.55, 0.5, -1.55),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 50,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
      text: "Continue",
      color: Util.createColor(255, 255, 255),
      outlineThickness: 0.7,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.keyBar.addChild(this.textContinue);
    Util.registerOnTouch(this.textContinue.element, () => {
      this.parent.disableLuckybox();
      UserData.keys = 0;
      DataLocal.updateDataByKey(GameConstant.INDEXEDDB_KEYS, UserData.keys);
    }, this);
  }

  enableGetKey(active) {
    this.btnGetKey.enabled = active;
    this.textContinue.enabled = active;
  }

  reloadData() {

    this.totalKey = 3

    this.totalIncome = 0;
    this.totalChest = 9;

    for (var i = 0; i < Math.min(UserData.keys, 3); i++) {
      this.keyBar.setActiveKey(i + 1, true);
    }
    this.maxPriceValue = Math.max((UserData.priceMelee + UserData.priceRange), 300);
    this.groupChest.forEach(chest => {
      if (Math.random() < 0.5) {
        chest.setCoin(Util.randomInt(this.maxPriceValue, this.maxPriceValue * 2));
      }
      else {
        chest.setCoin(Util.randomInt(this.maxPriceValue * 6, this.maxPriceValue * 8));
      }
      chest.setActiveCoin(false);
    });
    if (Util.getCashFormat(this.maxPriceValue) * 15) {
      this.maxPrice.element.text = Util.getCashFormat(this.maxPriceValue) * 15;
    }
    else {
      this.maxPrice.element.text = Util.getCashFormat(10000);
    }
  }

  chestOpen(chest) {
    SoundManager.play("sfx_game_claim_key_and_open_chest");
    this.keyBar.setActiveKey(this.totalKey, false);
    this.totalKey--;
    if (this.totalKey == 0) {
      this.enableGetKey(true);
    }
    this.totalChest--;

    if (this.totalChest == 0) {
      this.btnGetKey.enabled = false;
    }

    var income = Math.min(parseFloat(chest.coinValue), this.maxPriceValue * 15 - this.totalIncome);
    UserData.currency += income;
    this.totalIncome += income;
    DataLocal.updateDataByKey(GameConstant.INDEXEDDB_CURRENCY_KEY, UserData.currency);
    DataLocal.updateDataByKey(GameConstant.INDEXEDDB_KEYS, UserData.keys);
    SceneManager.updateCoin()
  }

  show() {
    this.enabled = true;
    var scale = this.panel.getLocalScale().clone();
    this.panel.setLocalScale(0.1, 0.1, 0.1);
    Tween.createScaleTween(this.panel, { x: scale.x, y: scale.y, z: scale.z }, {
      duration: 0.5,
    }).start();
  }

  hide() {
    var scale = this.panel.getLocalScale().clone();
    Tween.createScaleTween(this.panel, { x: 0.1, y: 0.1, z: 0.1 }, {
      duration: 0.2,
      onComplete: () => {
        this.panel.setLocalScale(scale.x, scale.y, scale.z);
        this.enabled = false;
      }
    }).start();
  }

  resize() {
    this.panel.element.anchor = new Vec4(
      DataManager.getDataReposive().cardCharacter.anchor_x,
      DataManager.getDataReposive().cardCharacter.anchor_y,
      DataManager.getDataReposive().cardCharacter.anchor_x,
      DataManager.getDataReposive().cardCharacter.anchor_y
    );
    var scale = DataManager.getDataReposive().cardCharacter.scale;
    this.panel.setLocalScale(scale, scale, scale);
  }
}