import { Entity, Vec2, Vec4, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT } from "playcanvas";
import { Util } from "../../../../helpers/util";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { ObjectFactory } from "../../../../template/objects/objectFactory";


export class ChestBox extends Entity {
    constructor(anchor, pivot, coin = 20000) {
        super();

        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: anchor || new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: pivot || new Vec2(0.5, 0.5),
            spriteAsset: AssetLoader.getAssetByKey("frame-small-1"),
        });

        this.coinValue = coin;

        this.setLocalScale(0.5, 0.5, 0.5);

        this._initBg();
        this._initChest();
        this._initCoin(coin);

        this.setActiveCoin(false);
    }

    _initBg() {
        this.bg = ObjectFactory.createImageElement("frame-small-1", {
            anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new Vec2(0.5, 0.5),
        });
        this.addChild(this.bg);
    }

    _initChest() {
        this.chest = ObjectFactory.createImageElement("i_chest_big", {
            anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new Vec2(0.5, 0.5),
        });
        this.chest.setLocalScale(0.8, 0.8, 0.8);
        this.addChild(this.chest);
        this.chest.enabled = false;
    }

    _initCoin(coin) {
        this.coin = ObjectFactory.createImageElement("ic-coin", {
            anchor: new Vec4(0.5, 0.65, 0.5, 0.65),
            pivot: new Vec2(0.5, 0.5),
        });
        this.addChild(this.coin);
        this.coin.setLocalScale(0.8, 0.8, 0.8);

        this.coinText = new Entity();
        this.coinText.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.47, -0.2, 0.47, -0.2),
            pivot: new Vec2(0.5, 1),
            fontSize: 110,
            text: Util.getCashFormat(coin),
            fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
            color: Util.createColor(255, 255, 255),
            outlineThickness: 0.6,
            outlineColor: Util.createColor(0, 0, 0)
        });
        this.coin.addChild(this.coinText);
    }

    setActiveCoin(isActive) {
        if (this.chest.enabled !== isActive) return false;
        this.chest.enabled = !isActive;
        this.coin.enabled = isActive;
        this.coinText.enabled = isActive;
        return true;
    }

    setCoin(coin) {
        this.coinValue = coin;
        this.coinText.element.text = Util.getCashFormat(this.coinValue);
    }
}