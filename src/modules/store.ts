import create from 'zustand/vanilla'

type tsettingState = {
  theme: string,
  isHistoryActive: boolean
}

type tstore = {
  theme: string,
  isHistoryActive: boolean
  updateSetting: ({setting, newValue}: {setting: keyof tsettingState, newValue: any}) => void
}

const getLocalStorage = (key: string) => {
  const item = window.localStorage.getItem(key)
  return item !== null ? JSON.parse(item) : null
}
const setLocalStorage = (key: string, value: object) => window.localStorage.setItem(key, JSON.stringify(value))

const appInitialState: tsettingState = getLocalStorage('appState') || {
  theme: 'light',
  isHistoryActive: false
}

const store = create <tstore> (set => ({
  ...appInitialState,
  updateSetting: ({setting, newValue}: {setting: keyof tsettingState, newValue: any}) => set((state: tsettingState) => {
    const { [setting]: removeOldSetting, ...restOfState } = state

    const newState = {
      ...restOfState,
      [setting]: newValue
    }
    
    setLocalStorage('appState', newState)
    return newState
  })
}))

export const { 
  getState, 
  setState, 
  subscribe, 
  destroy 
} = store
