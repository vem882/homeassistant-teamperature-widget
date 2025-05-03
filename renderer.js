document.addEventListener('DOMContentLoaded', () => {
    try {
        config = JSON.parse(localStorage.getItem('ha_config'))
    } catch (e) {
        config = null
    }

    if (!config) {
        window.electronAPI.openConfigWindow()
        return
    }
    const settingsIcon = document.getElementById('settings-icon')
    if (settingsIcon) {
        settingsIcon.addEventListener('click', () => {
            window.electronAPI.openConfigWindow()
        })
    }
    // Get the config values from localStorage
    const { HA_URL, HA_TOKEN, ENTITY_ID } = config

    async function getTemperature() {
        try {
            const response = await fetch(`${HA_URL}/api/states/${ENTITY_ID}`, {
                headers: { "Authorization": "Bearer " + HA_TOKEN }
            })
            const data = await response.json()
            const lampotila = parseFloat(data.state)
            const tempElement = document.getElementById('temp')
            tempElement.innerHTML = `${lampotila.toFixed(1)} &deg;C`
            document.body.classList.remove('cold', 'normal', 'hot')
            tempElement.classList.remove('pulse')
            if (lampotila < 18) {
                document.body.classList.add('cold')
                tempElement.classList.add('pulse')
            } else if (lampotila >= 18 && lampotila <= 24) {
                document.body.classList.add('normal')
            } else {
                document.body.classList.add('hot')
                tempElement.classList.add('pulse')
            }
        } catch (error) {
            document.getElementById('temp').innerHTML = "Error!"
        }
    }

    setInterval(getTemperature, 10000)
    getTemperature()

    const lockIcon = document.getElementById('lock-icon')
    let locked = true
    const widget = document.getElementById('widget')

    lockIcon.addEventListener('click', (e) => {
        e.stopPropagation()
        locked = !locked
        updateLockIcon()
        document.body.classList.toggle('locked', locked)
        lockIcon.style.opacity = locked ? "1" : "0.7"
        widget.classList.toggle('drag', !locked)
        widget.classList.toggle('no-drag', locked)
    })

    // update the lock icon based on the locked state
    updateLockIcon()
})

