import { Script } from "../../../template/systems/script/script";

export const Attackable = Script.createScript({
  name: "attackable",

  attributes: {
    attackDamage: { default: 50 },
  },
});
