import './systems/CellularAutomataClickSystem';
import './components/CellularAutomataGeneratorComponent';
import './editors/CellularAutomataGeneratorComponentEditor';

// const ROWS = 100;
// const COLS = 100;
// const SPACE = 0.1;
// const BOTTOM = 0.5;
// const SIZE = 0.5;
// const DISTANCE = -2;
// const GEOMETRY_ON = {
//   "geometryType": GeometryTypeEnum.SphereGeometry,
//   "geometryParams": {
//     "radius": SIZE / 2,
//     "widthSegments": 32,
//     "heightSegments": 16,
//     "phiStart": 0,
//     "phiLength": 6.283185307179586,
//     "thetaStart": 0,
//     "thetaLength": 3.141592653589793
//   }
// } as const;
// const GEOMETRY_OFF = {
//   "geometryType": GeometryTypeEnum.BoxGeometry,
//   "geometryParams": {
//     "width": SIZE,
//     "height": SIZE,
//     "depth": SIZE,
//     "widthSegments": 1,
//     "heightSegments": 1,
//     "depthSegments": 1
//   }
// }

// getMutableState(ComponentShelfCategoriesState).Misc.merge([CellularAutomataGeneratorComponent])

// export const CellularAutomataGeneratorSystem = defineSystem({
//   uuid: 'sb.cellularAutomata.generator',
//   insert: { after: AnimationSystemGroup },
//   reactor: () => {

//     const params = getGeneratorParams();
//     if(params) {

//       const { rows, cols, space, bottom, size, distance } = params;

//       console.log('>>>>>>>>>>>>>>>>>>> CellularAutomataSystem reactor');

//       useEffect(() => { 

//         console.log('>>>>>>>>>>>>>>>>>>> CellularAutomataSystem effect');

//         const left = 0 - (cols * (size + space)) / 2
//         let x = left;
//         let y = bottom;
//         let z = distance;

//         for(let row = 0; row < rows; row++) {
//           for(let col = 0; col < cols; col++) {
//             const entity = createEntity();
//             setComponent(entity, NameComponent, `cell-${row}-${col}`);
//             setComponent(entity, VisibleComponent)
//             setComponent(entity, TransformComponent, { position: new Vector3(x, y, z) });
//             setComponent(entity, PrimitiveGeometryComponent, GEOMETRY_OFF);
//             x += size + space;
//           }
//           x = left;
//           y += size + space;
//         }

//       }, []);

//     }

//     return null;
//   }
// });

// const nameComponentQuery = defineQuery([NameComponent]);
// nameComponentQuery.onEntityAdded = (entity) => {
// }

// function getGeneratorParams() {
//   const entities = nameComponentQuery();
//   const generatorEntity = entities.find(entity => {
//     const nameComponent = getComponent(entity, NameComponent);
//     return nameComponent.startsWith('generator');
//   });
//   if(!generatorEntity) {
//     return undefined
//   }
//   return {
//       rows: 100,
//       cols: 100,
//       space: 0.1,
//       bottom: 0.5,
//       size: 0.5,
//       distance: -2
//   };
// }

export default async () => {}
