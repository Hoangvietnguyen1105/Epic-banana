import { Entity, Vec4, Vec2, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT } from "playcanvas";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { Util } from "../../../../helpers/util";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { DataManager } from "../../../data/dataManager";
import { ElementLevelRise } from "./elementLevelRise";
import { UserData } from "../../../data/userData";
import { DataLocal } from "../../../data/dataLocal";
import { GameConstant } from "../../../../gameConstant";
import { SceneManager } from "../../../../template/scene/sceneManager";
import { SoundManager } from "../../../../template/soundManager";


export class LevelRise extends Entity {
    constructor() {
        super();
        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: new Vec4(0, 0, 1, 1),
            pivot: new Vec2(0.5, 0.5),
            opacity: 0.6,
            color: Util.createColor(0, 0, 0),
        });

        Util.registerOnTouch(this.element, () => { });

        this.groupElement = [];

        this._initPanel();
        this._initText();
        this._initCloseButton();
        this._initContent();
    }

    _initPanel() {
        this.panel = ObjectFactory.createImageElement("spr_panel_win1", {
            anchor: new Vec4(
                DataManager.getDataReposive().levelRise.anchor_x,
                DataManager.getDataReposive().levelRise.anchor_y,
                DataManager.getDataReposive().levelRise.anchor_x,
                DataManager.getDataReposive().levelRise.anchor_y
            ),
            pivot: new Vec2(0.5, 0.5),
        });
        var scale = DataManager.getDataReposive().levelRise.scale;
        this.panel.setLocalScale(scale, scale, scale);
        this.addChild(this.panel);

        this.scrollViewFrame = ObjectFactory.createImageElement("bg-morefun", {
            anchor: new Vec4(0.5, 0.4, 0.5, 0.4),
            pivot: new Vec2(0.5, 0.5),
            height: 380,
            width: 400,
        });
        this.panel.addChild(this.scrollViewFrame);
    }

    _initText() {
        let text = new Entity();
        text.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.48, 0.84, 0.48, 0.84),
            pivot: new Vec2(0.5, 0.5),
            fontSize: 50,
            text: "LEVEL RISE",
            fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
        });
        this.panel.addChild(text);
    }

    _initCloseButton() {
        this.closeButton = ObjectFactory.createImageElement("btn-x1", {
            anchor: new Vec4(1, 1, 1, 1),
            pivot: new Vec2(0.6, 0.6),
        });
        this.closeButton.setLocalScale(0.3, 0.3, 0.3);
        this.panel.addChild(this.closeButton);

        Util.registerOnTouch(this.closeButton.element, () => {
            SoundManager.play("sfx_game_click");
            this.fire("LevelRise:OnTapButtonClose")
        });
    }

    _initContent() {
        var group = new pc.Entity("Text");
        group.addComponent("element", {
            anchor: new pc.Vec4(0.5, 1, 0.5, 1),
            pivot: new pc.Vec2(0.5, 1),
            type: pc.ELEMENTTYPE_GROUP,
            useInput: true,
        });

        DataManager.getLevelRise().forEach((item, index) => {
            let element = new ElementLevelRise(item.level, item.coin, -(index + 1) * 220 + 20);
            var getCoin = UserData.levelRise[index][0];
            var getCoinAds = UserData.levelRise[index][1];
            element.setting(
                getCoin,
                getCoinAds,
            )

            getCoin && element.once("onGetCoin", (coin) => {
                UserData.currency += coin;
                DataLocal.updateDataByKey(GameConstant.INDEXEDDB_CURRENCY_KEY, UserData.currency)
                SceneManager.updateCoin();
                UserData.levelRise[index][0] = false;
                DataLocal.updateDataListByKey(GameConstant.INDEXEDDB_LEVEL_RISE_KEY, UserData.levelRise)
            });

            getCoinAds && element.once("onGetCoinAds", (coin) => {
                UserData.currency += coin;
                DataLocal.updateDataByKey(GameConstant.INDEXEDDB_CURRENCY_KEY, UserData.currency)
                SceneManager.updateCoin();
                UserData.levelRise[index][1] = false;
                DataLocal.updateDataListByKey(GameConstant.INDEXEDDB_LEVEL_RISE_KEY, UserData.levelRise)
            });
            group.addChild(element);
            this.groupElement.push(element);
        })

        const content = new pc.Entity("Content");
        content.addChild(group);

        content.addComponent("element", {
            anchor: new pc.Vec4(0.5, 1, 0.5, 1),
            height: DataManager.getLevelRise().length * 220 + 30,
            pivot: new pc.Vec2(0.5, 1),
            type: pc.ELEMENTTYPE_GROUP,
            useInput: true,
            width: 600,
        });

        // Scroll view viewport
        const viewport = new pc.Entity("Viewport");
        viewport.addChild(content);

        viewport.addComponent("element", {
            anchor: new pc.Vec4(0, 0, 1, 1),
            color: new pc.Color(0, 1, 0),
            margin: new pc.Vec4(0, 20, 20, 0),
            mask: true,
            opacity: 1,
            pivot: new pc.Vec2(0, 1),
            rect: new pc.Vec4(0, 0, 1, 1),
            type: pc.ELEMENTTYPE_IMAGE,
            useInput: false,
        });

        const scrollview = new pc.Entity("ScrollView");
        scrollview.addChild(viewport);

        this.scrollViewFrame.addChild(scrollview);

        scrollview.addComponent("element", {
            anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
            height: 380,
            pivot: new pc.Vec2(0.5, 0.5),
            type: pc.ELEMENTTYPE_GROUP,
            useInput: false,
            width: 400,
        });

        scrollview.addComponent("scrollview", {
            bounceAmount: 0.5,
            contentEntity: content,
            friction: 0.05,
            useMouseWheel: true,
            mouseWheelSensitivity: pc.Vec2.ONE,
            scrollMode: pc.SCROLL_MODE_CLAMP,
            vertical: true,
            viewportEntity: viewport,
        });
    }

    updateContent() {
        this.groupElement.forEach((element, index) => {
            var getCoin = UserData.levelRise[index][0];
            var getCoinAds = UserData.levelRise[index][1];
            element.setting(
                getCoin,
                getCoinAds,
            )
        })
    }

    checkReward() {
        let isReward = false;
        this.groupElement.forEach((element, index) => {
            var getCoin = UserData.levelRise[index][0];
            var getCoinAds = UserData.levelRise[index][1];
            if (UserData.currentLevel >= element.level) {
                isReward = isReward || getCoin || getCoinAds;
            }
        })
        return isReward;
    }

    resize() {
        this.panel.element.anchor = new Vec4(
            DataManager.getDataReposive().levelRise.anchor_x,
            DataManager.getDataReposive().levelRise.anchor_y,
            DataManager.getDataReposive().levelRise.anchor_x,
            DataManager.getDataReposive().levelRise.anchor_y
        );
        var scale = DataManager.getDataReposive().levelRise.scale;
        this.panel.setLocalScale(scale, scale, scale);
    }

}