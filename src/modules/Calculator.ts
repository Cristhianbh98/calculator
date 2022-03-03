import CalculatorTheme from './CalculatorTheme'
import CalculatorHistory from './CalculatorHistory'
import { getState } from './calculatorState'

const { updateCalculatorState } = getState()

type tkeyOptions = {
  [key: string]: () => void
}

class Calculator {
  calculatorEL: HTMLElement
  calculatorResume: HTMLElement
  keypad: HTMLElement
  inputElement: HTMLInputElement

  keyOptions: tkeyOptions

  constructor() {
    this.calculatorEL = <HTMLElement> document.querySelector('#calculator')
    this.inputElement = <HTMLInputElement> this.calculatorEL.querySelector('#input')
    this.calculatorResume = <HTMLElement> this.calculatorEL.querySelector('#calculator__total')
    this.keypad = <HTMLElement> document.querySelector('#calculator-keypad')

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

    new CalculatorTheme(<HTMLElement> this.calculatorEL.querySelector('#toggle-theme-btn'))
    new CalculatorHistory(<HTMLElement> this.calculatorEL.querySelector('#toggle-history-btn'), <HTMLElement> this.calculatorEL.querySelector('#history-container'))

    this.getResult()
    this.events()
  }

  // events
  events() {
    document.addEventListener('keyup', (e) => this.handleKeyboard(e))
    this.keypad.addEventListener('click', (e) => this.handleKey(e.target as HTMLElement))
  }

  // methods
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
  addInput(char: string) {
    const { input } = getState()

    const newInput = input + char
    updateCalculatorState({setting: 'input', newValue: newInput})

    this.updateInput()
  }

  eraseInput() {
    const { input } = getState()
    const lastChar = input.slice(-1)

    if (lastChar === '.') updateCalculatorState({setting: 'haveSeparatorPoint', newValue: false})
    else if (isNaN(parseInt(lastChar))) updateCalculatorState({setting: 'haveOperator', newValue: false})

    const newInput = input.slice(0, -1)
    updateCalculatorState({setting: 'input', newValue: newInput})
    this.updateInput()
  }

  updateInput() {
    const { input } = getState()
    this.inputElement.value = input
  }

  clearInput() {
    this.resetState()
    this.calculatorResume.textContent = '0'
    this.inputElement.value = ''
    updateCalculatorState({setting: 'input', newValue: ''})
  }

  // handle state
  resetState() {
    updateCalculatorState({setting: 'haveOperator', newValue: false})
    updateCalculatorState({setting: 'haveSeparatorPoint', newValue: false})
  }

  // handle point
  addPoint() {
    const { haveSeparatorPoint } = getState()
    if (!haveSeparatorPoint) {
      updateCalculatorState({setting: 'haveSeparatorPoint', newValue: true})
      this.addInput('.')
    }
  }

  // handle Operator
  addOperator(operator: string) {
    const { haveOperator, input } = getState()
    const lastChar: number = parseInt(input.slice(-1))

    if (!haveOperator) {
      this.addInput(operator)

      updateCalculatorState({setting: 'haveSeparatorPoint', newValue: false})
      updateCalculatorState({setting: 'haveOperator', newValue: true})
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
    const { input } = getState()
    let operation: string[] = []
    const separators: string[] = ['+', '-', '÷', '×']
    
    for (let i = 0; i < separators.length; i++) {
      operation = input.split(separators[i])
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
    this.addInput(result === '0' ? '': result)
  }
}

export default Calculator
