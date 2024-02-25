import { createEntity, defineComponent, setComponent, useComponent, useEntityContext } from '@etherealengine/ecs';
import { useEffect } from 'react';
import { setCallback } from '@etherealengine/spatial/src/common/CallbackComponent';
import { addObjectToGroup, removeObjectFromGroup } from '@etherealengine/spatial/src/renderer/components/GroupComponent';
import { Mesh, MeshStandardMaterial, Color, BoxGeometry } from 'three';
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent';
import { CellularAutomataClickableComponent } from './CellularAutomataClickableComponent';

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

    useEffect(() => {

      // Why does this only work when these components are added by the generator?
      // setComponent(thisEntity, VisibleComponent)
      // setComponent(thisEntity, CellularAutomataClickableComponent, { shape: 'box' });

      setCallback(thisEntity, 'onClick', () => {
        const newState = cellState.state.value === 'alive' ? 'dead' : 'alive';
        // console.log('>>>>>', 'onClick', thisEntity, cellState.state.value, '-->', newState);
        cellState.set({ state: newState });
      });

    }, []);

    useEffect(() => {
      const mesh = new Mesh(new BoxGeometry(), new MeshStandardMaterial({ color: StateColors[cellState.state.value] }));
      addObjectToGroup(thisEntity, mesh);
      // console.log('>>>>>', 'addObjectToGroup', thisEntity, mesh);
      return () => {
        removeObjectFromGroup(thisEntity, mesh);
        // console.log('>>>>>', 'removeObjectFromGroup', thisEntity, mesh);
      }
    }, [cellState.state.value]);

    return null;

  }

});

export const deadCellEntity = createEntity();
setComponent(deadCellEntity, CellularAutomataCellStateComponent, { state: 'dead' });
// console.log('>>>>>', 'deadCellEntity', deadCellEntity);