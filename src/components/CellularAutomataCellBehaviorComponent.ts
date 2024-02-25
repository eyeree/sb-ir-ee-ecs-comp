import { Entity, defineComponent, useComponent, useEntityContext } from '@etherealengine/ecs';
import { useEffect } from 'react';
import { CellState, CellularAutomataCellStateComponent, deadCellEntity } from './CellularAutomataCellStateComponent';
import { useHookstate } from '@etherealengine/hyperflux';

export type CellInput = Entity
export type CellComponentType = {
  inputA: CellInput,
  inputB: CellInput,
  inputC: CellInput
}

export const CellularAutomataCellBehaviorComponent = defineComponent<CellComponentType>({
  name: 'CellularAutomataCellBehaviorComponent',
  jsonID: 'sb.cellularAutomata.cell',

  onInit: (entity) => { 
    return {
      inputA: deadCellEntity,
      inputB: deadCellEntity,
      inputC: deadCellEntity
    }
  },

  onSet: (entity, component, json) => {
    if (!json) return
    console.log('>>>>>', 'onSet', entity, json);
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
    const inputAStateComponent = useComponent(cellComponent.inputA.value, CellularAutomataCellStateComponent);
    const inputBStateComponent = useComponent(cellComponent.inputB.value, CellularAutomataCellStateComponent);
    const inputCStateComponent = useComponent(cellComponent.inputC.value, CellularAutomataCellStateComponent);
    const inputAState = inputAStateComponent.state.value;
    const inputBState = inputBStateComponent.state.value;
    const inputCState = inputCStateComponent.state.value;
    const cellState = useComponent(thisEntity, CellularAutomataCellStateComponent);

    console.log('>>>>>', 'behavior', thisEntity, cellState.value, '-->', cellComponent.inputA.value, inputAState, cellComponent.inputB.value, inputBState, cellComponent.inputC.value, inputCState );

    
    useEffect(() => {
      const newCellState:CellState = Math.random() < 0.5 ? 'alive' : 'dead';
      console.log('>>>>>', 'behavior input state change', thisEntity, cellState.value, '-->', inputAState, inputBState, inputCState, '-->', newCellState );
      cellState.set({ state: newCellState });
    }, [inputAState, inputBState, inputCState]);

    return null;
  }
});

