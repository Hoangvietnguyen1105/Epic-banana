import { Script } from "../../../template/systems/script/script";

export const BodyEvent = Object.freeze({
  Dead       : "dead",
  OnHPChange : "onHPChange",
});

export const Body = Script.createScript({
  name: "body",

  attributes: {
    hp: { default: 100 },
  },

  initialize() {
    this.defaultHP = this.hp;
  },

  receiveDamage(damage) {
    if (this.isDead()) {
      return;
    }

    this.hp -= damage;

    let percent = this.hp / this.defaultHP;
    percent = Math.max(percent, 0);
    this.fire(BodyEvent.OnHPChange, percent);
    if (this.isDead()) {
      this.fire(BodyEvent.Dead);
    }
  },

  isDead() {
    return this.hp <= 0;
  },
});
