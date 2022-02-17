// import css
import './main.scss'

// import modules
import Calculator from './modules/Calculator'
import ToggleTheme from './modules/ToggleTheme'
import Popper from './modules/Popper'

// instance class
new Calculator()
new ToggleTheme('#toggle-theme-btn')

// popper
new Popper('#toggle-theme-btn', '#toggle-theme-btn-tooltip')
new Popper('#toggle-history-btn', '#toggle-history-btn-tooltip')
new Popper('#delete-history-btn', '#delete-history-btn-tooltip', 'top-end')
