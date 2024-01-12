import { Color, ELEMENTTYPE_IMAGE, Entity, ELEMENTTYPE_TEXT, Vec4, Vec2 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { Util } from "../../../../helpers/util";
import { HomeRunScreenEvent } from "../../screens/run/homeRunScreen";
import { DataManager } from "../../../data/dataManager";
import { SoundManager } from "../../../../template/soundManager";
import { Game } from "../../../../game";


export class LockChallenge extends Entity {
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
            scale: 0.4,
        });
        this.addChild(this.button_close);

        Util.registerOnTouch(this.button_close.element, () => {
            SoundManager.play("sfx_game_click");
            this.fire(HomeRunScreenEvent.OnTapButtonCloseChallenge);
        });


        this.main = ObjectFactory.createImageElement("lockchallenge", {
            anchor: new pc.Vec4(0.5, 0.4, 0.5, 0.4),
            pivot: new pc.Vec2(0.5, 0.5),
        });
        this.main.element.color = new Color(76 / 255, 76 / 255, 76 / 255),
            this.addChild(this.main);

        var text = new Entity()
        text.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            text: "Unlock Level 7",
            anchor: new Vec4(0.5, 0.35, 0.5, 0.35),
            pivot: new Vec2(0.5, 0.5),
            fontSize: DataManager.getDataReposive().challenge.lock_challenge.textSize,
            fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
        });
        this.addChild(text);

        var textHead = new Entity()
        textHead.addComponent("element", {
            type: ELEMENTTYPE_TEXT,
            text: " DAILY \nCHALLENGE",
            anchor: new Vec4(0.48, 0.85, 0.48, 0.85),
            pivot: new Vec2(0.5, 0.5),
            fontSize: DataManager.getDataReposive().challenge.textSize,
            fontAsset: AssetLoader.getAssetByKey("JandaManateeSolid"),
        });
        this.addChild(textHead);
    }
}