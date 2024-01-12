import { Entity, Vec3 } from "playcanvas";
import { Util } from "../../../../helpers/util";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";


export class Thorn extends Entity {
    constructor() {
        super("thorn")

        this.material = new pc.StandardMaterial()
        this.material.diffuse = Util.createColor(150, 62, 193)
        this.material.update()

        this.addComponent("model", {
            type: "cone",
            material: this.material,
            castShadows: false,
            receiveShadows: false,
        });
        this.setLocalScale(0.7, 1.3, 0.7)

        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.Barrier,
            render: GameConstant.DEBUG_COLLIDER,
            scale: new Vec3(0.8, 0.6, 0.8),
        });
        this.on(SpawningEvent.Despawn, () => {
            this.collider && this.collider.disable();
        }, this);
        this.on(SpawningEvent.Spawn, () => {
            this.collider && this.collider.enable();
        }, this);
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