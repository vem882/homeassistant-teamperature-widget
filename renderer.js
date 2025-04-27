document.addEventListener('DOMContentLoaded', () => {
    if (window.electronAPI.configMissing) {
        const popup = document.createElement('div')
        popup.style.position = 'fixed'
        popup.style.top = '30%'
        popup.style.left = '50%'
        popup.style.transform = 'translate(-50%, -50%)'
        popup.style.background = '#222'
        popup.style.color = '#fff'
        popup.style.padding = '24px'
        popup.style.borderRadius = '10px'
        popup.style.zIndex = '9999'
        popup.style.boxShadow = '0 2px 16px rgba(0,0,0,0.4)'
        popup.innerHTML = `
            <b>Configuration file missing!</b><br>
            Please enter your Home Assistant settings.<br><br>
            <label>URL:<br><input id="popup-ha-url" type="text" style="width:100%"></label><br>
            <label>Token:<br><input id="popup-ha-token" type="text" style="width:100%"></label><br>
            <label>Entity ID:<br><input id="popup-ha-entity" type="text" style="width:100%"></label><br><br>
            <button id="popup-ok">Save</button>
        `
        document.body.appendChild(popup)
        document.getElementById('popup-ok').onclick = () => {
            const HA_URL = document.getElementById('popup-ha-url').value
            const HA_TOKEN = document.getElementById('popup-ha-token').value
            const ENTITY_ID = document.getElementById('popup-ha-entity').value
            if (HA_URL && HA_TOKEN && ENTITY_ID) {
                window.electronAPI.saveConfig({ HA_URL, HA_TOKEN, ENTITY_ID })
                location.reload()
            } else {
                alert("Please fill all fields!")
            }
        }
    }
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
})