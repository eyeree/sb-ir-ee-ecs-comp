import { AnimationSystemGroup, defineSystem } from "@etherealengine/ecs";

console.log('>>>>>>>>>>>>>>>>>>> CellularAutomataGeneratorSystem loading');

export default defineSystem({
  uuid: 'sb.cellularAutomata.generator',
  insert: { after: AnimationSystemGroup },
  reactor: () => {
    console.log('>>>>>>>>>>>>>>>>>>> CellularAutomataGeneratorSystem reactor');
    return null;
  }
})