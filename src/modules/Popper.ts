import { createPopper, Instance, Placement } from '@popperjs/core'

class Popper {
  button: HTMLElement
  tooltip: HTMLElement
  popperInstance: Instance

  constructor(buttonSelector: string, tooltipSelector: string, placement: Placement = 'top') {
    this.button = document.querySelector(buttonSelector)!
    this.tooltip = document.querySelector(tooltipSelector)!

    this.popperInstance = createPopper(this.button, this.tooltip, {      
      placement: placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8]
          }
        }
      ]      
    })
    this.events()
  }

  // events
  events() {
    const showEvents = ['mouseenter', 'focus']
    const hideEvents = ['mouseleave', 'blur']

    showEvents.forEach((event) => {
      this.button.addEventListener(event, () => this.show());
    })
    
    hideEvents.forEach((event) => {
      this.button.addEventListener(event, () => this.hide());
    })
  }

  // methods
  show() {
    this.tooltip.setAttribute('data-show', '')
    this.popperInstance.update()
  }

  hide() {
    this.tooltip.removeAttribute('data-show')
  }
}

export default Popper
