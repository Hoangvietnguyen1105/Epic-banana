import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { GameConstant } from "../../../gameConstant";
import { PlayerBananaRunController } from "../../scripts/controllers/playerRunSoliderController";
import { PlayerRunEvent } from "../../scripts/controllers/playerRunSoliderController";


export class BananaRun extends Entity {
    constructor(tag) {
        super("BananaRun");
        this.tag = tag;
        this.isRunning = false;
        this.state = PlayerRunEvent.Idle;

        this._initAnimation();

        this.modelAssetAction = AssetLoader.getAssetByKey("Banana")
        this.addComponent("model", {});
        this.model.asset = this.modelAssetAction;
        this.setEulerAngles(0, 180, 0);
        this.setLocalScale(0.8, 0.8, 0.8);

        this.collider = this.addScript(BoxCollider, {
            tag: this.tag,
            render: GameConstant.DEBUG_COLLIDER,
            scale: new Vec3(1, 2.8, 1),
        });

        this.controller = this.addScript(PlayerBananaRunController, {
            collider: this.collider,
            tag: this.tag,
        });
    }

    _initAnimation() {
        this.addComponent("animation", {
            assets: [
                AssetLoader.getAssetByKey("banana@idle"),
                AssetLoader.getAssetByKey("banana@jump"),
                AssetLoader.getAssetByKey("banana@run"),
                AssetLoader.getAssetByKey("banana@victory")
            ],
            activate: false,
        });
    }

    actionStand() {
        this.state = PlayerRunEvent.Idle;
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

    actionVictory() {
        this.state = PlayerRunEvent.Victory;
        this.setEulerAngles(0, 180, 0);
        this.animation.loop = true;
        this.animation.play("banana@victory");
    }

    actionJump() {
        this.state = PlayerRunEvent.Jump;
        this.animation.loop = false;
        this.animation.play("banana@jump");
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