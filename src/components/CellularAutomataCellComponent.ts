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
import { CellState, CellularAutomataCellStateComponent } from './CellularAutomataCellStateComponent';

export type CellInput = Entity
export type CellComponentType = {
  inputA: CellInput,
  inputB: CellInput,
  inputC: CellInput
}

export const CellularAutomataCellComponent = defineComponent<CellComponentType>({
  name: 'CellularAutomataCellComponent',
  jsonID: 'sb.cellularAutomata.cell',

  onSet: (entity, component, json) => {
    if (!json) return
    console.log('>>>>>', 'CellularAutomataCellComponent.onSet', entity, json)
    if (json.inputA) {
      component.inputA.set(json.inputA)
    }
    if (json.inputB) {
      component.inputB.set(json.inputB)
    }
    if (json.inputC) {
      component.inputC.set(json.inputC)
    }
  },

  reactor: function () {
    const thisEntity = useEntityContext();
    const cellComponent = useComponent(thisEntity, CellularAutomataCellComponent);
    const inputAState = useComponent(cellComponent.inputA.value, CellularAutomataCellStateComponent).state.value;
    const inputBState = useComponent(cellComponent.inputB.value, CellularAutomataCellStateComponent).state.value;
    const inputCState = useComponent(cellComponent.inputC.value, CellularAutomataCellStateComponent).state.value;
    const cellState = useComponent(thisEntity, CellularAutomataCellStateComponent);
    
    useEffect(() => {
      const newCellState:CellState = 'alive';
      console.log('>>>>>', 'useEffect', thisEntity, cellState.value, '-->', inputAState, inputBState, inputCState, '-->', newCellState );
      cellState.set({ state: newCellState });
    }, [inputAState, inputBState, inputCState]);

    return null;
  }
});

