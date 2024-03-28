import { Entity, defineComponent, linkComponentProperties, useComponent, useEntityContext } from '@etherealengine/ecs';
import { useEffect } from 'react';
import { CellState, CellularAutomataCellStateComponent, deadCellEntity } from './CellularAutomataCellStateComponent';

export type CellInput = Entity
export type CellComponentType = {
  inputAState: CellState,
  inputBState: CellState,
  inputCState: CellState,
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
      inputAState: 'dead',
      inputBState: 'dead',
      inputCState: 'dead',
      ruleBinary: getRuleBinary(30)
    }
  },

  onSet: (entity, component, json) => {
    if (!json) return
    // console.log('>>>>>', 'onSet', entity, json);
    if (json.inputAState) {
      component.inputAState.set(json.inputAState)
    }
    if (json.inputBState) {
      component.inputBState.set(json.inputBState)
    }
    if (json.inputCState) {
      component.inputCState.set(json.inputCState)
    }
    if (json.ruleBinary) {
      component.ruleBinary.set(json.ruleBinary)
    }
  },

  reactor: function () {
    const thisEntity = useEntityContext();
    const {inputAState, inputBState, inputCState, ruleBinary} = useComponent(thisEntity, CellularAutomataCellBehaviorComponent).get();
    const cellState = useComponent(thisEntity, CellularAutomataCellStateComponent);

    // console.log('>>>>>', 'behavior', thisEntity, cellState.value, ':', cellBehavior.inputA.value, inputAState, cellBehavior.inputB.value, inputBState, cellBehavior.inputC.value, inputCState );

    useEffect(() => {
      const index = ((inputAState === 'alive' ? 1 : 0) << 2) | ((inputBState === 'alive' ? 1 : 0) << 1) | (inputCState === 'alive' ? 1 : 0);  
      const output = ruleBinary[7 - index]; 
      const newCellState:CellState = output === '1' ? 'alive' : 'dead';          
      // console.log('>>>>>', 'behavior input state change', thisEntity, cellState.value, ':', inputAState, inputBState, inputCState, '-->', newCellState );
      cellState.set({ state: newCellState, updated: true });
    }, [inputAState, inputBState, inputCState, ruleBinary]);

    return null;
  }
});

