import { Entity, Vec4, ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Vec2 } from "playcanvas";
import { Util } from "../../../../helpers/util";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { ObjectFactory } from "../../../../template/objects/objectFactory";


export class ElementCardCharacter extends Entity {
    constructor(data = {}, image = "", blood = 0, dame = 0) {
        super();

        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            anchor: data.anchor,
            pivot: data.pivot,
        });
        this.setLocalScale(0.55, 0.55, 0.55);
        this.setLocalPosition(data.position);

        this._initCardEnable(image, blood, dame);
        this._initCardDisable(image);
        this.card.enabled = false;
    }

    _initCardEnable(image, blood, dame) {
        this.card = ObjectFactory.createImageElement("frame-char", {
            anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new Vec2(0.5, 0.5),
        });
        this.addChild(this.card);
        let ic_blood = ObjectFactory.createImageElement("ic-heart", {
            anchor: new Vec4(0.16, 0.18, 0.16, 0.18),
            pivot: new Vec2(0.5, 0.5),
            width: 35,
            height: 35,
        });
        this.card.addChild(ic_blood);
        let txt_blood = new Entity();
        txt_blood.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(1.23, 0, 1.23, 0),
            pivot: new Vec2(0, 0),
            fontSize: 32,
            text: Util.getCashFormat(blood),
            color: Util.createColor(255, 255, 255),
            fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
        });
        ic_blood.addChild(txt_blood);

        let ic_dame = ObjectFactory.createImageElement("ic-sword", {
            anchor: new Vec4(0.6, 0.18, 0.6, 0.18),
            pivot: new Vec2(0.5, 0.5),
            width: 35,
            height: 35,
        });
        let txt_dame = new Entity();
        txt_dame.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(1.23, 0, 1.23, 0),
            pivot: new Vec2(0, 0),
            fontSize: 32,
            text: Util.getCashFormat(dame),
            color: Util.createColor(255, 255, 255),
            fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
        });
        ic_dame.addChild(txt_dame);
        this.card.addChild(ic_dame);

        let imageCard = ObjectFactory.createImageElement(image, {
            anchor: new Vec4(0.5, 0.285, 0.5, 0.285),
            pivot: new Vec2(0.5, 0),
        });
        imageCard.setLocalScale(1.4, 1.4, 1.4)
        this.card.addChild(imageCard);
    }

    _initCardDisable(image) {
        this.cardDisable = ObjectFactory.createImageElement("frame-char-2", {
            anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new Vec2(0.5, 0.5),
        });
        this.addChild(this.cardDisable);

        let imageCard = ObjectFactory.createImageElement(image, {
            anchor: new Vec4(0.5, 0.285, 0.5, 0.285),
            pivot: new Vec2(0.5, 0),
        });
        imageCard.element.color = Util.createColor(0, 0, 0);
        imageCard.setLocalScale(1.4, 1.4, 1.4)
        this.cardDisable.addChild(imageCard);

        let ic_lock = ObjectFactory.createImageElement("ic-lock", {
            anchor: new Vec4(0.5, 0.18, 0.5, 0.18),
            pivot: new Vec2(0.5, 0.5),
        });
        ic_lock.setLocalScale(0.8, 0.8, 0.8)
        this.cardDisable.addChild(ic_lock);
    }

    setActive(active) {
        this.card.enabled = active;
        this.cardDisable.enabled = !active;
    }

}