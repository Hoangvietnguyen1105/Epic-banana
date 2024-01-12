import { Vec4, Vec2, Entity, ELEMENTTYPE_IMAGE } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { Util } from "../../../../helpers/util";

export class OnOff extends Entity {
    constructor(anchor = new Vec4(0.5, 0.5, 0.5, 0.5)) {
        super();

        let asset = AssetLoader.getAssetByKey("frame-option");
        let frame = Util.getSpriteFrame(asset.resource, 0.7);

        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: anchor,
            pivot: new Vec2(0.5, 0.5),
            spriteAsset: asset,
            width: frame.width,
            height: frame.height,
        });

        this.btn_on = ObjectFactory.createImageElement("btn-on", {
            anchor: new Vec4(0.1, 0.5, 0.1, 0.5),
            pivot: new Vec2(0.5, 0.5),
            scale: 0.7,
        });
        this.addChild(this.btn_on);
        this.btn_on.enabled = true;

        this.text_on = ObjectFactory.createTextElement({
            text: "On",
            fontText: AssetLoader.getAssetByKey("JandaManateeSolid"),
            anchor: new Vec4(0.69, 0.5, 0.69, 0.5),
            pivot: new Vec2(0.5, 0.5),
            color: new pc.Color(0, 1, 0),
            fontSize: 35,
        });
        this.addChild(this.text_on);
        this.text_on.enabled = true;

        this.btn_off = ObjectFactory.createImageElement("btn-off", {
            anchor: new Vec4(0.9, 0.5, 0.9, 0.5),
            pivot: new Vec2(0.5, 0.5),
            scale: 0.7,
        });
        this.addChild(this.btn_off);
        this.btn_off.enabled = false;

        this.text_off = ObjectFactory.createTextElement({
            text: "Off",
            fontText: AssetLoader.getAssetByKey("JandaManateeSolid"),
            anchor: new Vec4(0.3, 0.5, 0.3, 0.5),
            pivot: new Vec2(0.5, 0.5),
            color: new pc.Color(1, 0, 0),
            fontSize: 35,
        });
        this.addChild(this.text_off);
        this.text_off.enabled = false;
    }

    setOnOff() {
        this.btn_on.enabled = !this.btn_on.enabled;
        this.text_on.enabled = !this.text_on.enabled;
        this.btn_off.enabled = !this.btn_off.enabled;
        this.text_off.enabled = !this.text_off.enabled;

        return this.btn_on.enabled;
    }
}