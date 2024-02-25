import { Entity, createEntity, defineComponent, setComponent, useComponent, useEntityContext, removeEntity } from '@etherealengine/ecs';
import { useEffect } from 'react';
import { setCallback } from '@etherealengine/spatial/src/common/CallbackComponent';
import { TransformComponent } from '@etherealengine/spatial';
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent';
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent';
import { Vector3 } from 'three';
import { getState, useHookstate } from '@etherealengine/hyperflux';
import { CellularAutomataCellStateComponent, deadCellEntity } from './CellularAutomataCellStateComponent';
import { CellularAutomataCellBehaviorComponent } from './CellularAutomataCellBehaviorComponent';
import { CellularAutomataClickableComponent } from './CellularAutomataClickableComponent';
import { EngineState } from '@etherealengine/spatial/src/EngineState';

export const CellularAutomataGeneratorComponent = defineComponent({
  name: 'CellularAutomataGeneratorComponent',
  jsonID: 'sb.cellularAutomata.generator',

  onInit: (entity) => { 
    return {
      rows: 100,
      cols: 40,
      space: 0.025,
      bottom: 0.5,
      size: 0.1,
      distance: -2
    }
  },

  onSet: (entity, component, json) => {
    if (!json) return
    if (json.rows) {
      component.rows.set(json.rows)
    }
    if (json.cols) {
      component.cols.set(json.cols)
    }
    if (json.space) {
      component.space.set(json.space)
    }
    if (json.bottom) {
      component.bottom.set(json.bottom)
    }
    if (json.size) {
      component.size.set(json.size)
    }
    if (json.distance) {
      component.distance.set(json.distance)
    }
  },

  toJSON: (entity, component) => {
    return {
      rows: component.rows.value,
      cols: component.cols.value,
      space: component.space.value,
      bottom: component.bottom.value,
      size: component.size.value,
      distance: component.distance.value
    }
  },

  reactor: function () {

    if (getState(EngineState).isEditing) return null;

    const thisEntity = useEntityContext();
    const generatorComponent = useComponent(thisEntity, CellularAutomataGeneratorComponent);
    const cellEntitiesState = useHookstate<null|Entity[][]>(null);

    function createCells() {

      // console.log('>>>>>', 'createCells', generatorComponent);

      const { rows, cols, space, bottom, size, distance } = generatorComponent;

      const left = 0 - (cols.value * (size.value + space.value)) / 2
      let x = left;
      let y = bottom.value;
      let z = distance.value;

      const scale = new Vector3(size.value, size.value, size.value);

      const cellEntities: Entity[][] = [];

      for(let row = 0; row < rows.value; row++) {
        cellEntities.push([]);
        for(let col = 0; col < cols.value; col++) {
          const entity = createEntity();
          cellEntities[row].push(entity);
          setComponent(entity, NameComponent, `cell-${row}-${col}`);
          setComponent(entity, VisibleComponent)
          setComponent(entity, TransformComponent, { 
            position: new Vector3(x, y, z),
            scale: scale
          });
          setComponent(entity, CellularAutomataCellStateComponent, { state: 'dead' });
          setComponent(entity, CellularAutomataCellBehaviorComponent, { 
            inputA: row === 0 || col - 1 < 0 ? deadCellEntity : cellEntities[row - 1][col - 1], 
            inputB: row === 0 ? deadCellEntity : cellEntities[row - 1][col], 
            inputC: row === 0 || col + 1 >= cols.value ? deadCellEntity : cellEntities[row - 1][col + 1]
          });
          setComponent(entity, CellularAutomataClickableComponent, { shape: 'box' });
          x += size.value + space.value;
        }
        x = left;
        y += size.value + space.value;
      }

      cellEntitiesState.set(cellEntities);

    }

    function deleteCells() {
      for(const row of cellEntitiesState.value!) {
        for (const entity of row) {
          removeEntity(entity)
        }
      }
      cellEntitiesState.set(null);
    }
    
    useEffect(() => {
      setCallback(thisEntity, 'onClick', cellEntitiesState.value ? deleteCells : createCells);
    }, [cellEntitiesState.value]);

    return null;
  }
});

