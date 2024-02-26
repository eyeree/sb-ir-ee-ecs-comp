import { isClient } from '@etherealengine/common/src/utils/getEnvironment'

import './systems/CellularAutomataClickSystem';

import './components/CellularAutomataGeneratorComponent';
import './components/CellularAutomataCellBehaviorComponent';
import './components/CellularAutomataCellStateComponent';
import './components/CellularAutomataClickableComponent';

if (isClient) {
  import('./editors/CellularAutomataGeneratorComponentEditor');
}
