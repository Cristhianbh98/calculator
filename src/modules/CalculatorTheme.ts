import { getState } from './settingState'
const {theme, updateSetting} = getState()

class CalculatorTheme {
  toggleThemeButton: HTMLElement

  constructor(toggleThemeButton: HTMLElement) {    
    this.toggleThemeButton = toggleThemeButton   
    
    if (theme === 'dark') this.changeToDarkTheme()    
    this.events()
  }

  // events
  events() {
    this.toggleThemeButton.addEventListener('click', () => this.toggleTheme())
  }

  // methods
  toggleTheme() {
    const currentTheme = this.toggleThemeButton.getAttribute('data-theme') ?? 'light'
    if (currentTheme === 'light') this.changeToDarkTheme()
    else this.changeToLightTheme()
  }

  changeToDarkTheme() {
    document.querySelector('html')?.classList.add('dark-mode')
    this.toggleThemeButton.setAttribute('data-theme', 'dark')
    updateSetting({setting: 'theme', newValue: 'dark'})
  }

  changeToLightTheme() {
    document.querySelector('html')?.classList.remove('dark-mode')
    this.toggleThemeButton.setAttribute('data-theme', 'light')
    updateSetting({setting: 'theme', newValue: 'light'})
  }
}

export default CalculatorTheme
