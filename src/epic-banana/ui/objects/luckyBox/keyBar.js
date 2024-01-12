import { Entity, Vec2, Vec4, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT } from "playcanvas";
import { Util } from "../../../../helpers/util";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { ObjectFactory } from "../../../../template/objects/objectFactory";


export class KeyBar extends Entity {
    constructor(anchor, pivot) {
        super();

        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: anchor || new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: pivot || new Vec2(0.5, 0.5),
            spriteAsset: AssetLoader.getAssetByKey("btn-navy"),
        });

        this.keyGroup = []

        this._initKeys();
    }

    _initKeys() {
        for (var i = 0; i < 3; i++) {
            var key = ObjectFactory.createImageElement("ic-key-2", {
                anchor: new Vec4(0.2 + 0.3 * i, 0.5, 0.2 + 0.3 * i, 0.5),
                pivot: new Vec2(0.5, 0.5),
                scale: 0.65,
            });
            this.addChild(key);

            var keyEnable = ObjectFactory.createImageElement("ic-key", {
                anchor: new Vec4(0.2 + 0.3 * i, 0.5, 0.2 + 0.3 * i, 0.5),
                pivot: new Vec2(0.5, 0.5),
                scale: 0.65,
            });
            this.addChild(keyEnable);
            this.keyGroup.push([key, keyEnable]);

            this.setActiveKey(i + 1, true);
        }
    }

    setActiveKey(index, active = true) {
        this.keyGroup[index - 1][0].enabled = !active;
        this.keyGroup[index - 1][1].enabled = active;
    }

}