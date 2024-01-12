import { Entity, Vec4, Vec2, ELEMENTTYPE_TEXT, ELEMENTTYPE_IMAGE } from "playcanvas";
import { GameConstant } from "../../../../gameConstant";
import { Util } from "../../../../helpers/util";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { UIScreen } from "../../../../template/ui/uiScreen"
import { Tween } from "../../../../template/systems/tween/tween";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { SceneManager } from "../../../../template/scene/sceneManager";
import { DataManager } from "../../../data/dataManager";
import { DataLocal } from "../../../data/dataLocal";
import { UserData } from "../../../data/userData";
import { LockChallenge } from "../../objects/challenge/lockChallenge";
import { Setting } from "../../objects/setting/Setting";
import { CardCharacterReward } from "../../objects/reward/cardCharacterReward";
import { ButtonLevelRise } from "../../objects/levelRise/btnLevelRise";
import { LevelRise } from "../../objects/levelRise/levelRise";
import { SoundManager } from "../../../../template/soundManager";
import { Challenge } from "../../objects/challenge/challenge";
import { Time } from "../../../../template/systems/time/time";
import { LuckyBox } from "../../objects/luckyBox/luckyBox";
import { AdsManager } from "../../../../../ads/adsManager";
import { AdVideoConfig, AdVideoType } from "../../../../../ads/adsConstant";
import { Tweener } from "../../../../template/systems/tween/tweener";

export const HomeRunScreenEvent = Object.freeze({
  OnTapBackground: "onTapBackground",
  OnTapButtonSpin: "onTapButtonSpin",
  OnTapButtonMoreFun: "onTapButtonMoreFun",
  OnTapButtonCloseChallenge: "onTapButtonCloseChallenge",
  OnTapButtonCloseSetting: "onTapButtonCloseSetting",
  OnTapMusicSetting: "onTapMusicSetting",
  OnTapSoundSetting: "onTapSoundSetting",
  OnStartChallenge: "onStartChallenge",
});


