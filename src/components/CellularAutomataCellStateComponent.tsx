import { Component, createEntity, defineComponent, setComponent, useComponent, useEntityContext } from '@etherealengine/ecs';
import { useEffect } from 'react';
import { setCallback } from '@etherealengine/spatial/src/common/CallbackComponent';
import { addObjectToGroup, removeObjectFromGroup } from '@etherealengine/spatial/src/renderer/components/GroupComponent';
import { Mesh, MeshStandardMaterial, Color, BoxGeometry } from 'three';
import { useHookstate } from '@etherealengine/hyperflux';
import React from 'react';

export type CellState = 'dead' | 'alive';

const StateColors:Record<CellState, Color> = {
  'alive': new Color(0x000000),
  'dead': new Color(0xffffff)
};

const UpdatedColor = new Color(0xff0000);

const UpdateDelayMS = 20;

// export type CellularAutomataCellStateComponentType = {
//   state: CellState,
//   updated: boolean
// };

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

    return (<>
      <SetGeometry mesh={mesh} />
      <OnClick onClick={() => cellState.state.set(cellState.state.value === 'alive' ? 'dead' : 'alive')} />
      <SetMaterialColor color={cellState.updated.value ? UpdatedColor : StateColors[cellState.state.value]} mesh={mesh} />
      {cellState.updated.value && <OnTimeout delay={UpdateDelayMS} callback={() => cellState.updated.set(false)} />}
    </>);

  }

});

function OnClick({ onClick }: { onClick: () => void }) {
  const thisEntity = useEntityContext();
  useEffect(() => {
    setCallback(thisEntity, 'onClick', onClick);
  }, []);
  return null;
}

function SetMaterialColor({ color, mesh }: { color: Color, mesh: Mesh<any, MeshStandardMaterial, any> }) {
  useEffect(() => {
    mesh.material.color = color;
  }, [color]);
  return null;
}

function OnTimeout({ delay, callback }: { delay: number, callback: () => void }) {
  useEffect(() => {
    const timeoutId = setTimeout(callback, delay);
    return () => clearTimeout(timeoutId);
  }, []);
  return null;
}

function SetGeometry({ mesh }: { mesh: Mesh<any, MeshStandardMaterial, any> }) {
  const thisEntity = useEntityContext();
  useEffect(() => {
    addObjectToGroup(thisEntity, mesh);
    return () => {
      removeObjectFromGroup(thisEntity, mesh);
    }
}, []);
  return null;
}

export const deadCellEntity = createEntity();
setComponent(deadCellEntity, CellularAutomataCellStateComponent, { state: 'dead' });
// console.log('>>>>>', 'deadCellEntity', deadCellEntity);