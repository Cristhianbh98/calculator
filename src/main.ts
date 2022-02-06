import './main.scss'

// Global var
const html = document.querySelector('html')
const historyContainer = document.getElementById('history-container')

// Change the theme
const toggleThemeButton = document.getElementById('toggle-theme')

toggleThemeButton?.addEventListener('click', () => {
  const currentTheme = toggleThemeButton?.getAttribute('data-theme')

  toggleTheme(currentTheme ? currentTheme : '')
})

function toggleTheme(currentTheme: string) {  
  if (currentTheme === 'light') {
    html?.classList.add('dark-mode')
    toggleThemeButton?.setAttribute('data-theme', 'dark')
  } else {
    html?.classList.remove('dark-mode')
    toggleThemeButton?.setAttribute('data-theme', 'light')
  }
}

// toggle history
const toggleHistoryButton = document.getElementById('toogle-history')

toggleHistoryButton?.addEventListener('click', () => {
  historyContainer?.classList.toggle('active')
})
