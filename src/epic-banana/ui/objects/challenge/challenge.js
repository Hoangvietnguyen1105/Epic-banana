import { Color, ELEMENTTYPE_IMAGE, Entity, ELEMENTTYPE_TEXT, Vec4, Vec2 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { Util } from "../../../../helpers/util";
import { HomeRunScreenEvent } from "../../screens/run/homeRunScreen";
import { DataManager } from "../../../data/dataManager";
import { SoundManager } from "../../../../template/soundManager";
import { AdsManager } from "../../../../../ads/adsManager";
import { GameState, GameStateManager } from "../../../../template/gameStateManager";
import { AdVideoConfig, AdVideoType } from "../../../../../ads/adsConstant";
import { SceneManager } from "../../../../template/scene/sceneManager";
import { GameConstant } from "../../../../gameConstant";
import { Tween } from "../../../../template/systems/tween/tween";


export class Challenge extends Entity {
    constructor() {
        super();

        let asset = AssetLoader.getAssetByKey("frame_challenge");
        let frame = Util.getSpriteFrame(asset.resource, 1);

        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new pc.Vec2(0.5, 0.5),
            spriteAsset: asset,
            width: frame.width,
            height: frame.height,
        });

        this.button_close = ObjectFactory.createImageElement("btn-x1", {
            anchor: new pc.Vec4(1, 1, 1, 1),
            pivot: new pc.Vec2(0.8, 0.8),
        });
        this.button_close.setLocalScale(0.4, 0.4, 0.4);
        this.addChild(this.button_close);

        Util.registerOnTouch(this.button_close.element, () => {
            SoundManager.play("sfx_game_click");
            this.fire(HomeRunScreenEvent.OnTapButtonCloseChallenge);
        });

        this.main = ObjectFactory.createImageElement("lockchallenge", {
            anchor: new pc.Vec4(0.5, 0.4, 0.5, 0.4),
            pivot: new pc.Vec2(0.5, 0.5),
        });
        this.addChild(this.main);

        var text = new Entity()
        text.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            text: " DAILY \nCHALLENGE",
            anchor: new Vec4(0.48, 0.85, 0.48, 0.85),
            pivot: new Vec2(0.5, 0.5),
            fontSize: DataManager.getDataReposive().challenge.textSize,
            fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
        });
        this.addChild(text);

        this._initButtonStart();
    }

    _initButtonStart() {
        this.button_start = ObjectFactory.createImageElement("spr_btn_yellow_big", {
            anchor: new pc.Vec4(0.2, 0.2, 0.2, 0.2),
            pivot: new pc.Vec2(0.5, 0.5),
        });
        this.button_start.setLocalScale(0.6, 0.6, 0.6);

        this.ic_ads = ObjectFactory.createImageElement("ic-ads", {
            anchor: new pc.Vec4(1, 1, 1, 1),
            pivot: new pc.Vec2(0.5, 0.5),
        });
        this.ic_ads.setLocalScale(0.6, 0.6, 0.6);
        this.button_start.addChild(this.ic_ads);

        let text = new Entity();
        text.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            text: "START",
            anchor: new Vec4(0.45, 0.3, 0.45, 0.3),
            pivot: new Vec2(0.5, 0.5),
            fontSize: DataManager.getDataReposive().challenge.textSize_start,
            fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
        });
        this.button_start.addChild(text);

        this.main.addChild(this.button_start);
        Util.registerOnTouch(this.button_start.element, this._onTapButtonStart, this);
    }

    _onTapButtonStart() {
        SoundManager.play("sfx_game_click");
        GameStateManager.state = GameState.Challenge;
        let adVideoConfig = new AdVideoConfig();
        adVideoConfig.onFinished = () => {
            this.fire(HomeRunScreenEvent.OnStartChallenge);
            this.fire(HomeRunScreenEvent.OnTapButtonCloseChallenge);
        }
        adVideoConfig.onError = (err) => {
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
        }
        AdsManager.showVideo(AdVideoType.REWARDED, adVideoConfig)
    }
}