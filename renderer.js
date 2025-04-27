document.addEventListener('DOMContentLoaded', () => {
    let config = window.electronAPI.config

    // Jos configia ei ole, näytä lomake
    if (!config) {
        document.getElementById('widget').style.display = 'none'
        const form = document.getElementById('config-form')
        form.style.display = 'block'
        form.addEventListener('submit', (e) => {
            e.preventDefault()
            const HA_URL = document.getElementById('ha-url').value
            const HA_TOKEN = document.getElementById('ha-token').value
            const ENTITY_ID = document.getElementById('ha-entity').value
            config = { HA_URL, HA_TOKEN, ENTITY_ID }
            window.electronAPI.saveConfig(config)
            location.reload()
        })
        return
    }

    const { HA_URL, HA_TOKEN, ENTITY_ID } = config

    async function haeLampotila() {
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
            document.getElementById('temp').innerHTML = "Virhe!"
        }
    }

    setInterval(haeLampotila, 30000)
    haeLampotila()

    let locked = true
    const lockIcon = document.getElementById('lock-icon')
    document.getElementById('widget').style.webkitAppRegion = 'no-drag'

    lockIcon.addEventListener('click', (e) => {
        e.stopPropagation()
        locked = !locked
        document.body.classList.toggle('locked', locked)
        lockIcon.style.opacity = locked ? "1" : "0.7"
        document.getElementById('widget').style.webkitAppRegion = locked ? 'no-drag' : 'drag'
    })
})


if (window.electronAPI.configMissing) {
    alert("Configuration file (config.json) is missing! Please enter your Home Assistant settings.");
}