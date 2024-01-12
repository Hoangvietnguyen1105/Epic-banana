import { ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Vec2, Vec4 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { DataManager } from "../../data/dataManager";

export class NumberCharacterBar extends Entity {
    constructor() {
        super();

        this.addComponent("element", {
            type: ELEMENTTYPE_IMAGE,
            opacity: 0,
        });
        this._initBody();
    }

    _initBody() {
        this.tag = ObjectFactory.createImageElement("tag", {
            anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new Vec2(0.5, 0.5),
        });
        this.addChild(this.tag);
        this.tag.setLocalPosition(
            DataManager.getDataReposive().numberCharacterBar.pos[0],
            DataManager.getDataReposive().numberCharacterBar.pos[1],
            DataManager.getDataReposive().numberCharacterBar.pos[2],
        );
        this.tag.setLocalScale(
            DataManager.getDataReposive().numberCharacterBar.scale,
            DataManager.getDataReposive().numberCharacterBar.scale,
            DataManager.getDataReposive().numberCharacterBar.scale,
        );

        this.text = new Entity();
        this.text.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
            pivot: new Vec2(0.5, 0.5),
            fontSize: 44,
            autoWidth: true,
            autoHeight: true,
            fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
            text: "1",
        });
        this.tag.addChild(this.text);
    }

    setText(number) {
        this.text.element.text = number;
    }

    resize() {
        this.tag.setLocalPosition(
            DataManager.getDataReposive().numberCharacterBar.pos[0],
            DataManager.getDataReposive().numberCharacterBar.pos[1],
            DataManager.getDataReposive().numberCharacterBar.pos[2],
        );
        this.tag.setLocalScale(
            DataManager.getDataReposive().numberCharacterBar.scale,
            DataManager.getDataReposive().numberCharacterBar.scale,
            DataManager.getDataReposive().numberCharacterBar.scale,
        );
    }
}
