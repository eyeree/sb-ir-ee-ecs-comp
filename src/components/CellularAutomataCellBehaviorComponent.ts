import { Entity, defineComponent, useComponent, useEntityContext } from '@etherealengine/ecs';
import { useEffect } from 'react';
import { CellState, CellularAutomataCellStateComponent } from './CellularAutomataCellStateComponent';

export type CellInput = Entity
export type CellComponentType = {
  inputA: CellInput,
  inputB: CellInput,
  inputC: CellInput
}

export const CellularAutomataCellBehaviorComponent = defineComponent<CellComponentType>({
  name: 'CellularAutomataCellBehaviorComponent',
  jsonID: 'sb.cellularAutomata.cell',

  onSet: (entity, component, json) => {
    if (!json) return
    console.log('>>>>>', 'CellularAutomataCellBehaviorComponent.onSet', entity, json)
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
    const cellComponent = useComponent(thisEntity, CellularAutomataCellBehaviorComponent);
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

