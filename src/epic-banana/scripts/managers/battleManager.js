import { Color, data } from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { CharacterEvent } from "../../objects/character/characterEvent";
import { CharacterState } from "../../objects/character/characterState";
import { HealthBar } from "../../objects/healthBar/healthBar";
import { BodyEvent } from "../components/body";
import { RangeCharacterEvent } from "../controllers/rangeCharacterController";
import { FollowWorldTarget } from "../controllers/followWorldTarget";
import { Tween } from "../../../template/systems/tween/tween";
import { SpawningEvent } from "../spawners/spawningEvent";

export const BattleEvent = Object.freeze({
  Win: "Win",
  Lose: "Lose",
});


export const BattleState = Object.freeze({
  Waiting: "wating",
  Combating: "combating",
});


export const BattleManager = Script.createScript({
  name: "battleManager",

  attributes: {
    playerTeam: { default: [] },
    enemyTeam: { default: [] },
    projectileSpawnerMap: { default: [] },
    healthBarScreen: { default: [] },
    camera: { default: [] },
  },

  initialize() {
    this.state = BattleState.Waiting;
    this.totalAlivePlayerChar = 0;
    this.totalAliveEnemyChar = 0;
    this.data = [];
  },

  startBattle(playerSlots, enemySlots) {
    this.state = BattleState.Combating;
    this.playerTeam = [];
    this.enemyTeam = [];
    this.totalAlivePlayerChar = 0;
    this.totalAliveEnemyChar = 0;
    this.data = [];

    for (let i = 0; i < playerSlots.length; i++) {
      let slot = playerSlots[i];
      if (slot.controller.character) {
        this.data.push({
          "level": slot.controller.character.mergeController.level,
          "type": slot.controller.character.mergeController.type,
        });
        this.setupChar(slot, true);
      } else {
        this.data.push(null);
      }
    }

    for (let i = 0; i < enemySlots.length; i++) {
      let slot = enemySlots[i];
      if (slot.controller.character) {
        this.setupChar(slot, false);
      }
    }
  },

  setupChar(slot, isPlayerTeam) {
    let char = slot.controller.character;
    let pos = char.getPosition();
    let rotation = char.getRotation();
    if (!isPlayerTeam) {
      slot.controller.removeCurCharacter();
    }
    this.entity.addChild(char);
    char.setPosition(pos);
    char.setRotation(rotation);
    char.controller.battleManager = this;
    char.controller.onStartBattle();
    char.controller.on(RangeCharacterEvent.FireProjectile, this._onRangeCharacterFireProjectile, this);
    char.controller.resetAngle();

    if (!char.healthBar) {
      char.healthBar = new HealthBar();
      this.healthBarScreen.addChild(char.healthBar);
      char.healthBar.addScript(FollowWorldTarget, {
        target: char,
        camera: this.camera,
        screen: this.healthBarScreen,
      });
    }

    char.body.off(BodyEvent.OnHPChange);
    char.body.on(BodyEvent.OnHPChange, char.healthBar.controller.updatePercent, char.healthBar.controller);

    if (isPlayerTeam) {
      char.controller.isPlayerTeam = true;
      this.playerTeam.push(char);
      this.totalAlivePlayerChar++;
      char.controller.on(CharacterEvent.Dead, () => {
        char.healthBar.enabled = false;
        this._onPlayerCharDead();
      });
      char.healthBar.setColor(Color.BLUE);
    }
    else {
      char.controller.isPlayerTeam = false;
      this.enemyTeam.push(char);
      this.totalAliveEnemyChar++;
      char.controller.on(CharacterEvent.Dead, () => {
        char.healthBar.enabled = false;
        this._onEnemyCharDead();
      });
      char.healthBar.setColor(Color.RED);
    }
  },

  findNearestTarget(char, isPlayerTeam) {
    let targetTeam;

    if (isPlayerTeam) {
      targetTeam = this.enemyTeam;
    }
    else {
      targetTeam = this.playerTeam;
    }

    let curCharPos = char.getPosition();
    let target = null;
    let minRange = Number.MAX_VALUE;

    for (let i = 0; i < targetTeam.length; i++) {
      let enemy = targetTeam[i];
      if (enemy.body.isDead()) {
        continue;
      }
      let range = curCharPos.distance(enemy.getPosition());
      if (range < minRange) {
        minRange = range;
        target = enemy;
      }
    }

    return target;
  },

  _onPlayerCharDead() {
    this.totalAlivePlayerChar--;

    if (this.totalAlivePlayerChar === 0) {
      this.onLose();
    }
  },

  _onEnemyCharDead() {
    this.totalAliveEnemyChar--;
    if (this.totalAliveEnemyChar === 0) {
      this.onWin();
    }
  },

  onLose() {
    this.state = BattleState.Waiting;

    for (let i = 0; i < this.enemyTeam.length; i++) {
      let char = this.enemyTeam[i];
      if (char.controller.state !== CharacterState.Dead) {
        char.controller.victory();
      }
    }
    Tween.createCountTween({
      duration: 2,
      onComplete: () => {
        this.fire(BattleEvent.Lose);
        this.clearBattle();
      }
    }).start();
  },

  onWin() {
    this.state = BattleState.Waiting;

    for (let i = 0; i < this.playerTeam.length; i++) {
      let char = this.playerTeam[i];
      if (char.controller.state !== CharacterState.Dead) {
        char.controller.victory();
        char.controller.rotateToCamera();
      }
    }

    Tween.createCountTween({
      duration: 2,
      onComplete: () => {
        this.fire(BattleEvent.Win, this.data);
        this.clearBattle();
      }
    }).start();
  },

  _onRangeCharacterFireProjectile(owner, target) {
    let ownerID = owner.mergeController.getID();
    let spanwer = this.projectileSpawnerMap.get(ownerID);
    let projectile = spanwer.spawn();
    this.entity.addChild(projectile);
    projectile.controller.fireTo(owner, target);
  },

  pause() {
    this.playerTeam.forEach((char) => {
      if (char.modelEntity.animation) {
        char.modelEntity.animation.enabled = false;
      }
    });

    this.enemyTeam.forEach((char) => {
      if (char.modelEntity.animation) {
        char.modelEntity.animation.enabled = false;
      }
    });
  },

  resume() {
    this.playerTeam.forEach((char) => {
      if (char.modelEntity.animation) {
        char.modelEntity.animation.enabled = true;
      }
    });

    this.enemyTeam.forEach((char) => {
      if (char.modelEntity.animation) {
        char.modelEntity.animation.enabled = true;
      }
    });
  },

  clearBattle() {
    this.playerTeam.forEach((char) => {
      char.healthBar.enabled = false;
      this.entity.removeChild(char);
      char.destroy();
    });

    this.enemyTeam.forEach((char) => {
      char.healthBar.enabled = false;
      this.entity.removeChild(char);
      char.destroy();
    });
  },
});
