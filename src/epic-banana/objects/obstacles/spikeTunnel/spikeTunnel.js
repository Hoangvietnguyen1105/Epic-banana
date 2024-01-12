import { Entity, Vec3, StandardMaterial, Curve } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { Util } from "../../../../helpers/util";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { CollisionTag } from "../../../../physics/collisionTag";
import { GameConstant } from "../../../../gameConstant";
import { Tween } from "../../../../template/systems/tween/tween";


export class SpikeTunnel extends Entity {
    constructor() {
        super();

        this.addComponent("model", {
            asset: AssetLoader.getAssetByKey("hamchong"),
            castShadows: false,
            receiveShadows: false,
        });

        this.materialFloor = new StandardMaterial();
        this.materialFloor.diffuse = Util.createColor(12, 56, 88);
        this.materialFloor.update();

        this.floorSpikeTunnel = new Entity();
        this.addChild(this.floorSpikeTunnel);
        this.floorSpikeTunnel.addComponent("model", {
            type: "box",
            material: this.materialFloor,
            castShadows: false,
            receiveShadows: false,
        });

        this.floorSpikeTunnel.setLocalScale(6.277, 0.01, 12.654);
        this.floorSpikeTunnel.setLocalPosition(2.343, 0.474, 0);

        this.floorSpikeTunnel.addChild(this.colliderLeft = new Entity());
        this.floorSpikeTunnel.addChild(this.colliderRight = new Entity());
        this.colliderLeft.addScript(BoxCollider, {
            tag: CollisionTag.SpikeTunnel,
            render: GameConstant.DEBUG_COLLIDER,
            scale: new Vec3(0.95, 100, 0.85),
            position: new Vec3(1.139, 0, 0)
        });

        this.colliderRight.addScript(BoxCollider, {
            tag: CollisionTag.SpikeTunnel,
            render: GameConstant.DEBUG_COLLIDER,
            scale: new Vec3(0.95, 100, 0.85),
            position: new Vec3(-1.139, 0, 0)
        });

        this.curve = new Curve([
            0, 0,
            0.1, -0.3,
            0.2, -0.6,
            0.3, -0.9,
            0.4, -1.2,
            0.5, -1.5,
            0.6, -1.8,
            0.7, -2.1,
            0.8, -2.4,
            0.9, -2.7,
            1, -3,
        ]);

        this.tweenFloor = Tween.createLocalTranslateTween(this.floorSpikeTunnel, { x: -3.936 }, {
            duration: 1.5,
            loop: true,
            yoyo: true,
        }).start();
    }

    config(data) {
        let pos = data.pos
        let rot = data.rot
        let scale = data.scale
        this.setPosition(pos.x, pos.y, pos.z)
        this.setEulerAngles(rot.x, rot.y, rot.z)
        this.setLocalScale(scale.x, scale.y, scale.z)
        this.tweenFloor.duration = data.duration || 1.5;
    }
}