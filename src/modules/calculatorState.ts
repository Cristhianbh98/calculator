import create from 'zustand/vanilla'
import { getLocalStorage, setLocalStorage } from './utils'

//types
type tOperation = {
  operation: string,
  result: string
}

type tCalculatorState = {
  haveOperator: boolean,
  haveSeparatorPoint: boolean,
  history: tOperation[]
  input: string
}

type tUpdateCalculatorStateParameters = {
  setting: keyof tCalculatorState, 
  newValue: any
}

type tCalculatorStore = tCalculatorState & {
  updateCalculatorState: ({setting, newValue}: tUpdateCalculatorStateParameters) => void
}

// functionality
const key = 'calculator'
const initialCalculatorState: tCalculatorState = {
  haveOperator: false,
  haveSeparatorPoint: false,
  history: [],
  input: ''
}

const calculatorState: tCalculatorState = getLocalStorage(key) || initialCalculatorState

const store = create<tCalculatorStore>(set => ({
  ...calculatorState,
  updateCalculatorState: ({setting, newValue}: tUpdateCalculatorStateParameters) => set((state: tCalculatorState) => {
    const newState = {...state, [setting]: newValue }
    
    setLocalStorage(key, newState)
    return newState
  })
}))

export const { getState } = store
