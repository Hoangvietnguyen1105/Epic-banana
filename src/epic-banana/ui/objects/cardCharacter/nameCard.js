import { Entity, Vec4, Vec2, ELEMENTTYPE_TEXT, ELEMENTTYPE_IMAGE } from "playcanvas";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { Util } from "../../../../helpers/util";
import { AssetLoader } from "../../../../assetLoader/assetLoader";


export class NameCard extends Entity {
    constructor(text = "", data = {}) {
        super();
        let anchor = data.anchor || new Vec4(0.5, 0.5, 0.5, 0.5);
        let pivot = data.pivot || new Vec2(0.5, 0.5);
        let scale = data.scale || 1;
        let frame = Util.getSpriteFrame(AssetLoader.getAssetByKey("frame-active").resource, 1);
        let width = frame.width;
        let height = frame.height;
        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: anchor,
            pivot: pivot,
            opacity: 0,
            width: width * 0.9,
            height: height * 0.9,
        });
        this.setLocalScale(scale, scale, scale);

        this.nameCardActive = ObjectFactory.createImageElement("frame-active", {
            anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new pc.Vec2(0.5, 0.5),
        });
        this.addChild(this.nameCardActive);
        this.textCardActive = new Entity();
        this.textCardActive.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new Vec2(0.8, 1),
            fontSize: 42,
            text: text,
            color: Util.createColor(255, 255, 255),
            fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
            outlineThickness: 0.4,
            outlineColor: Util.createColor(0, 0, 0),
        });
        this.nameCardActive.addChild(this.textCardActive);

        this.nameCardDeactive = ObjectFactory.createImageElement("frame-disable", {
            anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new Vec2(0.5, 0.5),
        });
        this.addChild(this.nameCardDeactive);
        this.textCardDeactive = new Entity();
        this.textCardDeactive.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new Vec2(0.8, 1),
            fontSize: 42,
            text: text,
            color: Util.createColor(0, 0, 0),
            fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
        });
        this.nameCardDeactive.addChild(this.textCardDeactive);

        this.nameCardActive.enabled = false;
    }

    setActive(active) {
        this.nameCardActive.enabled = active;
        this.nameCardDeactive.enabled = !active;
    }
}