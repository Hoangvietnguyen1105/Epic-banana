import { ELEMENTTYPE_IMAGE, Entity, ELEMENTTYPE_TEXT, Vec4, Vec2 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { Util } from "../../../../helpers/util";
import { DataLocal } from "../../../data/dataLocal";
import { UserData } from "../../../data/userData";
import { GameConstant } from "../../../../gameConstant";
import { DataManager } from "../../../data/dataManager";
import { SceneManager } from "../../../../template/scene/sceneManager";
import { SoundManager } from "../../../../template/soundManager";
import { Tween } from "../../../../template/systems/tween/tween";
import { Spawner } from "../../../scripts/spawners/spawner";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";


export class CardCharacterReward extends Entity {
    constructor(coinCard) {
        super();
        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: new Vec4(0, 0, 1, 1),
            pivot: new Vec2(0.5, 0.5),
            color: Util.createColor(0, 0, 0),
            opacity: 0.6,
        });
        this.coinCard = coinCard;
        this.card = ObjectFactory.createImageElement("frame-char-2", {
            anchor: new Vec4(0.5, 0.65, 0.5, 0.65),
            pivot: new Vec2(0.5, 0.5),
        });
        this.card.setLocalScale(0.8, 0.8, 0.8);
        this.addChild(this.card);

        this.cardRange = ObjectFactory.createImageElement("ic-card-arrow", {
            anchor: new Vec4(0.5, 0.6, 0.5, 0.6),
            pivot: new Vec2(0.5, 0.5),
        });
        this.cardRange.setLocalScale(1.5, 1.5, 1.5)
        this.card.addChild(this.cardRange);

        this.cardMelee = ObjectFactory.createImageElement("ic-card-sword", {
            anchor: new Vec4(0.5, 0.6, 0.5, 0.6),
            pivot: new Vec2(0.5, 0.5),
        });
        this.cardMelee.setLocalScale(1.5, 1.5, 1.5)
        this.card.addChild(this.cardMelee);

        this.cardCoin = ObjectFactory.createImageElement("ic-coin", {
            anchor: new Vec4(0.5, 0.6, 0.5, 0.6),
            pivot: new Vec2(0.5, 0.5),
        });
        this.cardMelee.setLocalScale(1.8, 1.8, 1.8)
        this.card.addChild(this.cardCoin);

        this.textNumber = new Entity();
        this.textNumber.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.5, 0.15, 0.5, 0.15),
            pivot: new Vec2(0.5, 0.5),
            fontSize: 52,
            autoWidth: true,
            autoHeight: true,
            fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
            color: Util.createColor(247, 247, 0),
            text: "5",
        });
        this.card.addChild(this.textNumber);

        this._initButtonGet();

        this.activeRewardCoin(15);
        this._initIncomeText();
        this._initCoinSpawner();
        this._initCardMeleeSpawner();
        this._initCardRangeSpawner();
    }

    _initButtonGet() {
        this.btnGet = ObjectFactory.createImageElement("spr_btn_yellow_big", {
            anchor: new Vec4(
                DataManager.getDataReposive().spin.getReward.button_get.anchor_x,
                DataManager.getDataReposive().spin.getReward.button_get.anchor_y,
                DataManager.getDataReposive().spin.getReward.button_get.anchor_x,
                DataManager.getDataReposive().spin.getReward.button_get.anchor_y
            ),
        });
        this.btnGet.setLocalScale(1.2, 1.2, 1.2);
        this.btnGet.setLocalPosition(0, 0, 0);
        this.addChild(this.btnGet);
        let textTryAgain = new Entity();
        textTryAgain.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.5, 0.6, 0.5, 0.6),
            pivot: new Vec2(0.5, 0.5),
            fontSize: 62,
            autoWidth: true,
            autoHeight: true,
            fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
            text: "Get",
        });
        this.btnGet.addChild(textTryAgain);
        Util.registerOnTouch(this.btnGet.element, this._onTapButtonGet, this);
    }

    _onTapButtonGet() {
        SoundManager.play("sfx_game_collect_coin");
        if (this.cardCoin.enabled) {
            this.playCoinEffect(this.number, this.coinSpawner);
        }
        else {
            if (this.cardMelee.enabled) {
                UserData.stackMelee += parseFloat(this.number);
                DataLocal.updateDataByKey(GameConstant.INDEXEDDB_STACK_MELEE_KEY, UserData.stackMelee);
                this.playEffect(this.number, this.cardMeleeSpawner);
            }
            else {
                UserData.stackRange += this.number;
                DataLocal.updateDataByKey(GameConstant.INDEXEDDB_STACK_RANGE_KEY, UserData.stackRange);
                this.playEffect(this.number, this.cardRangeSpawner);
            }
        }


    }

    activeRewardRange(number) {
        this.number = number;
        this.cardRange.enabled = true;
        this.cardMelee.enabled = false;
        this.cardCoin.enabled = false;
        this.textNumber.element.text = number;
    }

    activeRewardMelee(number) {
        this.number = number;
        this.cardRange.enabled = false;
        this.cardMelee.enabled = true;
        this.cardCoin.enabled = false;
        this.textNumber.element.text = number;
    }

    activeRewardCoin(number) {
        this.number = number;
        this.cardRange.enabled = false;
        this.cardMelee.enabled = false;
        this.cardCoin.enabled = true;
        this.textNumber.element.text = number;
    }

    playCoinEffect(value, spawner) {
        this.incomeText.enabled = true;
        let targetPos = this.coinCard().getPosition().clone();
        let index = 0;
        let totalSpawn = GameConstant.TOTAL_MONEY_SPAWN
        let valueStep = value / totalSpawn;
        this.incomeText.element.text = "+" + value.toFixed(1);
        for (let i = 0; i < totalSpawn; i++) {
            let money = spawner.spawn(this.effectEntity);
            money.setPosition(this.cardCoin.getPosition());
            money.element.anchor.set(0.5, 0.5, 0.5, 0.5);
            Tween.createGlobalTranslateTween(money, targetPos, {
                duration: 0.5,
                delay: (totalSpawn - i) * 0.05,
                onComplete: () => {
                    UserData.currency += valueStep;
                    this.coinCard().text.element.text = Util.getCashFormat(UserData.currency);
                    index++;
                    money.fire(SpawningEvent.Despawn);
                    if (index >= GameConstant.TOTAL_MONEY_SPAWN) {
                        this.incomeText.enabled = false;
                        DataLocal.updateDataByKey(GameConstant.INDEXEDDB_CURRENCY_KEY, UserData.currency);
                        SceneManager.updateCoin();
                        this.fire("CardCharacterReward:OnTapButtonGet");
                    }
                }
            }).start();
        }
    }

    playEffect(value, spawner) {
        this.incomeText.enabled = true;
        let targetPos = this.coinCard().getPosition().clone();
        let index = 0;
        var totalSpawn = value;
        this.incomeText.element.text = "+" + value.toFixed(1);
        for (let i = 0; i < value; i++) {
            let money = spawner.spawn(this.effectEntity);
            money.setPosition(this.cardCoin.getPosition());
            money.element.anchor.set(0.5, 0.5, 0.5, 0.5);
            Tween.createGlobalTranslateTween(money, targetPos, {
                duration: 0.5,
                delay: (totalSpawn - i) * 0.05,
                onComplete: () => {
                    index++;
                    money.fire(SpawningEvent.Despawn);
                    if (index >= totalSpawn) {
                        this.fire("CardCharacterReward:OnTapButtonGet");
                        this.incomeText.enabled = false;
                    }
                }
            }).start();
        }
    }

    _initIncomeText() {
        this.effectEntity = new Entity("effectEntity");
        this.addChild(this.effectEntity);
        this.incomeText = new Entity("incomeText");
        this.incomeText.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.6, 0.5, 0.6, 0.5),
            pivot: new Vec2(0, 0.5),
            fontSize: 96,
            autoWidth: true,
            autoHeight: true,
            fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
            text: "+10000",
            color: Util.createColor(255, 255, 255),
        });
        this.effectEntity.addChild(this.incomeText);
        this.incomeText.enabled = false;
    }

    _initCoinSpawner() {
        let moneyEntity = new Entity("moneySpawner");
        this.addChild(moneyEntity);
        this.coinSpawner = moneyEntity.addScript(Spawner, {
            class: Coin,
            poolSize: 10,
        });
        this.coinSpawner.initialize();
    }

    _initCardMeleeSpawner() {
        let cardMeleeEntity = new Entity("cardMeleeSpawner");
        this.addChild(cardMeleeEntity);
        this.cardMeleeSpawner = cardMeleeEntity.addScript(Spawner, {
            class: CardMelee,
            poolSize: 10,
        });
        this.cardMeleeSpawner.initialize();
    }

    _initCardRangeSpawner() {
        let cardRangeEntity = new Entity("cardRangeSpawner");
        this.addChild(cardRangeEntity);
        this.cardRangeSpawner = cardRangeEntity.addScript(Spawner, {
            class: CardRange,
            poolSize: 10,
        });
        this.cardRangeSpawner.initialize();
    }

    resize() {
        this.btnGet.element.anchor = new Vec4(
            DataManager.getDataReposive().spin.getReward.button_get.anchor_x,
            DataManager.getDataReposive().spin.getReward.button_get.anchor_y,
            DataManager.getDataReposive().spin.getReward.button_get.anchor_x,
            DataManager.getDataReposive().spin.getReward.button_get.anchor_y
        );
    }
}

