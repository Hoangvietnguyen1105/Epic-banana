import { Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { PlayerRunEvent } from "../../scripts/controllers/playerRunSoliderController";


export class Banana extends Entity {
    constructor(tag) {
        super("Banana");
        this.isRunning = false;

        this.modelAssetAction = AssetLoader.getAssetByKey("Banana")
        this.addComponent("model", {});
        this.model.asset = this.modelAssetAction;
        this.setEulerAngles(0, 180, 0);

        this.addComponent("animation", {
            assets: [
                AssetLoader.getAssetByKey("banana@idle"),
                AssetLoader.getAssetByKey("banana@run")
            ],
            speed: 1,
            loop: true,
            activate: true,
        });
    }

    actionStand() {
        this.setEulerAngles(0, 180, 0);
        this.animation.speed = 1;
        this.animation.loop = true;
        this.animation.play("banana@idle");
    }

    actionRun() {
        this.state = PlayerRunEvent.Run;
        this.setEulerAngles(0, 0, 0);

        this.animation.speed = 1.7;
        this.animation.loop = true;
        this.animation.play("banana@run");
    }

    config(data) {
        let position = data.pos;
        let scale = data.scale;
        let rotation = data.rot;
        this.setPosition(position.x, position.y, position.z);
        this.setLocalScale(scale.x, scale.y, scale.z);
        this.setEulerAngles(rotation.x, rotation.y, rotation.z);
    }
}