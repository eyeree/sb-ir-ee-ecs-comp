import { Entity, createEntity, defineComponent, setComponent, useComponent, useEntityContext, removeEntity } from '@etherealengine/ecs';
import { useEffect } from 'react';
import { setCallback } from '@etherealengine/spatial/src/common/CallbackComponent';
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent';
import { TransformComponent } from '@etherealengine/spatial';
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent';
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent';
import { Vector3 } from 'three';
import { GeometryTypeEnum } from '@etherealengine/engine/src/scene/constants/GeometryTypeEnum';
import { useHookstate } from '@etherealengine/hyperflux';

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
        cellState.set({ state: newState });
      });
    }, []);

    useEffect(() => {
      if (cellState.state.value === 'alive') {
        setComponent(thisEntity, VisibleComponent, true);
      } else {
        setComponent(thisEntity, VisibleComponent, false);
      }
    }, [cellState.state.value]);

    return null;

  }

});

