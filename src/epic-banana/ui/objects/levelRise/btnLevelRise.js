import { Entity, Vec2, Vec4, ELEMENTTYPE_TEXT, ELEMENTTYPE_IMAGE } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { Util } from "../../../../helpers/util";
import { ObjectFactory } from "../../../../template/objects/objectFactory";


export class ButtonLevelRise extends Entity {
    constructor(data = {}) {
        super();
        let asset = AssetLoader.getAssetByKey("btn-lvl-rise");
        let x = data.x || 0;
        let y = data.y || 0;
        let z = data.z || 0;
        let scale = data.scale || 1;
        let opacity = data.opacity || 1;
        let anchor = data.anchor || new Vec4(0.5, 0.5, 0.5, 0.5);
        let pivot = data.pivot || new Vec2(0.5, 0.5);
        let frame = Util.getSpriteFrame(asset.resource, scale);
        let width = data.width || frame.width;
        let height = data.height || frame.height;
        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            spriteAsset: asset,
            anchor: anchor,
            pivot: pivot,
            opacity: opacity,
            width,
            height,
        });
        this.setLocalPosition(x, y, z);

        this._initText();

        this._initDot();
    }

    _initText() {
        this.text = new Entity();
        this.text.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.45, 0.16, 0.45, 0.16),
            pivot: new Vec2(0.5, 0.5),
            fontSize: 50,
            text: "Level rise",
            fontAsset: AssetLoader.getAssetByKey("font_ariston_comic"),
        });
        this.addChild(this.text);
    }

    _initDot() {
        this.dot = ObjectFactory.createImageElement("dot", {
            anchor: new Vec4(0.8, 0.9, 0.8, 0.9),
            pivot: new Vec2(0.5, 0.5),
        });
        this.addChild(this.dot);
    }

    setDotActive(active = false) {
        this.dot.enabled = active;
    }
}