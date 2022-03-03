import CalculatorTheme from './CalculatorTheme'
import CalculatorHistory from './CalculatorHistory'
import { getState } from './calculatorState'

const { updateCalculatorState } = getState()

// types
type tKeyOptions = {
  '0': () => void,
  '1': () => void,
  '2': () => void,
  '3': () => void,
  '4': () => void,
  '5': () => void,
  '6': () => void,
  '7': () => void,
  '8': () => void,
  '9': () => void,
  'point': () => void,
  'divide': () => void,
  'times': () => void,
  'minus': () => void,
  'plus': () => void,
  'clear': () => void,
  'erase': () => void,
  'equal': () => void,
  'percent': () => void
}

type tIndexOption = keyof tKeyOptions

type tOperation = {
  operation: string,
  result: string
}

// functionality
class Calculator {
  calculatorEL: HTMLElement
  calculatorTotalEl: HTMLElement
  keypad: HTMLElement
  historyContainerEl: HTMLElement
  deleteHistoryBtn: HTMLButtonElement
  inputEl: HTMLInputElement
  keyOptions: tKeyOptions

  constructor() {
    this.calculatorEL = <HTMLElement> document.querySelector('#calculator')
    this.inputEl = <HTMLInputElement> this.calculatorEL.querySelector('#input')
    this.deleteHistoryBtn = <HTMLButtonElement> this.calculatorEL.querySelector('#delete-history-btn')
    this.calculatorTotalEl = <HTMLElement> this.calculatorEL.querySelector('#calculator__total')
    this.historyContainerEl = <HTMLElement> this.calculatorEL.querySelector('#history__content')
    this.keypad = <HTMLElement> this.calculatorEL.querySelector('#calculator-keypad')

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

    getState().history.forEach(operation => this.createHistoryItem(operation, false))
    
    this.getResult()
    this.events()
  }

  // events
  events() {
    document.addEventListener('keyup', (e) => this.handleKeyboard(e.key))
    this.deleteHistoryBtn.addEventListener('click', () => this.deleteHistory())
    this.keypad.addEventListener('click', (e) => this.handleKeypad(e.target as HTMLElement))
    this.historyContainerEl.addEventListener('click', (e) => this.handleHistoryContainer(e.target as HTMLElement))
  }

  // methods
  handleKeyboard(key: string) {    
    if (!isNaN(parseInt(key))) this.keyOptions[<tIndexOption>key]()
    else if (key === '.') this.keyOptions['point']()
    else if (key === '+') this.keyOptions['plus']()
    else if (key === '-') this.keyOptions['minus']()
    else if (key === '/') this.keyOptions['divide']()
    else if (key === '*') this.keyOptions['times']()
    else if (key === 'Backspace') this.keyOptions['erase']()
    else if (key === 'Delete') this.keyOptions['clear']()
    else if (key === 'Enter') this.keyOptions['equal']()
  }

  handleKeypad(el: HTMLElement) {
    if (el.tagName !== 'BUTTON' && el.tagName !== 'svg' && el.tagName !== 'path') return
    if (el.tagName === 'svg' || el.tagName === 'path') el = this.findButtonKey(el)
    
    const keyData = <tIndexOption> el.getAttribute('data-key')
    this.keyOptions[keyData]()
  }

  findButtonKey(el: HTMLElement) {
    while(el.tagName !== 'BUTTON') {
      el = <HTMLElement>el.parentElement
    }
    return el
  }

  // handle input
  updateInput() {
    const { input } = getState()
    this.inputEl.value = input
  }

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

  clearInput() {
    this.resetState()
    this.calculatorTotalEl.textContent = '0'
    this.inputEl.value = ''
    updateCalculatorState({setting: 'input', newValue: ''})
  }

  // operator, point, state
  resetState() {
    updateCalculatorState({setting: 'haveOperator', newValue: false})
    updateCalculatorState({setting: 'haveSeparatorPoint', newValue: false})
  }

  addPoint() {
    const { haveSeparatorPoint } = getState()
    if (!haveSeparatorPoint) {
      updateCalculatorState({setting: 'haveSeparatorPoint', newValue: true})
      this.addInput('.')
    }
  }

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

  getPercent() {
    const operation = this.getOperation()
    const number = Math.abs(parseFloat(operation[0]))
    const result = parseFloat((number / 100).toFixed(4))

    this.addResult(result.toString())
  }

  getOperation(): string[] {
    const { input } = getState()
    let operation: string[] = []
    const separators = ['+', '-', '÷', '×']
    
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

  addResult(result: string) {
    this.updateHistory(result)
    this.resetState()
    this.clearInput()

    this.updateTotal(result)
    this.addInput(result === '0' ? '': result)
  }

  updateTotal(total: string) {
    this.calculatorTotalEl.textContent = total
  }

  // handle history
  updateHistory(result: string) {
    const {history, input} = getState()

    const lastOperation: tOperation = history[0]

    if(result === '0' || lastOperation?.result === result) return

    const newOperation: tOperation = {
      operation: input,
      result: result
    }

    this.createHistoryItem(newOperation)

    const newHistory = [newOperation, ...history]
    updateCalculatorState({setting: 'history', newValue: newHistory})
  }

  deleteHistory() {
    this.historyContainerEl.innerHTML = ''
    updateCalculatorState({setting: 'history', newValue: []})

    this.clearInput()
  }

  createHistoryItem(operation: tOperation, insertBefore = true) {
    const historyItemEl = document.createElement('button')
    historyItemEl.classList.add('calculator__history__item')
    historyItemEl.classList.add('history-item')
    historyItemEl.setAttribute('data-operation', operation.operation)
    historyItemEl.setAttribute('data-result', operation.result)
    historyItemEl.textContent = `${operation.operation} = ${operation.result}`

    if (insertBefore) this.historyContainerEl.insertBefore(historyItemEl, this.historyContainerEl.firstChild)
    else this.historyContainerEl.appendChild(historyItemEl)
  }

  handleHistoryContainer(el: HTMLElement) {
    if (el.classList.contains('history-item')) {
      const operation = el.getAttribute('data-operation')
      const result = <string> el.getAttribute('data-result')
      
      updateCalculatorState({setting: 'input', newValue: operation})
      this.updateInput()
      this.updateTotal(result)
    }
  }
}

export default Calculator
