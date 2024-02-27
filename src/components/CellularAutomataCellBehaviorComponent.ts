import { Entity, defineComponent, useComponent, useEntityContext } from '@etherealengine/ecs';
import { useEffect } from 'react';
import { CellState, CellularAutomataCellStateComponent, deadCellEntity } from './CellularAutomataCellStateComponent';

export type CellInput = Entity
export type CellComponentType = {
  inputA: CellInput,
  inputB: CellInput,
  inputC: CellInput,
  ruleBinary: string
}

export function getRuleBinary(rule:number):string {
  return rule.toString(2).padStart(8, '0');
}

export const CellularAutomataCellBehaviorComponent = defineComponent<CellComponentType>({
  name: 'CellularAutomataCellBehaviorComponent',
  jsonID: 'sb.cellularAutomata.cell',

  onInit: (entity) => { 
    return {
      inputA: deadCellEntity,
      inputB: deadCellEntity,
      inputC: deadCellEntity,
      ruleBinary: getRuleBinary(30)
    }
  },

  onSet: (entity, component, json) => {
    if (!json) return
    // console.log('>>>>>', 'onSet', entity, json);
    if (json.inputA) {
      component.inputA.set(json.inputA)
    }
    if (json.inputB) {
      component.inputB.set(json.inputB)
    }
    if (json.inputC) {
      component.inputC.set(json.inputC)
    }
    if (json.ruleBinary) {
      component.ruleBinary.set(json.ruleBinary)
    }
  },

  reactor: function () {
    const thisEntity = useEntityContext();
    const cellBehavior = useComponent(thisEntity, CellularAutomataCellBehaviorComponent);
    const cellState = useComponent(thisEntity, CellularAutomataCellStateComponent);
    
    const inputAStateComponent = useComponent(cellBehavior.inputA.value, CellularAutomataCellStateComponent);
    const inputBStateComponent = useComponent(cellBehavior.inputB.value, CellularAutomataCellStateComponent);
    const inputCStateComponent = useComponent(cellBehavior.inputC.value, CellularAutomataCellStateComponent);

    const inputAState = inputAStateComponent.state.value;
    const inputBState = inputBStateComponent.state.value;
    const inputCState = inputCStateComponent.state.value;

    // console.log('>>>>>', 'behavior', thisEntity, cellState.value, ':', cellBehavior.inputA.value, inputAState, cellBehavior.inputB.value, inputBState, cellBehavior.inputC.value, inputCState );
    
    useEffect(() => {
      const index = ((inputAState === 'alive' ? 1 : 0) << 2) | ((inputBState === 'alive' ? 1 : 0) << 1) | (inputCState === 'alive' ? 1 : 0);  
      const output = cellBehavior.ruleBinary.value[7 - index]; 
      const newCellState:CellState = output === '1' ? 'alive' : 'dead';          
      // console.log('>>>>>', 'behavior input state change', thisEntity, cellState.value, ':', inputAState, inputBState, inputCState, '-->', newCellState );
      cellState.set({ state: newCellState, updated: true });
    }, [inputAState, inputBState, inputCState]);

    return null;
  }
});

