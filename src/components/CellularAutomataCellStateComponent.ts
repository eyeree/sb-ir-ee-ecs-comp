import { createEntity, defineComponent, setComponent, useComponent, useEntityContext } from '@etherealengine/ecs';
import { useEffect } from 'react';
import { setCallback } from '@etherealengine/spatial/src/common/CallbackComponent';

export type CellState = 'dead' | 'alive';

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
      setCallback(thisEntity, 'onClick', () => {
        const newState = cellState.state.value === 'alive' ? 'dead' : 'alive';
        console.log('>>>>>', 'onClick', thisEntity, cellState.state.value, '-->', newState);
        cellState.set({ state: newState });
      });
    }, []);

    useEffect(() => {
      if (cellState.state.value === 'alive') {
        // setComponent(thisEntity, VisibleComponent, true);
      } else {
        // setComponent(thisEntity, VisibleComponent, false);
      }
    }, [cellState.state.value]);

    return null;

  }

});

export const deadCellEntity = createEntity();
setComponent(deadCellEntity, CellularAutomataCellStateComponent, { state: 'dead' });
console.log('>>>>>', 'deadCellEntity', deadCellEntity);