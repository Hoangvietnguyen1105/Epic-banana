import { Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";


export class Arena extends Entity {
    constructor() {
        super();
        this._initMap();
    }

    _initMap() {
        this.arena = new Entity();
        this.arena.addComponent("model", {
            asset: AssetLoader.getAssetByKey("arena"),
            castShadows: false,
        });
        this.arena.setLocalScale(1, 1, 0.8);
        this.addChild(this.arena);

        this.border = new Entity("border");
        this.border.addComponent("model", {
            asset: AssetLoader.getAssetByKey("arenaborder"),
            castShadows: false,
        });
        this.border.setLocalScale(1, 0.2, 0.8);
        this.addChild(this.border);
    }

    config(data) {
        let pos = data.pos;
        let rot = data.rot;
        let scale = data.scale;
        this.setLocalPosition(pos.x, pos.y, pos.z);
        this.setLocalEulerAngles(rot.x, rot.y, rot.z);
        this.setLocalScale(scale.x, scale.y, scale.z);
    }
}