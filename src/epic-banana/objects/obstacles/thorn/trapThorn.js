import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";


export class TrapThorn extends Entity {
    constructor() {
        super()
        this.addComponent("model", { asset: AssetLoader.getAssetByKey("trap_thorn") });

        this.addScript(BoxCollider, {
            tag: CollisionTag.Barrier,
            render: GameConstant.DEBUG_COLLIDER,
            scale: new Vec3(0.35, 1, 0.35),
            position: new Vec3(0, 0.368, 0)
        });
    }

    config(data) {
        let pos = data.pos
        let rot = data.rot
        let scale = data.scale
        this.setPosition(pos.x, pos.y, pos.z)
        this.setEulerAngles(rot.x, rot.y, rot.z)
        this.setLocalScale(scale.x, scale.y, scale.z)
    }
}