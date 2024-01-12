import { CollisionEvent } from "../../../physics/collissionEvent";
import { Script } from "../../../template/systems/script/script";
import { CollisionTag } from "../../../physics/collisionTag";
import { GameConstant } from "../../../gameConstant";
import { Tween } from "../../../template/systems/tween/tween";
import { Vec3 } from "playcanvas";
import { SpawningEvent } from "../spawners/spawningEvent";
import { SoundManager } from "../../../template/soundManager";
import { ChibiCatEvent, ChibiCatState } from "../../objects/obstacles/chibiCat/chibiCat";
import { AssetLoader } from "../../../assetLoader/assetLoader";

export const PlayerRunEvent = {
    Jump: "jump",
    Run: "run",
    Idle: "idle",
    Victory: "victory",
    Lose: "lose",
    ChangeSolider: "changeSolider",
    AttackChibiCat: "attackChibiCat",
    Fall: "fall",
}

export const PlayerBananaRunController = Script.createScript({
    name: "playerBananaRunController",
    attributes: {
        collider: { default: null },
        tag: { default: CollisionTag.SoliderPlayer },
    },

    initialize() {
        this.collider.on(CollisionEvent.OnCollide, this.onCollide, this);
        this.collider.on(CollisionEvent.NotCollide, this.notCollide, this);
        this.reset();
    },

    reset() {

    },

    onCollide(other) {
        if (this.tag === CollisionTag.SoliderPlayer) {
            this.soliderPlayerColider(other)
        } else if (this.tag === CollisionTag.SoliderEnemy) {
            this.soliderEnemyColider(other)
        }
    },

    soliderEnemyColider(other) {
        if (other.tag === CollisionTag.SoliderPlayer) {
            this.entity.fire(SpawningEvent.Despawn)
        }
    },

    soliderPlayerColider(other) {
        if (this.entity.state === PlayerRunEvent.Fall) return;

        if (other.tag === CollisionTag.Barrier) {
            if (this.entity.state === PlayerRunEvent.Jump) return;
            SoundManager.play("sfx_game_death");
            this.entity.parent.despawn(this.entity)
        } else if (other.tag === CollisionTag.SoliderEnemy) {
            SoundManager.play("sfx_collect_allies");
            this.entity.parent.spawn(other.entity.getPosition());
        } else if (other.tag === CollisionTag.FinishLine) {
            other.enabled = false;
            this.entity.parent.fire(PlayerRunEvent.Victory);
        } else if (other.tag === CollisionTag.Jump) {
            SoundManager.play("sfx_game_jump");
            this.jump(other);
        } else if (other.tag === CollisionTag.EndWall) {
            this.colliderEndWall(other);
        } else if (other.tag === CollisionTag.Key) {
            other.fire(SpawningEvent.Despawn);
        } else if (other.tag === CollisionTag.ChibiCat) {
            if (other.entity.state == ChibiCatState.WaitCollider ||
                this.entity.state === PlayerRunEvent.AttackChibiCat ||
                this.entity.state === PlayerRunEvent.Jump
            ) return;
            this.entity.state = PlayerRunEvent.AttackChibiCat;
            this.entity.parent.despawn(this.entity, false);
            other.entity.fire(ChibiCatEvent.WaitAttack, this);
        } else if (other.tag === CollisionTag.SpikeTunnel) {
            this.fall(other);
        }
    },

    jump(other) {
        if (this.entity.state === PlayerRunEvent.Jump) return;

        this.entity.state = PlayerRunEvent.Jump;
        let curve = other.entity.curve;
        let distanceJump = other.entity.distanceJump;
        let targetPos = this.entity.getPosition().clone().add(new Vec3(0, 0, distanceJump));
        let distance = targetPos.clone().sub(this.entity.getPosition()).length();
        let duration = distance / GameConstant.GAME_SPEED;

        Tween.createCountTween({
            duration,
            onUpdate: (dt) => {
                let pos = curve.value(dt.percent);
                let tmpPos = this.entity.getPosition();
                this.entity.setPosition(tmpPos.x, pos, tmpPos.z);
            },
            onComplete: () => {
                this.entity.state = PlayerRunEvent.Run;
            }
        }).start();
    },

    fall(other) {
        this.entity.state = PlayerRunEvent.Fall;
        let curve = other.entity.parent.parent.curve;

        Tween.createCountTween({
            duration: GameConstant.TIME_FALL,
            onUpdate: (dt) => {
                let pos = curve.value(dt.percent);
                let tmpPos = this.entity.getPosition();
                this.entity.setPosition(tmpPos.x, pos, tmpPos.z);
            },
            onComplete: () => {
                this.entity.state = PlayerRunEvent.Run;
                this.entity.parent.despawn(this.entity);
            }
        }).start();
    },

    colliderEndWall(other) {
        var operator = other.entity.operator;
        var value = other.entity.value;
        switch (operator) {
            case "+":
                this.entity.parent.spawnMutiple(value);
                break;
            case "-":
                this.entity.parent.despawnMutiple(value);
                break;
        }
    },

    notCollide(other) {

    }
});