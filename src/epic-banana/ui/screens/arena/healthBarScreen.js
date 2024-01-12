import { Game } from "../../../../game";
import { GameConstant } from "../../../../gameConstant";
import { UIScreen } from "../../../../template/ui/uiScreen";


export class HealthBarScreen extends UIScreen {
  constructor() {
    super(GameConstant.SCREEN_HEALTH_BAR);
    this.device = Game.app.graphicsDevice;
  }
}
