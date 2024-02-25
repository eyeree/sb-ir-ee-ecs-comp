import { defineComponent, setComponent, useComponent, useEntityContext } from "@etherealengine/ecs";
import { ColliderComponent } from "@etherealengine/spatial/src/physics/components/ColliderComponent";
import { RigidBodyComponent } from "@etherealengine/spatial/src/physics/components/RigidBodyComponent";
import { useEffect } from "react";
import { Shape } from "@etherealengine/spatial/src/physics/types/PhysicsTypes";

export const CellularAutomataClickCollisionGroup = 0x0010;

export const CellularAutomataClickableComponent = defineComponent({
  name: 'CellularAutomataClickableComponent',
  jsonID: 'sb.cellularAutomata.clickable',

  onInit: (entity) => {
    return {
      shape: 'box' as Shape
    }
  },

  reactor: function () {

    const entity = useEntityContext();
    const clickableComponent = useComponent(entity, CellularAutomataClickableComponent);
    
    useEffect(() => {
      setComponent(entity, ColliderComponent, { 
        shape: clickableComponent.shape.value, 
        collisionMask: CellularAutomataClickCollisionGroup 
      });
      setComponent(entity, RigidBodyComponent, { type: 'fixed'});
    }, [clickableComponent.shape.value]);

    return null;
  }
});
