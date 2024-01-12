import { Entity, Vec4, Vec2, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT } from "playcanvas";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { Util } from "../../../../helpers/util";
import { DataManager } from "../../../data/dataManager";
import { SoundManager } from "../../../../template/soundManager";
import stat from "../../../../../assets/jsons/stat.json"
import { DataLocal } from "../../../data/dataLocal";
import { GameConstant } from "../../../../gameConstant";
import { UserData } from "../../../data/userData";
import { Tween } from "../../../../template/systems/tween/tween";

export class NewCharacterUI extends Entity {
    constructor() {
        super("NewCharacterUI");

        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: new Vec4(0, 0, 1, 1),
            pivot: new Vec2(0.5, 0.5),
            opacity: 0.6,
            color: Util.createColor(0, 0, 0),
        });

        this.groupElementMelee = [];
        this.groupElementRange = [];
        this._initPanel();
        this._initText();
        this._initCloseButton();
        this._initCard();
        this._initButtonCool();
        this.initInfoCard();

        this.configData(stat.melee[8]);
    }

    _initPanel() {
        this.panel = ObjectFactory.createImageElement("frameCard", {
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
            anchor: new Vec4(0.47, 0.87, 0.47, 0.87),
            pivot: new Vec2(0.5, 0.5),
            fontSize: 40,
            text: "New Character",
            fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
            outlineThickness: 0.4,
            outlineColor: Util.createColor(0, 0, 0),
        });
        this.panel.addChild(text);
    }

    _initCloseButton() {
        this.closeButton = ObjectFactory.createImageElement("btn-x1", {
            anchor: new Vec4(1, 1, 1, 1),
            pivot: new Vec2(0.8, 0.8),
        });
        this.closeButton.setLocalScale(0.45, 0.45, 0.45);
        this.panel.addChild(this.closeButton);

        Util.registerOnTouch(this.closeButton.element, () => {
            SoundManager.play("sfx_game_click");
            this.parent.closeNewCharacterUI();
        });
    }

    _initButtonCool() {
        this.buttonCool = ObjectFactory.createImageElement("btn-green-small", {
            anchor: new Vec4(0.5, 0.11, 0.5, 0.11),
            pivot: new Vec2(0.5, 0.5),
        });
        this.buttonCool.setLocalScale(0.8, 0.8, 0.8);
        this.panel.addChild(this.buttonCool);

        Util.registerOnTouch(this.buttonCool.element, () => {
            this.parent.closeNewCharacterUI();
            SoundManager.play("sfx_game_click");
        });

        var text = new Entity();
        text.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.45, 0.45, 0.45, 0.45),
            pivot: new Vec2(0.5, 0.5),
            fontSize: 76,
            text: "Cool",
            fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
        });

        this.buttonCool.addChild(text);
    }

    _initCard() {
        this.card = ObjectFactory.createImageElement("frame-new-char", {
            anchor: new Vec4(0.5, 0.55, 0.5, 0.55),
            pivot: new Vec2(0.5, 0.5),
        });
        this.card.setLocalScale(0.7, 0.7, 0.7);
        this.panel.addChild(this.card);

        this.contentCard = new Entity();
        this.contentCard.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: new Vec4(0.47, 0, 0.47, 0),
            pivot: new Vec2(0.5, 0),
            spriteAsset: AssetLoader.getAssetByKey("cat_3"),
        });
        this.contentCard.setLocalScale(12, 12, 12);
        this.card.addChild(this.contentCard);
    }

    initInfoCard() {
        var dame = ObjectFactory.createImageElement("frame-small-newchar", {
            anchor: new Vec4(0.3, 0.25, 0.3, 0.25),
            pivot: new Vec2(0.5, 0.5),
            scale: 0.7,
        });
        this.panel.addChild(dame);

        var iconDame = ObjectFactory.createImageElement("ic-sword", {
            anchor: new Vec4(0.2, 0.5, 0.2, 0.5),
            pivot: new Vec2(0.5, 0.5),
            width: 40,
            height: 40,
        });
        dame.addChild(iconDame);
        this.textDame = new Entity();
        this.textDame.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.55, 0.26, 0.55, 0.26),
            pivot: new Vec2(0.5, 0.5),
            fontSize: 40,
            text: "1000",
            fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
        });
        dame.addChild(this.textDame);

        var hp = ObjectFactory.createImageElement("frame-small-newchar", {
            anchor: new Vec4(0.7, 0.25, 0.7, 0.25),
            pivot: new Vec2(0.5, 0.5),
            scale: 0.7,
        });
        this.panel.addChild(hp);

        var iconHp = ObjectFactory.createImageElement("ic-heart", {
            anchor: new Vec4(0.2, 0.5, 0.2, 0.5),
            pivot: new Vec2(0.5, 0.5),
            width: 40,
            height: 40,
        });
        hp.addChild(iconHp);

        this.textHp = new Entity();
        this.textHp.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.55, 0.26, 0.55, 0.26),
            pivot: new Vec2(0.5, 0.5),
            fontSize: 40,
            text: "1000",
            fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
        });
        hp.addChild(this.textHp);
    }

    configData(data) {
        this.textDame.element.text = data.dame;
        this.textHp.element.text = data.hp;
        this.contentCard.element.spriteAsset = AssetLoader.getAssetByKey(data.image);
    }

    updateLocal() {
        DataLocal.updateDataByKey(GameConstant.LEVEL_RANGE_UNLOCK, UserData.levelRangeUnlock);
        DataLocal.updateDataByKey(GameConstant.LEVEL_MELEE_UNLOCK, UserData.levelMeleeUnlock);
    }

    show() {
        SoundManager.play("sfx_popup_new_character");
        var scale = this.panel.getLocalScale().clone();
        this.panel.setLocalScale(0.1, 0.1, 0.1);

        Tween.createScaleTween(this.panel, { x: scale.x, y: scale.y, z: scale.z }, {
            duration: 0.2,
            onComplete: () => {
                this.panel.setLocalScale(scale)
            }
        }).start();
    }

    hide() {
        var scale = this.panel.getLocalScale().clone();
        Tween.createScaleTween(this.panel, { x: 0.1, y: 0.1, z: 0.1 }, {
            duration: 0.2,
            onComplete: () => {
                this.enabled = false;
                this.panel.setLocalScale(scale.x, scale.y, scale.z);
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