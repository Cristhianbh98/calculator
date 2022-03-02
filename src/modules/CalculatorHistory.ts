import { getState } from './store'
const {isHistoryActive, updateSetting} = getState()

class CalculatorHistory {
  toggleHistoryButton: HTMLElement
  historyContainer: HTMLElement

  constructor(toggleHistoryButton: HTMLElement, historyContainer: HTMLElement) {
    this.toggleHistoryButton = toggleHistoryButton
    this.historyContainer = historyContainer

    if (isHistoryActive) this.activeHistory()

    this.events()
  }

  // events
  events() {
    this.toggleHistoryButton.addEventListener('click', () => this.toggleHistory())
  }

  // methods
  toggleHistory() {
    if (this.historyContainer.classList.contains('active')) this.inactiveHistory()
    else this.activeHistory()
  }

  activeHistory() {
    this.historyContainer.classList.add('active')
    updateSetting({setting: 'isHistoryActive', newValue: true})
  }

  inactiveHistory() {
    this.historyContainer.classList.remove('active')
    updateSetting({setting: 'isHistoryActive', newValue: false})
  }
}

export default CalculatorHistory