export class HomeRunScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_HOME_RUN);

    this._initFakeBg();
    this._initTutorial();
    this._initText();
    this._initBtnSpin();
    this._initHeader();
    this._initBtnChallenge();
    this._initBtnLevelRise();
    this._initBgOptionSelected();
    this._initCoin();
    this._initSetting();
    this.enableRun = true;


    this._initLevelRise();

    this._initLuckyBox();
  }

  _initLuckyBox() {
    this.luckyBox = new LuckyBox();
    this.addChild(this.luckyBox);
    this.luckyBox.enabled = false;
  }
  _initLevelRise() {
    this.levelRise = new LevelRise();
    this.addChild(this.levelRise);
    this.levelRise.enabled = false;

    this.levelRise.on("LevelRise:OnTapButtonClose", () => {
      this.levelRise.enabled = false;
      this.btnLevelRise.setDotActive(this.levelRise.checkReward());
      this._enableHandArrow();
    }, this);
  }

  disableLuckybox() {
    this.luckyBox.hide();
    this._enableHandArrow();
  }

  enableLuckybox() {
    this.luckyBox.reloadData();
    this.luckyBox.show();
    this._disableHandArrow();
  }

  checkLuckybox() {
    if (UserData.keys >= 3) {
      this.enableLuckybox();
    }
  }

  _initSetting() {
    this.setting = new Setting();
    this.addChild(this.setting);
    this.setting.enabled = false;

    this.setting.on(HomeRunScreenEvent.OnTapButtonCloseSetting, this._disableSetting, this);

    this.setting.on(HomeRunScreenEvent.OnTapMusicSetting, (boolean) => {
      if (boolean) {
        SceneManager.enableMusic();
      }
      else {
        SceneManager.disableMusic();
      }
    }, this);

    this.setting.on(HomeRunScreenEvent.OnTapSoundSetting, (boolean) => {
      SoundManager.soundManagerEntity.enabled = boolean;
    }, this);

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

  _initBgOptionSelected() {
    this.bgOptionSelected = new Entity("spinBg");
    this.bgOptionSelected.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      anchor: new Vec4(0, 0, 1, 1),
      pivot: new Vec2(0.5, 0.5),
      color: Util.createColor(0, 0, 0),
      opacity: 0.5,
    });
    this.addChild(this.bgOptionSelected);
    Util.registerOnTouch(this.bgOptionSelected.element, () => { }, this);

    ////////////////////////////SPIN////////////////////////////
    this._initSpin();

    ////////////////////////////CHALLENGE///////////////////////
    this._initChallenge();
  }
  _initSpin() {
    this.spinEntity = ObjectFactory.createImageElement("ribbon", {
      anchor: new Vec4(
        0.5, DataManager.getDataReposive().spin.anchor_spin,
        0.5, DataManager.getDataReposive().spin.anchor_spin),
      pivot: new Vec2(0.5, 0.5),
    });
    var scale = DataManager.getDataReposive().spin.scale;
    this.spinEntity.setLocalScale(scale, scale, scale);
    this.addChild(this.spinEntity);

    let text = ObjectFactory.createImageElement("lucky-spin", {
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
    });
    text.setLocalPosition(0, 30, 0);
    this.spinEntity.addChild(text);

    let frameSpin = new Entity("frameSpin");
    frameSpin.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
      color: Util.createColor(0, 0, 0),
      width: 1054,
      height: 1056,
      opacity: 0,
    });
    frameSpin.setLocalPosition(0, -700, 0);
    frameSpin.setLocalScale(0.9, 0.9, 0.9);
    this.spinEntity.addChild(frameSpin);

    this.spin = ObjectFactory.createImageElement("frame-spin-1", {
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
      width: 1054,
      height: 1056,
    });
    frameSpin.addChild(this.spin);

    this.btnMoreSpin = ObjectFactory.createImageElement("btn-spin-new-3", {
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
    });
    this.spin.addChild(this.btnMoreSpin);

    let ic_ads = ObjectFactory.createImageElement("ic-ads", {
      anchor: new Vec4(0.5, 0.7, 0.5, 0.7),
      pivot: new Vec2(0.5, 0.5),
    });
    this.btnMoreSpin.addChild(ic_ads);

    let textMoreSpin = new Entity();
    textMoreSpin.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.45, 0.3, 0.45, 0.3),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 40,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: `More\n Spin`,
    });
    this.btnMoreSpin.addChild(textMoreSpin);
    this.btnMoreSpin.enabled = false;
    Util.registerOnTouch(this.btnMoreSpin.element, this._onTapMoreSpin, this);

    this.btnStartSpin = ObjectFactory.createImageElement("btn-spin-new-2", {
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
    });
    this.spin.addChild(this.btnStartSpin);

    let textStartSpin = new Entity();
    textStartSpin.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.47, 0.5, 0.47, 0.5),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 72,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: `Spin`,
    });
    this.btnStartSpin.addChild(textStartSpin);
    Util.registerOnTouch(this.btnStartSpin.element, this._onTapBtnStartSpin, this);

    let arrow = ObjectFactory.createImageElement("arrow", {
      anchor: new Vec4(0.5, 1, 0.5, 1),
      pivot: new Vec2(0.5, 0.5),
    });
    arrow.setLocalScale(1.2, 1.2, 1.2);
    frameSpin.addChild(arrow);

    this.btnClose = ObjectFactory.createImageElement("btn-x1", {
      anchor: new Vec4(1, 0.6, 1, 0.6),
      pivot: new Vec2(0.5, 0.5),
    });
    this.btnClose.setLocalScale(0.6, 0.6, 0.6);
    this.spinEntity.addChild(this.btnClose);
    Util.registerOnTouch(this.btnClose.element, this._onCloseSpin, this);
    this._disableSpin();

    this.screenGetReward = new CardCharacterReward(this.getCardCoin.bind(this));
    this.addChild(this.screenGetReward);
    this.screenGetReward.enabled = false;
    this.screenGetReward.on("CardCharacterReward:OnTapButtonGet", () => {
      this.screenGetReward.enabled = false;
      this.spinEntity.enabled = true;
      this.btnMoreSpin.enabled = true;
    }, this);

    this._initSpinItem(this.spin);
  }

  getCardCoin() {
    return this.coin;
  }

  _initSpinItem(spin) {
    this.itemSpin = [];
    var i = 0;
    var bestReward = (DataLocal.priceMelee + DataLocal.priceRange) * 2
    var rewrds = [5, 0.0625, 1, 0.125, 2, 0.25, 0.5, 0.1]
    DataManager.getSpinData().box.forEach((item, index) => {
      var quantity = 0

      if (rewrds[index] === 5 || rewrds[index] === 2) {
        var type = "ic-card";
        quantity = rewrds[index]
      } else {
        var type = "ic-coin";
        quantity = Math.floor(rewrds[index] * bestReward)
      }

      this._initItemSpin(spin, type, item, quantity);
      i++;
    });

  }

  _onCloseSpin() {
    SoundManager.play("sfx_game_click");
    this._disableSpin();
    this._enableHandArrow();
  }

  _onTapMoreSpin() {
    let config = new AdVideoConfig();
    config.onStarted = () => {
      this.btnMoreSpin.enabled = false;
    }
    config.onFinished = () => {
      this.btnMoreSpin.enabled = true;
      this._onTapBtnStartSpin();
    }
    config.onError = (err) => {
      console.log(err);
      if (err?.breakType !== "dismissed") {
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

      this.btnMoreSpin.enabled = true;
    }
    AdsManager.showVideo(AdVideoType.REWARDED, config);
  }

  _onTapBtnStartSpin() {
    SoundManager.play("sfx_game_click");
    this.btnMoreSpin.enabled = false;
    this.btnStartSpin.enabled = false;

    var rounds = Util.randomInt(3, 5);
    var angle = Util.randomInt(-180, 180);
    this.spin.setLocalEulerAngles(0, 0, 0);
    Tween.createRotateTween(this.spin, { z: 360 }, {
      duration: 5 / rounds,
      repeat: rounds,
      yoyo: true,
      onComplete: () => {
        Tween.createRotateTween(this.spin, { z: angle }, {
          duration: 2,
          easing: Tween.Easing.Sinusoidal.InOut,
          onComplete: () => {
            this._getReward();
            this._setTimeCdStartSpin();
          },
        }).start();
      },
    }).start();
  }

  _getReward() {
    const val = this.itemSpin.reduce(function (maxObj, curObj) {
      if (curObj.getPosition().y > maxObj.getPosition().y) {
        return curObj;
      } else {
        return maxObj;
      }
    }, this.itemSpin[0]);
    this.updateReward(val);
  }

  updateReward(item) {
    this.screenGetReward.enabled = true;
    if (item.name === "ic-card") {
      if (Math.random(0, 1) < 0.5) {
        this.screenGetReward.activeRewardRange(parseInt(item.quantity));
      } else {
        this.screenGetReward.activeRewardMelee(parseInt(item.quantity));
      }
    }
    else {
      this.screenGetReward.activeRewardCoin(parseInt(item.quantity));
    }
  }

  _setTimeCdStartSpin() {
    this.btnMoreSpin.enabled = true;
    let time = GameConstant.TIME_CD_START_SPIN;
    this.deactiveDotSpin();

    Tween.createCountTween({
      duration: GameConstant.TIME_CD_START_SPIN,
      easing: Tween.Easing.Linear.None,
      onUpdate: () => {
        time -= Time.dt;
        this.textTimeBtnSpin.element.text = Util.format_time(time);
      },
      onComplete: () => {
        this.btnStartSpin.enabled = true;
        this.btnMoreSpin.enabled = false;
        this.activeDotSpin();
      },
    }).start();
  }

  _initItemSpin(frameSpin, name, data, quantity) {
    let itemSpin = ObjectFactory.createImageElement(name, {
      anchor: new Vec4(data.ic.x, data.ic.y, data.ic.x, data.ic.y),
      pivot: new Vec2(0.5, 0.5),
    });
    itemSpin.name = name;
    itemSpin.setLocalScale(0.9, 0.9, 0.9)
    itemSpin.setLocalEulerAngles(0, 0, data.ic.rot);
    frameSpin.addChild(itemSpin);
    itemSpin.quantity = quantity;
    itemSpin.angleReward = data.ic.rot;
    this.itemSpin.push(itemSpin);

    itemSpin.valueSpin = new Entity();
    itemSpin.valueSpin.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, -0.1, 0.5, -0.1),
      pivot: new Vec2(0.5, 1),
      fontSize: 46,
      color: Util.createColor(255, 255, 255),
      fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
      text: Util.getCashFormat(quantity),
      margin: new Vec4(0, 0, 0, 0),
    });
    itemSpin.addChild(itemSpin.valueSpin);
  }

  _enableSpin() {
    this.enableRun = false;
    this.bgOptionSelected.enabled = true;
    this.spinEntity.enabled = true;
  }

  _disableSpin() {
    this.enableRun = true;
    this.bgOptionSelected.enabled = false;
    this.spinEntity.enabled = false;
  }

  _initHeader() {
    this.settingBtn = ObjectFactory.createImageElement("ic-sett", {
      anchor: new Vec4(
        DataManager.getDataReposive().home_run.ic_setting.anchor_x,
        DataManager.getDataReposive().home_run.ic_setting.anchor_y,
        DataManager.getDataReposive().home_run.ic_setting.anchor_x,
        DataManager.getDataReposive().home_run.ic_setting.anchor_y
      ),
      pivot: new Vec2(0.5, 0.5),
    });
    this.addChild(this.settingBtn);
    this.settingBtn.setLocalScale(0.5, 0.5, 0.5);
    Util.registerOnTouch(this.settingBtn.element, this._enableSetting, this);

    this.levelText = new Entity();
    this.levelText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(
        DataManager.getDataReposive().home_run.text_level.anchor_x,
        DataManager.getDataReposive().home_run.text_level.anchor_y,
        DataManager.getDataReposive().home_run.text_level.anchor_x,
        DataManager.getDataReposive().home_run.text_level.anchor_y
      ),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 72,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: "Level 1",
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.addChild(this.levelText);
    this.levelText.setLocalScale(0.8, 0.8, 0.8);

    this.updateCurrentLevel();
  }

  updateCurrentLevel() {
    this.levelText.element.text = GameConstant.LEVEL_TEXT + UserData.currentLevel;
    this.btnLevelRise && this.btnLevelRise.setDotActive(this.levelRise.checkReward());
  }

  _initBtnLevelRise() {
    this.btnLevelRise = new ButtonLevelRise({
      anchor: new Vec4(
        DataManager.getDataReposive().home_run.ic_levelrise.anchor_x,
        DataManager.getDataReposive().home_run.ic_levelrise.anchor_y,
        DataManager.getDataReposive().home_run.ic_levelrise.anchor_x,
        DataManager.getDataReposive().home_run.ic_levelrise.anchor_y)
    });
    this.addChild(this.btnLevelRise);
    this.btnLevelRise.setLocalScale(0.5, 0.5, 0.5)

    this.tweenLevelRise = Tween.createScaleTween(this.btnLevelRise, { x: 0.58, y: 0.58, z: 0.58 }, {
      duration: 1,
      loop: true,
      yoyo: true,
      easing: Tween.Easing.Sinusoidal.InOut,
    }).start();

    Util.registerOnTouch(this.btnLevelRise.element, () => {
      SoundManager.play("sfx_game_click");
      this._disableHandArrow();
      this.levelRise.enabled = true;
      this.levelRise.updateContent();
    }, this);

    this.btnLevelRise.setDotActive(this.levelRise?.checkReward());
  }

  _initBtnChallenge() {
    this.challengeBtn = ObjectFactory.createImageElement("bg-challenge", {
      anchor: new Vec4(
        DataManager.getDataReposive().home_run.ic_challenge.anchor_x,
        DataManager.getDataReposive().home_run.ic_challenge.anchor_y,
        DataManager.getDataReposive().home_run.ic_challenge.anchor_x,
        DataManager.getDataReposive().home_run.ic_challenge.anchor_y
      ),
      pivot: new Vec2(0.5, 0.5),
    });
    this.addChild(this.challengeBtn);

    let icon = ObjectFactory.createImageElement("ic-sword", {
      anchor: new Vec4(0.5, 0.8, 0.5, 0.8),
      pivot: new Vec2(0.5, 0.5),
    });
    this.challengeBtn.addChild(icon);


    var text = new Entity();
    text.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.2, 0.5, 0.2),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 40,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: "Challenge",
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0)
    });
    this.challengeBtn.addChild(text);
    this.challengeBtn.setLocalScale(0.5, 0.5, 0.5);

    this.tweenChallenge = Tween.createScaleTween(this.challengeBtn, { x: 0.58, y: 0.58, z: 0.58 }, {
      duration: 1,
      loop: true,
      yoyo: true,
      easing: Tween.Easing.Sinusoidal.InOut,
    }).start();

    Util.registerOnTouch(this.challengeBtn.element, this._onTapChallenge, this);
  }

  _initChallenge() {
    this.lockChallenge = new LockChallenge();
    this.addChild(this.lockChallenge);
    this.lockChallenge.enabled = false;

    this.challenge = new Challenge();
    this.addChild(this.challenge);
    this.challenge.enabled = false;
  }


  _onTapChallenge() {
    SoundManager.play("sfx_game_click");
    this._enableChallenge();
    this._disableHandArrow();
  }

  _enableSetting() {
    SoundManager.play("sfx_game_click");
    this.enableRun = false;
    this.setting.enabled = true;
    this._disableHandArrow();
  }

  _disableSetting() {
    this.enableRun = true;
    this.setting.enabled = false;
    this._enableHandArrow();
  }

  _enableChallenge() {
    this.enableRun = false;
    this.bgOptionSelected.enabled = true;
    if (UserData.currentLevel >= GameConstant.LEVEL_UNLOCK_CHALLENGE) {
      this.challenge.enabled = true;
      this.lockChallenge.enabled = false;
      this.challenge.once(HomeRunScreenEvent.OnTapButtonCloseChallenge, this._disableChallenge, this);
    }
    else {
      this.challenge.enabled = false;
      this.lockChallenge.enabled = true;
      this.lockChallenge.once(HomeRunScreenEvent.OnTapButtonCloseChallenge, this._disableChallenge, this);
    }
  }

  _disableChallenge() {
    this.enableRun = true;
    this.bgOptionSelected.enabled = false;
    this.lockChallenge.enabled = false;
    this.challenge.enabled = false;
    this._enableHandArrow();
  }

  _initBtnSpin() {
    this.btnSpin = ObjectFactory.createImageElement("btn-spin", {
      anchor: new Vec4(
        DataManager.getDataReposive().home_run.ic_spin.anchor_x,
        DataManager.getDataReposive().home_run.ic_spin.anchor_y,
        DataManager.getDataReposive().home_run.ic_spin.anchor_x,
        DataManager.getDataReposive().home_run.ic_spin.anchor_y
      ),
      pivot: new Vec2(0.5, 0.5),
    });
    this.addChild(this.btnSpin);

    this.btnSpin.icSpin = ObjectFactory.createImageElement("ic-spin", {
      anchor: new Vec4(0.5, 0.9, 0.5, 0.9),
      pivot: new Vec2(0.5, 0.5),
    });
    this.btnSpin.addChild(this.btnSpin.icSpin);

    this.tweenSpin = Tween.createRotateTween(this.btnSpin.icSpin, { z: 360 }, {
      duration: 2,
      delay: 0.1,
      loop: true,
      yoyo: false,
    }).start();

    this.btnSpin.dot = ObjectFactory.createImageElement("dot", {
      anchor: new Vec4(0.97, 0.97, 0.97, 0.97),
      pivot: new Vec2(0.5, 0.5),
    });
    this.btnSpin.addChild(this.btnSpin.dot);

    this.textBtnSpin = new Entity();
    this.textBtnSpin.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.42, 0.5, 0.42),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 40,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
      text: "Spin",
    });
    this.btnSpin.addChild(this.textBtnSpin);

    this.textTimeBtnSpin = new Entity();
    this.textTimeBtnSpin.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.31, 0.5, 0.31),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 40,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
      text: "00:00",
    });
    this.textTimeBtnSpin.setLocalPosition(0, -25, 0)
    this.btnSpin.addChild(this.textTimeBtnSpin);

    this.btnSpin.setLocalScale(0.5, 0.5, 0.5);

    Util.registerOnTouch(this.btnSpin.element, this._onTapSpin, this);

    this.activeDotSpin();
  }

  _onTapSpin() {
    SoundManager.play("sfx_game_click");
    this._enableSpin();
    this._disableHandArrow();
  }

  _initText() {
    this.helpText = new Entity("helpText");
    this.helpText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(
        0.5,
        DataManager.getDataReposive().arrowHand.anchor_y_text,
        0.5,
        DataManager.getDataReposive().arrowHand.anchor_y_text),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 46,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: "Drag to move",
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0),

    });
    this.addChild(this.helpText);
  }

  _initFakeBg() {
    this.fakeBg = ObjectFactory.createUIBackground();
    this.addChild(this.fakeBg);
    this.fakeBg.element.opacity = 0;
    Util.registerOnTouch(this.fakeBg.element, this._onTapBg, this);
  }

  _onTapBg() {
    if (!this.enableRun) {
      return;
    }
    this.fire(HomeRunScreenEvent.OnTapBackground);
  }

  _initTutorial() {
    this.arrow = ObjectFactory.createImageElement("spr_arrow", {
      anchor: new Vec4(0.5, 0.25, 0.5, 0.25),
    });
    this.arrow.setLocalScale(
      DataManager.getDataReposive().arrowHand.scale,
      DataManager.getDataReposive().arrowHand.scale,
      DataManager.getDataReposive().arrowHand.scale
    );
    this.addChild(this.arrow);
    this.hand = ObjectFactory.createImageElement("spr_hand", {
      anchor: new Vec4(0.5, 0.25, 0.5, 0.25),
    });
    this.hand.setLocalPosition(
      DataManager.getDataReposive().arrowHand.pos.x,
      DataManager.getDataReposive().arrowHand.pos.y,
      DataManager.getDataReposive().arrowHand.pos.z
    );
    this.hand.setLocalScale(
      DataManager.getDataReposive().arrowHand.scale,
      DataManager.getDataReposive().arrowHand.scale,
      DataManager.getDataReposive().arrowHand.scale
    );
    this.addChild(this.hand);
    this.tweenHand = Tween.createLocalTranslateTween(this.hand, {
      x: DataManager.getDataReposive().arrowHand.distance_x
    }, {
      duration: 1,
      delay: 0.1,
      easing: Tween.Easing.Sinusoidal.InOut,
      loop: true,
      yoyo: true,
    }).start();
  }

  _disableHandArrow() {
    this.arrow.enabled = false;
    this.hand.enabled = false;
    this.helpText.enabled = false;
    this.tweenHand.stop();
  }

  _enableHandArrow() {
    this.helpText.enabled = true;
    this.arrow.enabled = true;
    this.hand.enabled = true;
    this.tweenHand.start();
  }

  activeDotSpin() {
    this.btnSpin.dot.enabled = true;
    this.textTimeBtnSpin.enabled = false;
  }

  deactiveDotSpin() {
    this.btnSpin.dot.enabled = false;
    this.textTimeBtnSpin.enabled = true;
  }

  resize() {
    super.resize();

    this.levelRise.resize();
    this.luckyBox.resize();
    this.screenGetReward.resize();
    this.setting.resize();

    var scale = DataManager.getDataReposive().spin.scale;
    this.spinEntity.setLocalScale(scale, scale, scale);

    this.arrow.setLocalScale(
      DataManager.getDataReposive().arrowHand.scale,
      DataManager.getDataReposive().arrowHand.scale,
      DataManager.getDataReposive().arrowHand.scale
    );

    this.hand.setLocalPosition(
      DataManager.getDataReposive().arrowHand.pos.x,
      DataManager.getDataReposive().arrowHand.pos.y,
      DataManager.getDataReposive().arrowHand.pos.z
    );

    this.hand.setLocalScale(
      DataManager.getDataReposive().arrowHand.scale,
      DataManager.getDataReposive().arrowHand.scale,
      DataManager.getDataReposive().arrowHand.scale
    );

    this.helpText.element.anchor = new Vec4(
      0.5, DataManager.getDataReposive().arrowHand.anchor_y_text,
      0.5, DataManager.getDataReposive().arrowHand.anchor_y_text
    );

    this.btnSpin.element.anchor = new Vec4(
      DataManager.getDataReposive().home_run.ic_spin.anchor_x,
      DataManager.getDataReposive().home_run.ic_spin.anchor_y,
      DataManager.getDataReposive().home_run.ic_spin.anchor_x,
      DataManager.getDataReposive().home_run.ic_spin.anchor_y
    );

    this.challengeBtn.element.anchor = new Vec4(
      DataManager.getDataReposive().home_run.ic_challenge.anchor_x,
      DataManager.getDataReposive().home_run.ic_challenge.anchor_y,
      DataManager.getDataReposive().home_run.ic_challenge.anchor_x,
      DataManager.getDataReposive().home_run.ic_challenge.anchor_y
    );

    this.btnLevelRise.element.anchor = new Vec4(
      DataManager.getDataReposive().home_run.ic_levelrise.anchor_x,
      DataManager.getDataReposive().home_run.ic_levelrise.anchor_y,
      DataManager.getDataReposive().home_run.ic_levelrise.anchor_x,
      DataManager.getDataReposive().home_run.ic_levelrise.anchor_y
    );

    this.levelText.element.anchor = new Vec4(
      DataManager.getDataReposive().home_run.text_level.anchor_x,
      DataManager.getDataReposive().home_run.text_level.anchor_y,
      DataManager.getDataReposive().home_run.text_level.anchor_x,
      DataManager.getDataReposive().home_run.text_level.anchor_y
    );

    this.settingBtn.element.anchor = new Vec4(
      DataManager.getDataReposive().home_run.ic_setting.anchor_x,
      DataManager.getDataReposive().home_run.ic_setting.anchor_y,
      DataManager.getDataReposive().home_run.ic_setting.anchor_x,
      DataManager.getDataReposive().home_run.ic_setting.anchor_y
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
      DataManager.getDataReposive().home_run.coin.anchor_y
    );

    this.spinEntity.element.anchor = new Vec4(
      0.5, DataManager.getDataReposive().spin.anchor_spin,
      0.5, DataManager.getDataReposive().spin.anchor_spin);
    var scale = DataManager.getDataReposive().spin.scale;
    this.spinEntity.setLocalScale(scale, scale, scale);
  }
}

