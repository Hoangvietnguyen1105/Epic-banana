import { Entity } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";


export class SideColumn extends Entity {
    constructor() {
        super();
        this.addComponent("model", {
            type: "box",
            material: AssetLoader.getAssetByKey("mat_side_column").resource,
            castShadows: false,
            receiveShadows: false,
        });
        this.setLocalScale(0.08, 1, 0.05);
    }
}
