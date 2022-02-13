class ToggleTheme {
  toggleThemeButton: HTMLElement

  constructor(selector: string) {    
    this.toggleThemeButton = document.querySelector(selector)!    

    this.events()
  }

  // events
  events() {
    this.toggleThemeButton.addEventListener('click', () => this.changeTheme())
  }

  // methods
  changeTheme() {
    const currentTheme = this.toggleThemeButton.getAttribute('data-theme')

    this.toggleTheme(currentTheme ?? '')
  }

  toggleTheme(currentTheme: string) {
    if (currentTheme === 'light') {
      document.querySelector('html')?.classList.add('dark-mode')
      this.toggleThemeButton.setAttribute('data-theme', 'dark')
    } else {
      document.querySelector('html')?.classList.remove('dark-mode')
      this.toggleThemeButton.setAttribute('data-theme', 'light')
    }
  }
}

export default ToggleTheme
