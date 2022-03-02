// import css
import './main.scss'

// import modules
import Calculator from './modules/Calculator'
import Popper from './modules/Popper'

// instances
new Calculator()

new Popper('#toggle-theme-btn', '#toggle-theme-btn-tooltip')
new Popper('#toggle-history-btn', '#toggle-history-btn-tooltip')
new Popper('#delete-history-btn', '#delete-history-btn-tooltip', 'top-end')
