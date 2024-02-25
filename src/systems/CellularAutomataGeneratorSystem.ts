import { AnimationSystemGroup, defineSystem } from "@etherealengine/ecs";

// Is intended to be used with a SystemComponent, but that doesn't seem like a good pattern to follow. SystemComponent
// isn't working (is looking for "system" not "EE_system", and the URL created by the download button doesn't match the
// URL the loader expects)

console.log('>>>>>>>>>>>>>>>>>>> CellularAutomataGeneratorSystem loading');

export default defineSystem({
  uuid: 'sb.cellularAutomata.generator',
  insert: { after: AnimationSystemGroup },
  reactor: () => {
    console.log('>>>>>>>>>>>>>>>>>>> CellularAutomataGeneratorSystem reactor');
    return null;
  }
})