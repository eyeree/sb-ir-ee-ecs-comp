import { createEntity, defineComponent, setComponent, useComponent, useEntityContext } from '@etherealengine/ecs';
import { useEffect } from 'react';
import { setCallback } from '@etherealengine/spatial/src/common/CallbackComponent';
import { addObjectToGroup, removeObjectFromGroup } from '@etherealengine/spatial/src/renderer/components/GroupComponent';
import { Mesh, MeshStandardMaterial, Color, BoxGeometry } from 'three';
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent';
import { CellularAutomataClickableComponent } from './CellularAutomataClickableComponent';
import { useHookstate } from '@etherealengine/hyperflux';

export type CellState = 'dead' | 'alive';

const StateColors:Record<CellState, Color> = {
  'alive': new Color(0x000000),
  'dead': new Color(0xffffff)
};

export const CellularAutomataCellStateComponent = defineComponent({
  name: 'CellularAutomataCellStateComponent',
  jsonID: 'sb.cellularAutomata.cellState',

  onInit: (entity) => { 
    return {
      state: 'dead' as CellState
    };
  },

  onSet: (entity, component, json) => {
    if (!json) return
    if (json.state) {
      component.state.set(json.state)
    }
  },

  reactor: () => {

    const thisEntity = useEntityContext();
    const cellState = useComponent(thisEntity, CellularAutomataCellStateComponent);
    const mesh = useHookstate(new Mesh(new BoxGeometry(), new MeshStandardMaterial())).value;

    useEffect(() => {

      // When done here instead of in the generator component, the generator appears as a cube instead of a sphere
      // setComponent(thisEntity, VisibleComponent)

      setCallback(thisEntity, 'onClick', () => {
        const newState = cellState.state.value === 'alive' ? 'dead' : 'alive';
        // console.log('>>>>>', 'onClick', thisEntity, cellState.state.value, '-->', newState);
        cellState.set({ state: newState });
      });

      addObjectToGroup(thisEntity, mesh);
      // console.log('>>>>>', 'addObjectToGroup', thisEntity, mesh);
      return () => {
        removeObjectFromGroup(thisEntity, mesh);
        // console.log('>>>>>', 'removeObjectFromGroup', thisEntity, mesh);
      }

    }, []);

    useEffect(() => {
      // console.log('>>>>>', 'cellState.state.value', thisEntity, cellState.state.value);
      mesh.material.color = StateColors[cellState.state.value];
    }, [cellState.state.value]);

    return null;

  }

});

export const deadCellEntity = createEntity();
setComponent(deadCellEntity, CellularAutomataCellStateComponent, { state: 'dead' });
// console.log('>>>>>', 'deadCellEntity', deadCellEntity);