import { Entity, createEntity, defineComponent, setComponent, useComponent, useEntityContext, removeEntity } from '@etherealengine/ecs';
import { useEffect } from 'react';
import { setCallback } from '@etherealengine/spatial/src/common/CallbackComponent';
import { TransformComponent } from '@etherealengine/spatial';
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent';
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent';
import { Vector3 } from 'three';
import { State, getState, useHookstate } from '@etherealengine/hyperflux';
import { CellularAutomataCellStateComponent, deadCellEntity } from './CellularAutomataCellStateComponent';
import { CellularAutomataCellBehaviorComponent, getRuleBinary } from './CellularAutomataCellBehaviorComponent';
import { CellularAutomataClickableComponent } from './CellularAutomataClickableComponent';
import { EngineState } from '@etherealengine/spatial/src/EngineState';
import React from 'react';

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
      distance: -2,
      rule: 54 // https://mathworld.wolfram.com/ElementaryCellularAutomaton.html
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
    if (json.rule) {
      component.rule.set(json.rule)
    }
  },

  toJSON: (entity, component) => {
    return {
      rows: component.rows.value,
      cols: component.cols.value,
      space: component.space.value,
      bottom: component.bottom.value,
      size: component.size.value,
      distance: component.distance.value,
      rule: component.rule.value
    }
  },

  reactor: function () {

    if (getState(EngineState).isEditing) return null;

    const thisEntity = useEntityContext();
    const generatorComponent = useComponent(thisEntity, CellularAutomataGeneratorComponent);
    const showGrid = useHookstate(false);
    
    useEffect(() => {
      setCallback(thisEntity, 'onClick', () => { showGrid.set(!showGrid.value) });
    }, [showGrid]);

    useEffect(() => {
      const rule = generatorComponent.rule.value;
      setCallback(thisEntity, 'onCtrlClick', () => { 
        generatorComponent.rule.set(rule === 255 ? 0 : rule + 1); 
        console.log('inc rule', rule, '->', generatorComponent.rule.value) 
      });
      setCallback(thisEntity, 'onShiftClick', () => {
        generatorComponent.rule.set(rule === 0 ? 255 : rule - 1); 
        console.log('dec rule', rule, '->', generatorComponent.rule.value) 
      });
    }, [generatorComponent.rule.value]);

    return showGrid.value ? <Grid {...generatorComponent.value}/> : <></>;
  }
});

type EntitiesProp = { entities: State<Entity[][]> }
type GridProps = typeof CellularAutomataGeneratorComponent["_TYPE"] 
type RowProps = GridProps & { row:number } & EntitiesProp;
type CellProps = GridProps & { row:number, col:number } & EntitiesProp;

function Grid(props:GridProps) {
  const entities = useHookstate<Entity[][]>(() => {
    const { rows, cols } = props;
    return Array.from({ length: rows }, 
      () => Array.from({ length: cols }, 
        () => -1 as Entity)
    );
  });
  return (
    <>
      {range(props.rows).map(
        row => <Row key={row} row={row} entities={entities} {...props} />
      )}
    </>
  ) 
}

function Row(props:RowProps) {
  return (
    <>
      {range(props.cols).map(
        col => <Cell key={col} col={col} {...props} />
      )}
    </>
  )
}

function Cell(props:CellProps) {

  useEffect(() => {

    const { row, col, entities } = props;
    const position = getCellPosition(props);
    const scale = new Vector3(props.size, props.size, props.size);
  
    const entity = createEntity();
    entities[row][col].set(entity);

    setComponent(entity, NameComponent, `cell-${row}-${col}`);
    setComponent(entity, VisibleComponent)
    setComponent(entity, TransformComponent, { position, scale });
    setComponent(entity, CellularAutomataCellStateComponent, { state: 'dead' });
    setComponent(entity, CellularAutomataCellBehaviorComponent, { 
      inputA: row === 0 || col - 1 < 0 ? deadCellEntity : entities[row - 1][col - 1].value, 
      inputB: row === 0 ? deadCellEntity : entities[row - 1][col].value, 
      inputC: row === 0 || col + 1 >= props.cols ? deadCellEntity : entities[row - 1][col + 1].value,
      ruleBinary: getRuleBinary(props.rule)
    });

    // Is there a way to hit test without using a physics collider?
    if(row === 0) {
      setComponent(entity, CellularAutomataClickableComponent, { shape: 'box' });
    }

    return () => { removeEntity(entity) };
  
  }, [props]);

  return <></>;
}


function getCellPosition(props: GridProps & { row: number; col: number; }) {
  const { row, col, space, bottom, size, distance, cols } = props;
  const left = 0 - (cols * (size + space)) / 2
  const x = left + col * (size + space);
  const y = bottom + row * (size + space);
  const z = distance;
  return new Vector3( x, y, z );
}

function range(startOrEnd:number, end?:number) {
  if(end === undefined) {
    end = startOrEnd;
    startOrEnd = 0;
  }
  return Array.from(
    { length: end - startOrEnd }, 
    (_, i) => i + startOrEnd
  );
}
