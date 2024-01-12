import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { Tween } from "../../../../template/systems/tween/tween";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";

export class TrapFlipL extends Entity {
    constructor() {
        super();

        this.addComponent("model", {
            asset: AssetLoader.getAssetByKey("Trap_Flip_L"),
        });

        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.Barrier,
            render: GameConstant.DEBUG_COLLIDER,
            scale: new Vec3(0.5, 2.3, 1.32),
            position: new Vec3(0, 0.878, 0)
        });

        if (Math.random() < 0.5) {
            this.setEulerAngles(0, 0, -90);

            this.tween = Tween.createRotateTween(this, { z: 90 }, {
                duration: 3,
                // easing: Tween.Easing.Quadratic.Out,
                loop: true,
                yoyo: true,
            });
            this.on(SpawningEvent.Despawn, this.stop, this);
            this.on(SpawningEvent.Spawn, this.play, this);
        }
        else {
            this.setEulerAngles(0, 0, 90);

            this.tween = Tween.createRotateTween(this, { z: -90 }, {
                duration: 3,
                // easing: Tween.Easing.Quadratic.Out,
                loop: true,
                yoyo: true,
            });
            this.on(SpawningEvent.Despawn, this.stop, this);
            this.on(SpawningEvent.Spawn, this.play, this);
        }
    }

    play() {
        this.tween.start();
        this.collider && this.collider.enable();
    }

    stop() {
        this.tween.stop();
        this.collider && this.collider.disable();
    }

    config(data) {
        let pos = data.pos;
        let rot = data.rot;
        let scale = data.scale;
        this.setPosition(pos.x, pos.y, pos.z);
        this.setEulerAngles(rot.x, rot.y, rot.z);
        this.setLocalScale(scale.x, scale.y, scale.z);
    }
}