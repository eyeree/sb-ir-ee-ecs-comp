
import React from 'react'

import { useComponent } from '@etherealengine/ecs'
import InputGroup from '@etherealengine/editor/src/components/inputs/InputGroup'
import NumericInput from '@etherealengine/editor/src/components/inputs/NumericInput'
import NodeEditor from '@etherealengine/editor/src/components/properties/NodeEditor'
import {
  EditorComponentType,
  commitProperty,
  updateProperty
} from '@etherealengine/editor/src/components/properties/Util'
import AlbumIcon from '@mui/icons-material/Album'
import { CellularAutomataGeneratorComponent } from '../components/CellularAutomataGeneratorComponent'
import { ComponentShelfCategoriesState } from '@etherealengine/editor/src/components/element/ElementList'
import { getMutableState } from '@etherealengine/hyperflux'
import { ComponentEditorsState } from '@etherealengine/editor/src/functions/ComponentEditors'

export const CellularAutomataGeneratorComponentEditor: EditorComponentType = (props) => {
  const generatorComponent = useComponent(props.entity, CellularAutomataGeneratorComponent)
  return (
    <NodeEditor description={'Properties for generated simulation'} name={`Cellular Automata Generator`} {...props}>
      <InputGroup name="Rule" label="Automata Rule">
        <NumericInput
          value={generatorComponent.rule.value}
          onChange={updateProperty(CellularAutomataGeneratorComponent, 'rule')}
          onRelease={commitProperty(CellularAutomataGeneratorComponent, 'rule')}
          min={0}
          max={255}
        />
      </InputGroup>
      <InputGroup name="Rows" label="Number of Rows">
        <NumericInput
          value={generatorComponent.rows.value}
          onChange={updateProperty(CellularAutomataGeneratorComponent, 'rows')}
          onRelease={commitProperty(CellularAutomataGeneratorComponent, 'rows')}
          min={1}
          max={500}
        />
      </InputGroup>
      <InputGroup name="Columns" label="Number of Columns">
        <NumericInput
          value={generatorComponent.cols.value}
          onChange={updateProperty(CellularAutomataGeneratorComponent, 'cols')}
          onRelease={commitProperty(CellularAutomataGeneratorComponent, 'cols')}
          min={1}
          max={500}
        />
      </InputGroup>
    </NodeEditor>
  )
}

CellularAutomataGeneratorComponentEditor.iconComponent = AlbumIcon

getMutableState(ComponentShelfCategoriesState).Misc.merge([
  CellularAutomataGeneratorComponent
])
getMutableState(ComponentEditorsState).merge({ 
  [CellularAutomataGeneratorComponent.name]: CellularAutomataGeneratorComponentEditor 
})
