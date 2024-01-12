import { Entity, Vec3 } from "playcanvas"; 4
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { CollisionTag } from "../../../physics/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { BoxCollider } from "../../../physics/scripts/boxCollider";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";
import { CollisionEvent } from "../../../physics/collissionEvent";
import { UserData } from "../../data/userData";
import { SoundManager } from "../../../template/soundManager";


export class Key extends Entity {
    constructor() {
        super();
        this.addComponent("model", { asset: AssetLoader.getAssetByKey("key") });

        this.collider = this.addScript(BoxCollider, {
            tag: CollisionTag.Key,
            render: GameConstant.DEBUG_COLLIDER,
            scale: new Vec3(0.25, 0.25, 0.6),
        });
        this.on(SpawningEvent.Spawn, () => {
            this.collider && this.collider.enable();
        });

        this.collider.on(CollisionEvent.OnCollide, this.onCollide, this)
    }

    config(data) {
        let pos = data.pos;
        let rot = data.rot;
        let scale = data.scale;
        this.setPosition(pos.x, pos.y, pos.z);
        this.setEulerAngles(rot.x, rot.y, rot.z);
        this.setLocalScale(scale.x, scale.y, scale.z);
    }

    onCollide(other) {
        this.fire(SpawningEvent.Despawn)
        SoundManager.play("sfx_game_claim_key_and_open_chest");
        UserData.keys += 1;
        // DataLocal.updateDataByKey(GameConstant.INDEXEDDB_KEYS, UserData.keys)
    }
}