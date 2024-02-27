import { createEntity, defineComponent, setComponent, useComponent, useEntityContext } from '@etherealengine/ecs';
import { useEffect } from 'react';
import { setCallback } from '@etherealengine/spatial/src/common/CallbackComponent';
import { addObjectToGroup, removeObjectFromGroup } from '@etherealengine/spatial/src/renderer/components/GroupComponent';
import { Mesh, MeshStandardMaterial, Color, BoxGeometry } from 'three';
import { useHookstate } from '@etherealengine/hyperflux';

export type CellState = 'dead' | 'alive';

const StateColors:Record<CellState, Color> = {
  'alive': new Color(0x000000),
  'dead': new Color(0xffffff)
};

const UpdatedColor = new Color(0xff0000);

const UpdateDelayMS = 20;

export const CellularAutomataCellStateComponent = defineComponent({
  name: 'CellularAutomataCellStateComponent',
  jsonID: 'sb.cellularAutomata.cellState',

  onInit: (entity) => { 
    return {
      state: 'dead' as CellState,
      updated: false
    };
  },

  onSet: (entity, component, json) => {
    if (!json) return
    if (json.state) {
      component.state.set(json.state)
    }
    if(json.updated) {
      component.updated.set(json.updated)
    }
  },

  reactor: () => {

    const thisEntity = useEntityContext();
    const cellState = useComponent(thisEntity, CellularAutomataCellStateComponent);
    const mesh = useHookstate(new Mesh(new BoxGeometry(), new MeshStandardMaterial())).value;
    const timeoutIdState = useHookstate<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {

      // When done here instead of in the generator component, the generator appears as a cube instead of a sphere
      // setComponent(thisEntity, VisibleComponent)

      setCallback(thisEntity, 'onClick', () => {
        const newState = cellState.state.value === 'alive' ? 'dead' : 'alive';
        // console.log('>>>>>', 'onClick', thisEntity, cellState.state.value, '-->', newState);
        cellState.state.set(newState);
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
      mesh.material.color = cellState.updated.value ? UpdatedColor : StateColors[cellState.state.value];
    }, [cellState.state.value, cellState.updated.value]);

    useEffect(() => {
      if(cellState.updated.value) {
        if(timeoutIdState.value) {
          console.log('>>>>>', 'double update', thisEntity);
          clearTimeout(timeoutIdState.value);
        }
        const timeoutId = setTimeout(() => {
          cellState.updated.set(false);
        }, UpdateDelayMS);
        timeoutIdState.set(timeoutId);
      } else {
        if(timeoutIdState.value) {  
          clearTimeout(timeoutIdState.value);
          timeoutIdState.set(null);
        }
      }
    }, [cellState.updated.value]);

    return null;

  }

});

export const deadCellEntity = createEntity();
setComponent(deadCellEntity, CellularAutomataCellStateComponent, { state: 'dead' });
// console.log('>>>>>', 'deadCellEntity', deadCellEntity);