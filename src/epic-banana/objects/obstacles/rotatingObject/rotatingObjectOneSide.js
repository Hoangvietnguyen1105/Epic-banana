import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { Rotate } from "../../../scripts/components/rotate";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";


export class RotatingObjectOneSide extends Entity {
    constructor() {
        super();

        this.left = new Entity();
        this.left.addComponent("model", { asset: AssetLoader.getAssetByKey("xoay2") });
        this.addChild(this.left);
        this.left.collider = this.left.addScript(BoxCollider, {
            tag: CollisionTag.Barrier,
            render: GameConstant.DEBUG_COLLIDER,
            scale: new Vec3(0.41, 0.56, 2.322),
            position: new Vec3(0, 0, 0)
        });
        this.left.setLocalPosition(-1.856, 0.303, 0);
        this.left.setEulerAngles(0, -270, 0);
        this.left.setLocalScale(1.2, 1.2, 1.5);

        this.center = new Entity();
        this.center.addComponent("model", {
            type: "cylinder",
            material: AssetLoader.getAssetByKey("mat_midle_rotating").resource,
        });
        this.addChild(this.center);
        this.center.setLocalScale(0.5, 1, 0.5);
        this.center.collider = this.center.addScript(BoxCollider, {
            tag: CollisionTag.Barrier,
            render: GameConstant.DEBUG_COLLIDER,
            scale: new Vec3(0.7, 1, 0.7),
            position: new Vec3(0, 0, 0)
        });

        this.rot = this.addScript(Rotate, {
            speed: new Vec3(0, -150, 0),
        });
        this.on(SpawningEvent.Despawn, this.stop, this);
        this.on(SpawningEvent.Spawn, this.play, this);
    }

    play() {
        this.rot.enabled = true;
        this.left.collider && this.left.collider.enable();
        this.center.collider && this.center.collider.enable();
    }

    stop() {
        this.rot.enabled = false;
        this.left.collider && this.left.collider.disable();
        this.center.collider && this.center.collider.disable();
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