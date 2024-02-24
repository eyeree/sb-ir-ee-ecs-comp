import { AnimationSystemGroup, Engine, Entity, createEntity, defineComponent, defineQuery, defineSystem, getComponent, setComponent, useEntityContext } from '@etherealengine/ecs'
import { PrimitiveGeometryComponent } from '@etherealengine/engine/src/scene/components/PrimitiveGeometryComponent';
import { GeometryTypeEnum } from '@etherealengine/engine/src/scene/constants/GeometryTypeEnum';
import { TransformComponent } from '@etherealengine/spatial';
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent';
import { VisibleComponent } from '@etherealengine/spatial/src/renderer/components/VisibleComponent';
import { Vector3 } from 'three';
import { useEffect } from 'react';
import { getMutableState, getState } from '@etherealengine/hyperflux';
import { CameraComponent } from '@etherealengine/spatial/src/camera/components/CameraComponent';
import { InputState } from '@etherealengine/spatial/src/input/state/InputState';
import { Physics, RaycastArgs } from '@etherealengine/spatial/src/physics/classes/Physics';
import { PhysicsState } from '@etherealengine/spatial/src/physics/state/PhysicsState';
import { SceneQueryType } from '@etherealengine/spatial/src/physics/types/PhysicsTypes';
import { getInteractionGroups } from '@etherealengine/spatial/src/physics/functions/getInteractionGroups';
import { CollisionGroups } from '@etherealengine/spatial/src/physics/enums/CollisionGroups';
import { InputSourceComponent } from '@etherealengine/spatial/src/input/components/InputSourceComponent';
import { getCallback, setCallback } from '@etherealengine/spatial/src/common/CallbackComponent';
import { ComponentShelfCategoriesState } from '@etherealengine/editor/src/components/element/ElementList';

const ROWS = 100;
const COLS = 100;
const SPACE = 0.1;
const BOTTOM = 0.5;
const SIZE = 0.5;
const DISTANCE = -2;
const GEOMETRY_ON = {
  "geometryType": GeometryTypeEnum.SphereGeometry,
  "geometryParams": {
    "radius": SIZE / 2,
    "widthSegments": 32,
    "heightSegments": 16,
    "phiStart": 0,
    "phiLength": 6.283185307179586,
    "thetaStart": 0,
    "thetaLength": 3.141592653589793
  }
} as const;
const GEOMETRY_OFF = {
  "geometryType": GeometryTypeEnum.BoxGeometry,
  "geometryParams": {
    "width": SIZE,
    "height": SIZE,
    "depth": SIZE,
    "widthSegments": 1,
    "heightSegments": 1,
    "depthSegments": 1
  }
}

export const CellularAutomataGeneratorComponent = defineComponent({
  name: 'CellularAutomataGeneratorComponent',
  jsonID: 'sb.cellularAutomata.generator',

  reactor: function () {
    const thisEntity = useEntityContext();

    useEffect(() => { 
      setCallback(thisEntity, 'onClick', (entity) => {
        console.log('CellularAutomataGeneratorComponent clicked', thisEntity, entity);
      });
    }, []);

    return null;
  }

});

getMutableState(ComponentShelfCategoriesState).Misc.merge([CellularAutomataGeneratorComponent])

export const CellularAutomataGeneratorSystem = defineSystem({
  uuid: 'sb.cellularAutomata.generator',
  insert: { after: AnimationSystemGroup },
  reactor: () => {

    const params = getGeneratorParams();
    if(params) {

      const { rows, cols, space, bottom, size, distance } = params;

      console.log('>>>>>>>>>>>>>>>>>>> CellularAutomataSystem reactor');

      useEffect(() => { 

        console.log('>>>>>>>>>>>>>>>>>>> CellularAutomataSystem effect');

        const left = 0 - (cols * (size + space)) / 2
        let x = left;
        let y = bottom;
        let z = distance;

        for(let row = 0; row < rows; row++) {
          for(let col = 0; col < cols; col++) {
            const entity = createEntity();
            setComponent(entity, NameComponent, `cell-${row}-${col}`);
            setComponent(entity, VisibleComponent)
            setComponent(entity, TransformComponent, { position: new Vector3(x, y, z) });
            setComponent(entity, PrimitiveGeometryComponent, GEOMETRY_OFF);
            x += size + space;
          }
          x = left;
          y += size + space;
        }

      }, []);

    }

    return null;
  }
});

const nameComponentQuery = defineQuery([NameComponent]);
// nameComponentQuery.onEntityAdded = (entity) => {
// }

function getGeneratorParams() {
  const entities = nameComponentQuery();
  const generatorEntity = entities.find(entity => {
    const nameComponent = getComponent(entity, NameComponent);
    return nameComponent.startsWith('generator');
  });
  if(!generatorEntity) {
    return undefined
  }
  return {
      rows: 100,
      cols: 100,
      space: 0.1,
      bottom: 0.5,
      size: 0.5,
      distance: -2
  };
}

const CellularAutomataCollisionGroup = 0x0010;

const interactionGroups = getInteractionGroups(CellularAutomataCollisionGroup, CollisionGroups.Default)

const raycastComponentData = {
  type: SceneQueryType.Closest,
  origin: new Vector3(),
  direction: new Vector3(),
  maxDistance: 100,
  groups: interactionGroups
} as RaycastArgs

const inputSourceQuery = defineQuery([InputSourceComponent]);

function isClick() {
  const inputEntities = inputSourceQuery();
  for(const inputEntity of inputEntities) {
    const inputSource = getComponent(inputEntity, InputSourceComponent)
    const buttons = inputSource.buttons;
    if(buttons.PrimaryClick?.down) {
      return true;
    }
  }
  return false;
}

function getEntityAtPointer() {
  const pointerState = getState(InputState).pointerState
  const hits = Physics.castRayFromCamera(
    getComponent(Engine.instance.cameraEntity, CameraComponent),
    pointerState.position,
    getState(PhysicsState).physicsWorld,
    raycastComponentData
  )
  if (hits.length) {
    const hit = hits[0]
    const hitEntity = (hit.body?.userData as any)?.entity as Entity
    if (typeof hitEntity !== 'undefined') {
      return hitEntity;
    }
  }
  return undefined;
}

function getClickedEntity() {
  return isClick() ? getEntityAtPointer() : undefined;
}

export const CellularAutomataClickSystem = defineSystem({
  uuid: 'sb.cellularAutomata.click',
  insert: { after: AnimationSystemGroup },
  execute: () => {
    const clickedEntity = getClickedEntity();
    if(!clickedEntity) return;
    console.log('Clicked entity', clickedEntity);
    getCallback(clickedEntity, 'onClick')?.(clickedEntity);
  }
});

export default async () => {}
