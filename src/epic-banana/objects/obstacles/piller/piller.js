import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import * as pc from "playcanvas";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { Rotate } from "../../../scripts/components/rotate";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";


export class Pillar extends Entity {
    constructor() {
        super();

        this.pillar = new Entity();
        this.pillar.addComponent("model", { asset: AssetLoader.getAssetByKey("Pillar") });
        this.addChild(this.pillar);
        this.material = new pc.StandardMaterial();
        this.material.diffuseMap = AssetLoader.getAssetByKey("M_Pillar").resource;
        this.material.update();
        this.pillar.model.meshInstances[0].material = this.material
        this.pillar.setLocalScale(1.2, 1.2, 1.2);

        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.Barrier,
            render: GameConstant.DEBUG_COLLIDER,
            scale: new Vec3(1.1, 3.396, 1.1),
            position: new Vec3(0, 1.384, 0)
        });

        this.rot = this.pillar.addScript(Rotate, {
            speed: new Vec3(0, -200, 0),
        });

        this.on(SpawningEvent.Despawn, this.stop, this);
        this.on(SpawningEvent.Spawn, this.play, this);
    }

    play() {
        this.rot.enabled = true;
        this.collider && this.collider.enable();
    }

    stop() {
        this.rot.enabled = false;
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