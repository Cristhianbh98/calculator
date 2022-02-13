class Calculator {
  calculatorEL: HTMLElement
  historyContainer: HTMLElement
  toggleHistoryButton: HTMLElement

  constructor() {
    this.calculatorEL = document.querySelector('#calculator')!
    this.historyContainer = document.querySelector('#history-container')!
    this.toggleHistoryButton = document.querySelector('#toggle-history-btn')!

    this.events()
  }

  // events
  events() {
    this.toggleHistoryButton.addEventListener('click', () => this.toggleHistory())
  }

  // methods
  toggleHistory() {
    this.historyContainer.classList.toggle('active')
  }
}

export default Calculator
