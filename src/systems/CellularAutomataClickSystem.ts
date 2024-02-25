import { defineQuery, getComponent, Engine, Entity, defineSystem, AnimationSystemGroup } from "@etherealengine/ecs";
import { getState } from "@etherealengine/hyperflux";
import { CameraComponent } from "@etherealengine/spatial/src/camera/components/CameraComponent";
import { getCallback } from "@etherealengine/spatial/src/common/CallbackComponent";
import { InputSourceComponent } from "@etherealengine/spatial/src/input/components/InputSourceComponent";
import { InputState } from "@etherealengine/spatial/src/input/state/InputState";
import { RaycastArgs, Physics } from "@etherealengine/spatial/src/physics/classes/Physics";
import { CollisionGroups } from "@etherealengine/spatial/src/physics/enums/CollisionGroups";
import { getInteractionGroups } from "@etherealengine/spatial/src/physics/functions/getInteractionGroups";
import { PhysicsState } from "@etherealengine/spatial/src/physics/state/PhysicsState";
import { SceneQueryType } from "@etherealengine/spatial/src/physics/types/PhysicsTypes";
import { Vector3 } from "three";
import { CellularAutomataClickCollisionGroup } from "../components/CellularAutomataClickableComponent";

const interactionGroups = getInteractionGroups(CellularAutomataClickCollisionGroup, CollisionGroups.Default)

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
    // console.log('Clicked entity', clickedEntity);
    getCallback(clickedEntity, 'onClick')?.(clickedEntity);
  }
});