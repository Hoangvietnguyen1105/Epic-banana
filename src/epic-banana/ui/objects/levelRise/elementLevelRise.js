import { Entity, Vec4, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Vec2, Color } from "playcanvas";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { Util } from "../../../../helpers/util";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { DataManager } from "../../../data/dataManager";
import { SoundManager } from "../../../../template/soundManager";
import { UserData } from "../../../data/userData";
import { Tween } from "../../../../template/systems/tween/tween";
import { GameConstant } from "../../../../gameConstant";
import { AdsManager } from "../../../../../ads/adsManager";
import { AdVideoConfig, AdVideoType } from "../../../../../ads/adsConstant";
import { SceneManager } from "../../../../template/scene/sceneManager";

export class ElementLevelRise extends Entity {
    constructor(level = 1, coin = 0, pos = 0) {
        super();
        this.level = level;
        let asset = AssetLoader.getAssetByKey("level-hexa");
        let frame = Util.getSpriteFrame(asset.resource, 1);
        let width = frame.width;
        let height = frame.height;
        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new pc.Vec2(0.5, 0.5),
            width: width,
            height: height,
            spriteAsset: asset,
            color: new Color(1, 1, 1),
        });

        this.coin = coin;
        this.setLocalScale(0.4, 0.4, 0.4);
        this.setLocalPosition(0, pos, 0);

        this.addChild(this._initText(level));

        let elementBackPath = ObjectFactory.createImageElement("back-path", {
            anchor: new Vec4(0.5, 1, 0.5, 1),
            pivot: new pc.Vec2(0.5, 0.02),
            height: DataManager.getDataReposive().levelRise.element.elementBackPath,
            width: 70,
        })
        this.addChild(elementBackPath);

        this.elementFrontPath = ObjectFactory.createImageElement("front-path", {
            anchor: new Vec4(0.5, 1, 0.5, 1),
            pivot: new pc.Vec2(0.5, 0.02),
            height: DataManager.getDataReposive().levelRise.element.elementBackPath,
            width: 55,
        })
        this.addChild(this.elementFrontPath);

        this.elementLeft = ObjectFactory.createImageElement("btn-navy-small", {
            anchor: new Vec4(-0.15, 0.5, -0.15, 0.5),
            pivot: new pc.Vec2(1, 0.5),
            scale: 1.2,
        })
        this.elementLeft.addChild(this._initCoin(coin));
        this.addChild(this.elementLeft);

        this.elementRight = ObjectFactory.createImageElement("btn-green-small", {
            anchor: new Vec4(1.15, 0.5, 1.15, 0.5),
            pivot: new pc.Vec2(0, 0.5),
            scale: 1.2,
        })
        this.elementRight.addChild(this._initCoin(coin * GameConstant.COIN_ADS));
        this.addChild(this.elementRight);

        var ads = ObjectFactory.createImageElement("ic-ads", {
            anchor: new Vec4(0.9, 0, 0.9, 0),
            pivot: new pc.Vec2(0.5, 0.5),
            scale: 0.85,
        })
        this.elementRight.addChild(ads);

        this.registerEvent();
    }

    registerEvent() {
        Util.registerOnTouch(this.elementLeft.element, () => {
            SoundManager.play("sfx_game_collect_coin");
            if (this.elementLeft.enabled) {
                this.fire("onGetCoin", this.coin);
                this.elementLeft.enabled = false;
            }
        });

        Util.registerOnTouch(this.elementRight.element, () => {
            if (this.elementRight.enabled) {
                let config = new AdVideoConfig();
                config.onStarted = () => {
                    this.elementRight.enabled = false;
                }
                config.onFinished = () => {
                    this.fire("onGetCoinAds", this.coin * 4);
                    this.elementRight.enabled = false;
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

                    this.elementRight.enabled = true;
                }
                AdsManager.showVideo(AdVideoType.REWARDED, config);
            }
        });
    }

    _initCoin(val) {
        var coin = ObjectFactory.createImageElement("ic-coin", {
            anchor: new Vec4(0.2, 0.52, 0.2, 0.52),
            pivot: new pc.Vec2(0.5, 0.5),
            scale: 0.5,
        })


        var text = new Entity();
        text.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(1.35, 0.35, 1.35, 0.35),
            pivot: new Vec2(0, 0.5),
            fontSize: 75,
            text: Util.getCashFormat(val),
            fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
        });
        coin.addChild(text);
        return coin;
    }

    _initText(level) {
        this.text = new Entity();
        this.text.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.43, 0.58, 0.43, 0.58),
            pivot: new Vec2(0.5, 0.5),
            fontSize: 80,
            text: "Level",
            fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
        });

        this.textLevel = new Entity();
        this.textLevel.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.35, -0.1, 0.35, -0.1),
            pivot: new Vec2(0.5, 1),
            text: level,
            fontSize: 100,
            fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
        });
        this.text.addChild(this.textLevel);
        return this.text;
    }

    setting(getCoin = false, getCoinAds = false) {
        let enable = UserData.currentLevel >= this.level;
        this.elementLeft.enabled = getCoin;
        this.elementRight.enabled = getCoinAds;

        if (enable) {
            this.elementFrontPath.enabled = true;
            this.element.color = new Color(1, 1, 1)
            this.text.element.color = new Color(1, 1, 1)
            this.textLevel.element.color = new Color(1, 1, 1)
        }
        else {
            this.elementFrontPath.enabled = false;
            this.element.color = new Color(76 / 255, 76 / 255, 76 / 255)
            this.text.element.color = new Color(76 / 255, 76 / 255, 76 / 255)
            this.textLevel.element.color = new Color(76 / 255, 76 / 255, 76 / 255)
            this.elementLeft.enabled = false;
            this.elementRight.enabled = false;
        }
    }
}