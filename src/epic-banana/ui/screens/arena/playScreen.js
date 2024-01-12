import { ELEMENTTYPE_TEXT, Entity, Vec2, Vec4 } from "playcanvas";
import { GameConstant } from "../../../../gameConstant";
import { UIScreen } from "../../../../template/ui/uiScreen"
import { Util } from "../../../../helpers/util";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { DataManager } from "../../../data/dataManager";
import { UserData } from "../../../data/userData";
import { SceneManager } from "../../../../template/scene/sceneManager";
import { SoundManager } from "../../../../template/soundManager";
import { CardCharacter } from "../../objects/cardCharacter/cardCharacter";
import { NewCharacterUI } from "../../objects/cardCharacter/newCharacter";
import { Tween } from "../../../../template/systems/tween/tween";

export const PlayScreenEvent = Object.freeze({
  BtnBattleClicked: "btnBattle:clicked",
  CardStackMeleeClicked: "cardStackMelee:clicked",
  CardStackRangeClicked: "cardStackRange:clicked",
});


export class PlayScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_PLAY);
    this._initButtonBattle();
    this._initHeader();
    this._initCardGetCharacter();
    this._initCoin();

    this._initCardChacracter();
    this._initNewCharacter();
  }

  create() {
    super.create();
  }

  showNewCharacterUI(type, level) {
    this.newCharacter.configData(DataManager.getDataStat(type, level));
    this.newCharacter.enabled = true;
    this.newCharacter.updateLocal();
    this.newCharacter.show();
  }

  closeNewCharacterUI() {
    this.newCharacter.hide();
  }

  _initNewCharacter() {
    this.newCharacter = new NewCharacterUI();
    this.addChild(this.newCharacter);
    this.newCharacter.enabled = false;
  }

  _initCardChacracter() {
    this.cardCharater = new CardCharacter();
    this.addChild(this.cardCharater);

    this.cardCharater.on("CardCharacter:OnTapButtonClose", () => {
      this.cardCharater.enabled = false;
    })

    this.cardCharater.enabled = false;
  }

  _initButtonBattle() {
    this.btnBattle = ObjectFactory.createImageElement("spr_btn_yellow_big", {
      anchor: new Vec4(
        DataManager.getDataReposive().home_arena.btn_battle.anchor_x,
        DataManager.getDataReposive().home_arena.btn_battle.anchor_y,
        DataManager.getDataReposive().home_arena.btn_battle.anchor_x,
        DataManager.getDataReposive().home_arena.btn_battle.anchor_y
      ),
    });
    this.addChild(this.btnBattle);
    Util.registerOnTouch(this.btnBattle.element, () => {
      SoundManager.play("sfx_game_click");
      this.fire(PlayScreenEvent.BtnBattleClicked);
      this.btnBattle.enabled = false;
      this.cardMelee.enabled = false;
      this.cardRange.enabled = false;
      this.cardBtn.enabled = false;
    });

    let ic = ObjectFactory.createImageElement("ic-sword", {
      anchor: new Vec4(0.25, 0.75, 0.25, 0.75),
      pivot: new Vec2(0.5, 0.5),
    });
    this.btnBattle.addChild(ic);
    ic.setLocalScale(0.5, 0.5, 0.5);

    let text = new Entity();
    text.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.7, 0.55, 0.7, 0.55),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 42,
      text: "Fight",
      color: new pc.Color(1, 1, 1),
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
    });
    this.btnBattle.addChild(text);
  }

  _initHeader() {
    this.cardBtn = ObjectFactory.createImageElement("btn-card", {
      anchor: new Vec4(
        DataManager.getDataReposive().home_arena.ic_card.anchor_x,
        DataManager.getDataReposive().home_arena.ic_card.anchor_y,
        DataManager.getDataReposive().home_arena.ic_card.anchor_x,
        DataManager.getDataReposive().home_arena.ic_card.anchor_y
      ),
      pivot: new Vec2(0.5, 0.5),
    });
    this.addChild(this.cardBtn);
    this.cardBtn.setLocalScale(0.5, 0.5, 0.5);
    Util.registerOnTouch(this.cardBtn.element, this._onclickedCard, this);

    this.levelText = new Entity();
    this.levelText.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(
        DataManager.getDataReposive().home_arena.text_level.anchor_x,
        DataManager.getDataReposive().home_arena.text_level.anchor_y,
        DataManager.getDataReposive().home_arena.text_level.anchor_x,
        DataManager.getDataReposive().home_arena.text_level.anchor_y
      ),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 72,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
      text: "Level 1",
      outlineThickness: 0.4,
      outlineColor: Util.createColor(0, 0, 0),
    });
    this.addChild(this.levelText);
    this.levelText.setLocalScale(0.8, 0.8, 0.8);

    this.updateCurrentLevel();
  }

  updateCurrentLevel() {
    this.levelText.element.text = GameConstant.LEVEL_TEXT + UserData.currentLevel;
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

  enableElement() {
    this.btnBattle.enabled = true;
    this.cardMelee.enabled = true;
    this.cardRange.enabled = true;
    this.cardBtn.enabled = true;

    this.updateInfomationCard();
  }

  updateInfomationCard() {
    this.updateCardMelee();
    this.updateCardRange();
    this.updateCoin();
    this.updateCurrentLevel();
  }


  _initCardGetCharacter() {
    this._initCardRangeCharacter();
    this._initCardMeleeCharacter();
    this.updateCardMelee();
    this.updateCardRange();
  }

  _initCardRangeCharacter() {
    this.cardRange = ObjectFactory.createImageElement("btn-ads", {
      anchor: new Vec4(
        DataManager.getDataReposive().home_arena.card_range.anchor_x,
        DataManager.getDataReposive().home_arena.card_range.anchor_y,
        DataManager.getDataReposive().home_arena.card_range.anchor_x,
        DataManager.getDataReposive().home_arena.card_range.anchor_y
      ),
      pivot: new Vec2(0.5, 0.5),
    });
    this.cardRange.setLocalScale(0.6, 0.6, 0.6);
    this.addChild(this.cardRange);

    Util.registerOnTouch(this.cardRange.element, () => {
      this.fire(PlayScreenEvent.CardStackRangeClicked);
    }, this);

    let ic = ObjectFactory.createImageElement("ic-red", {
      anchor: new Vec4(0.54, 0.84, 0.54, 0.84),
      pivot: new Vec2(0.5, 0.5),
    });
    this.cardRange.addChild(ic);
    ic.setLocalScale(0.8, 0.8, 0.8);

    let ic_coin = ObjectFactory.createImageElement("ic-coin", {
      anchor: new Vec4(0.22, 0.3, 0.22, 0.3),
      pivot: new Vec2(0.5, 0.5),
    });
    this.cardRange.addChild(ic_coin);
    ic_coin.setLocalScale(0.35, 0.35, 0.35);

    this.textPriceRange = new Entity();
    this.textPriceRange.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.6, 0.3, 0.6, 0.3),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 46,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
      text: "100",
    });
    this.cardRange.addChild(this.textPriceRange);

    this.dotRange = ObjectFactory.createImageElement("dot", {
      anchor: new Vec4(0, 1, 0, 1),
      pivot: new Vec2(0.2, 0.8),
    });
    this.dotRange.setLocalScale(1.3, 1.3, 1.3)
    this.cardRange.addChild(this.dotRange);

    this.number_stack_range = new Entity();
    this.number_stack_range.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 32,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
      text: "1",
    });
    this.dotRange.addChild(this.number_stack_range);
  }

  _initCardMeleeCharacter() {
    this.cardMelee = ObjectFactory.createImageElement("btn-ads", {
      anchor: new Vec4(
        DataManager.getDataReposive().home_arena.card_melee.anchor_x,
        DataManager.getDataReposive().home_arena.card_melee.anchor_y,
        DataManager.getDataReposive().home_arena.card_melee.anchor_x,
        DataManager.getDataReposive().home_arena.card_melee.anchor_y
      ),
      pivot: new Vec2(0.5, 0.5),
    });
    this.cardMelee.setLocalScale(0.6, 0.6, 0.6);
    this.addChild(this.cardMelee);

    Util.registerOnTouch(this.cardMelee.element, () => {
      this.fire(PlayScreenEvent.CardStackMeleeClicked);
    }, this);

    let ic = ObjectFactory.createImageElement("ic-sword-2", {
      anchor: new Vec4(0.5, 0.8, 0.5, 0.8),
      pivot: new Vec2(0.5, 0.5),
    });
    this.cardMelee.addChild(ic);
    ic.setLocalScale(0.8, 0.8, 0.8);

    let ic_coin = ObjectFactory.createImageElement("ic-coin", {
      anchor: new Vec4(0.22, 0.3, 0.22, 0.3),
      pivot: new Vec2(0.5, 0.5),
    });
    this.cardMelee.addChild(ic_coin);
    ic_coin.setLocalScale(0.35, 0.35, 0.35);

    this.textPriceMelee = new Entity();
    this.textPriceMelee.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.6, 0.3, 0.6, 0.3),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 46,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
      text: "100",
    });
    this.cardMelee.addChild(this.textPriceMelee);

    this.dot_melee = ObjectFactory.createImageElement("dot", {
      anchor: new Vec4(0, 1, 0, 1),
      pivot: new Vec2(0.2, 0.8),
    });
    this.dot_melee.setLocalScale(1.3, 1.3, 1.3)
    this.cardMelee.addChild(this.dot_melee);

    this.number_stack_melee = new Entity();
    this.number_stack_melee.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 32,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
      text: "1",
    });
    this.dot_melee.addChild(this.number_stack_melee);


  }

  updateCardRange() {
    if (UserData.stackRange <= 0) {
      this.dotRange.enabled = false;
      this.textPriceRange.element.text = Util.getCashFormat(UserData.priceRange);
    }
    else {
      this.dotRange.enabled = true;
      this.textPriceRange.element.text = "0";
      this.number_stack_range.element.text = UserData.stackRange;
    }
  }

  updateCardMelee() {
    if (UserData.stackMelee <= 0) {
      this.dot_melee.enabled = false;
      this.textPriceMelee.element.text = Util.getCashFormat(UserData.priceMelee);
    }
    else {
      this.dot_melee.enabled = true;
      this.textPriceMelee.element.text = "0";
      this.number_stack_melee.element.text = UserData.stackMelee;
    }
  }

  onClickedCardMelee() {
    SoundManager.play("sfx_game_click");
    if (UserData.stackMelee > 0) {
      UserData.stackMelee--;
    }
    else {
      if (UserData.currency >= UserData.priceMelee) {
        UserData.currency -= UserData.priceMelee;
        SceneManager.updateCoin();
        UserData.priceMelee *= 1.1;
      }
      else {
        return;
      }
    }
    this.updateCardMelee();
  }

  onClickedCardRange() {
    SoundManager.play("sfx_game_click");
    if (UserData.stackRange > 0) {
      UserData.stackRange--;
    }
    else {
      if (UserData.currency >= UserData.priceRange) {
        UserData.currency -= UserData.priceRange;
        SceneManager.updateCoin();
        UserData.priceRange *= 1.1;
      }
      else {
        return;
      }
    }
    this.updateCardRange();
  }

  _onclickedCard() {
    SoundManager.play("sfx_game_click");
    this.cardCharater.updateCardUnlock();
    this.cardCharater.enabled = true;
  }

  resize() {
    super.resize();

    this.newCharacter.resize();
    this.cardCharater.resize();

    this.cardMelee.element.anchor = new Vec4(
      DataManager.getDataReposive().home_arena.card_melee.anchor_x,
      DataManager.getDataReposive().home_arena.card_melee.anchor_y,
      DataManager.getDataReposive().home_arena.card_melee.anchor_x,
      DataManager.getDataReposive().home_arena.card_melee.anchor_y
    );

    this.cardRange.element.anchor = new Vec4(
      DataManager.getDataReposive().home_arena.card_range.anchor_x,
      DataManager.getDataReposive().home_arena.card_range.anchor_y,
      DataManager.getDataReposive().home_arena.card_range.anchor_x,
      DataManager.getDataReposive().home_arena.card_range.anchor_y
    );

    this.coin.element.anchor = new Vec4(
      DataManager.getDataReposive().home_arena.coin.anchor_x,
      DataManager.getDataReposive().home_arena.coin.anchor_y,
      DataManager.getDataReposive().home_arena.coin.anchor_x,
      DataManager.getDataReposive().home_arena.coin.anchor_y);

    this.levelText.element.anchor = new Vec4(
      DataManager.getDataReposive().home_arena.text_level.anchor_x,
      DataManager.getDataReposive().home_arena.text_level.anchor_y,
      DataManager.getDataReposive().home_arena.text_level.anchor_x,
      DataManager.getDataReposive().home_arena.text_level.anchor_y
    );

    this.cardBtn.element.anchor = new Vec4(
      DataManager.getDataReposive().home_arena.ic_card.anchor_x,
      DataManager.getDataReposive().home_arena.ic_card.anchor_y,
      DataManager.getDataReposive().home_arena.ic_card.anchor_x,
      DataManager.getDataReposive().home_arena.ic_card.anchor_y
    );

    this.btnBattle.element.anchor = new Vec4(
      DataManager.getDataReposive().home_arena.btn_battle.anchor_x,
      DataManager.getDataReposive().home_arena.btn_battle.anchor_y,
      DataManager.getDataReposive().home_arena.btn_battle.anchor_x,
      DataManager.getDataReposive().home_arena.btn_battle.anchor_y
    );
  }
}