type tkeyOptions = {
  [key: string]: () => void
}

type tCalculatorState = {
  haveOperator: boolean,
  haveSeparatorPoint: boolean
}

class Calculator {
  calculatorEL: HTMLElement
  calculatorResume: HTMLElement
  historyContainer: HTMLElement
  toggleHistoryButton: HTMLElement
  keypad: HTMLElement

  inputHistory: string
  inputElement: HTMLInputElement

  calculatorState: tCalculatorState

  keyOptions: tkeyOptions

  constructor() {
    this.calculatorEL = <HTMLElement> document.querySelector('#calculator')
    this.historyContainer = <HTMLElement> document.querySelector('#history-container')
    this.toggleHistoryButton = <HTMLElement> document.querySelector('#toggle-history-btn')
    this.keypad = <HTMLElement> document.querySelector('#calculator-keypad')
    this.calculatorResume = <HTMLElement> document.querySelector('#calculator__resume')

    this.inputHistory = ''
    this.inputElement = <HTMLInputElement> document.querySelector('#input-history')

    this.keyOptions = {
      '0': () => this.addInput('0'),
      '1': () => this.addInput('1'),
      '2': () => this.addInput('2'),
      '3': () => this.addInput('3'),
      '4': () => this.addInput('4'),
      '5': () => this.addInput('5'),
      '6': () => this.addInput('6'),
      '7': () => this.addInput('7'),
      '8': () => this.addInput('8'),
      '9': () => this.addInput('9'),
      'point': () => this.addPoint(),
      'divide': () => this.addOperator('\u00F7'),
      'times': () => this.addOperator('\u00d7'),
      'minus': () => this.addOperator('-'),
      'plus': () => this.addOperator('+'),
      'clear': () => this.clearInput(),
      'erase': () => this.eraseInput(),
      'equal': () => this.getResult(),
      'percent': () => this.getPercent()
    }

    this.calculatorState = {
      haveOperator: false,
      haveSeparatorPoint: false
    }

    this.events()
  }

  // events
  events() {
    this.toggleHistoryButton.addEventListener('click', () => this.toggleHistory())
    this.keypad.addEventListener('click', (e) => this.handleKey(e.target as HTMLElement))
    document.addEventListener('keyup', (e) => this.handleKeyboard(e))
  }

  // methods
  toggleHistory() {
    this.historyContainer.classList.toggle('active')
  }

  handleKeyboard(e: KeyboardEvent) {
    e.preventDefault()
    const key = e.key
    
    if (!isNaN(parseInt(key))) this.keyOptions[key]()
    else if (key === '.') this.keyOptions['point']()
    else if (key === '+') this.keyOptions['plus']()
    else if (key === '-') this.keyOptions['minus']()
    else if (key === '/') this.keyOptions['divide']()
    else if (key === '*') this.keyOptions['times']()
    else if (key === 'Backspace') this.keyOptions['erase']()
    else if (key === 'Delete') this.keyOptions['clear']()
    else if (key === 'Enter') this.keyOptions['equal']()
  }

  handleKey(el: HTMLElement) {
    if (el.tagName !== 'BUTTON' && el.tagName !== 'svg' && el.tagName !== 'path') return
    if (el.tagName === 'svg' || el.tagName === 'path') el = this.findButtonKey(el)
    
    const keyData = <string> el.getAttribute('data-key')
    this.keyOptions[keyData]()
  }

  findButtonKey(el: HTMLElement) {
    while(el.tagName !== 'BUTTON') {
      el = <HTMLElement>el.parentElement
    }

    return el
  }

  // handle input
  addInput(input: string) {
    this.inputHistory += input

    this.updateInput()
  }

  eraseInput() {
    const lastChar: string = this.inputHistory.slice(-1)

    if (lastChar === '.') this.changeState({ ...this.calculatorState, haveSeparatorPoint: false })
    else if (isNaN(parseInt(lastChar))) this.changeState({ ...this.calculatorState, haveOperator: false })

    this.inputHistory = this.inputHistory.slice(0, -1)
    this.updateInput()
  }

  updateInput() {
    this.inputElement.value = this.inputHistory
  }

  clearInput() {
    this.resetState()
    this.calculatorResume.textContent = '0'
    this.inputElement.value = ''
    this.inputHistory = ''
  }

  // handle state
  resetState() {
    this.calculatorState = {
      haveOperator: false,
      haveSeparatorPoint: false
    }
  }

  changeState(newCalculatorState: tCalculatorState) {
    this.calculatorState = newCalculatorState
  }

  // handle point
  addPoint() {
    const { haveSeparatorPoint } = this.calculatorState
    if (!haveSeparatorPoint) {
      this.changeState({ ...this.calculatorState, haveSeparatorPoint: true })
      this.addInput('.')
    }
  }

  // handle Operator
  addOperator(operator: string) {
    const { haveOperator } = this.calculatorState
    const lastChar: number = parseInt(this.inputHistory.slice(-1))

    if (!haveOperator) {
      this.addInput(operator)

      this.changeState({
        haveSeparatorPoint:  false,
        haveOperator: true
      })
    } else if (!isNaN(lastChar)) {
      this.getResult()
      this.addOperator(operator)
    }
  }

   // handle operation
   getResult() {
    const operation = this.getOperation()
    let result = this.makeOperation(operation)
    if (result % 1 !== 0) result = parseFloat(result.toFixed(4))

    this.addResult(result.toString())
  }

  getOperation(): string[] {
    let operation: string[] = []
    const separators: string[] = ['+', '-', '÷', '×']
    
    for (let i = 0; i < separators.length; i++) {
      operation = this.inputHistory.split(separators[i])
      if (operation.length > 1) {

        if (operation[0] === '' && separators[i] === '-') {
          operation[0] = '-' + operation[1]
          operation[1] = operation[2]
          operation.pop()
        }

        operation.push(separators[i])
        break
      }
    }

    return operation
  }

  makeOperation(operation: string[]): number {
    const operator = operation[2]
    const number1 = this.getNumber(operation[0] ?? '')
    const number2 = this.getNumber(operation[1] ?? '', operator)

    if (operator === '+') return number1 + number2
    else if (operator === '-') return number1 - number2
    else if (operator === '÷') return number1 / number2
    else if (operator === '×') return number1 * number2
    else return this.getNumber(operation[0])
  }

  getNumber(number: string, operator: string = '+') {
    if (isNaN(parseFloat(number)) && (operator === '+' || operator === '-')) return 0
    else if (isNaN(parseFloat(number))) return 1

    return parseFloat(number)
  }

  getPercent() {
    const operation = this.getOperation()
    const number = Math.abs(parseFloat(operation[0]))
    const result = number / 100

    this.addResult(result.toString())
  }

  addResult(result: string) {
    this.resetState()
    this.clearInput()

    this.calculatorResume.textContent = result
    this.addInput(result)
  }
}

export default Calculator