export class Coin extends Entity {
    constructor() {
        super("coinUI");
        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new Vec2(0.5, 0.5),
            spriteAsset: AssetLoader.getAssetByKey("ic-coin"),
        });
        this.on(SpawningEvent.Spawn, () => {
            this.setLocalScale(0.5, 0.5, 0.5);
            Tween.createScaleTween(this, { x: 3, y: 3, z: 3 }, {
                duration: 0.3,
                easing: Tween.Easing.Sinusoidal.InOut,
            }).start();
        });
        this.setLocalScale(0.5, 0.5, 0.5);
    }
}

export class CardMelee extends Entity {
    constructor() {
        super("cardMeleeUI");
        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new Vec2(0.5, 0.5),
            spriteAsset: AssetLoader.getAssetByKey("ic-card-sword"),
        });
        this.on(SpawningEvent.Spawn, () => {
            this.setLocalScale(0.5, 0.5, 0.5);
            Tween.createScaleTween(this, { x: 3, y: 3, z: 3 }, {
                duration: 0.3,
                easing: Tween.Easing.Sinusoidal.InOut,
            }).start();
        });
        this.setLocalScale(0.5, 0.5, 0.5);
    }
}

export class CardRange extends Entity {
    constructor() {
        super("cardRangeUI");
        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new Vec2(0.5, 0.5),
            spriteAsset: AssetLoader.getAssetByKey("ic-card-arrow"),
        });
        this.on(SpawningEvent.Spawn, () => {
            this.setLocalScale(0.5, 0.5, 0.5);
            Tween.createScaleTween(this, { x: 3, y: 3, z: 3 }, {
                duration: 0.3,
                easing: Tween.Easing.Sinusoidal.InOut,
            }).start();
        });
        this.setLocalScale(0.5, 0.5, 0.5);
    }
}