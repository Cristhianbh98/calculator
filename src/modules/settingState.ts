import create from 'zustand/vanilla'
import { getLocalStorage, setLocalStorage } from './utils'

// types
type tSettingState = {
  theme: string,
  isHistoryActive: boolean
}

type tUpdateSettingParameters = {
  setting: keyof tSettingState, 
  newValue: any
}

// functionality
const key = 'settings'
const initialSettingState: tSettingState = {
  theme: 'light',
  isHistoryActive: false
}

const settingState: tSettingState = getLocalStorage(key) || initialSettingState

const store = create<any>(set => ({
  ...settingState,
  updateSetting: ({setting, newValue}: tUpdateSettingParameters) => set((state: tSettingState) => {
    const newState = {...state, [setting]: newValue }
    
    setLocalStorage(key, newState)
    return newState
  })
}))

export const { getState, setState, subscribe, destroy } = store
