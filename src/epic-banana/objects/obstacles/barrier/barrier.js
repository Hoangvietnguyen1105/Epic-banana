import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { Util } from "../../../../helpers/util";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";


export class Barrier extends Entity {
    constructor() {
        super("barrier");
        this.addComponent("model", { asset: AssetLoader.getAssetByKey("BarricadeFoot") });
        this.materialFoot = new pc.StandardMaterial();
        this.materialFoot.diffuse = Util.createColor(36, 70, 103);
        this.materialFoot.update();
        this.model.meshInstances[0].material = this.materialFoot;

        this.barrier = new Entity("barrier");
        this.addChild(this.barrier);
        this.barrier.addComponent("model", { asset: AssetLoader.getAssetByKey("TrapBarrie") });
        this.materialBarrier = new pc.StandardMaterial();
        this.materialBarrier.diffuse = Util.createColor(128, 71, 188);
        this.materialBarrier.update();
        this.barrier.model.meshInstances[0].material = this.materialBarrier;
        this.barrier.setLocalPosition(0, 1.2, 0);
        this.barrier.setLocalScale(1.1, 1.168, 1);

        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.Barrier,
            render: GameConstant.DEBUG_COLLIDER,
            scale: new Vec3(1.2, 4, 0.75),
        });

        this.on(SpawningEvent.Despawn, () => {
            this.collider && this.collider.disable();
        }, this);
        this.on(SpawningEvent.Spawn, () => {
            this.collider && this.collider.enable();
        }, this);
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