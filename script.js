let wettbewerb_nummer = aktueller_wettbewerb = new Date().getFullYear() - 1982 + (new Date().getMonth() >= 8)

let optionen = [
    ["Ohne meine Teilnahme"],
    ["Noch nicht gestartet"],
    ["In Bearbeitung"],
    ["Wird überprüft"],
    ["Erster Preis", "Bundessieger"],
    ["Zweiter Preis", "Preisträger"],
    ["Dritter Preis", "Sonderpreis"],
    ["Kläglich Gescheitert"],
]

let farb_ref = ["⚫", "⚪", "🟡", "🔵", "🟢", "🟠", "🟤", "🔴"]
let numb_ref = { "⚫": 0, "⚪": 1, "🟡": 2, "🔵": 3, "🟢": 4, "🟠": 5, "🟤": 6, "🔴": 7 }

let wettbewerbe_container = document.getElementById("wettbewerbe")
let code_input = document.getElementById("code")
code_input.addEventListener("enter", code_importieren)
let hinzufuegen_button = document.getElementById("hinzufuegen")
hinzufuegen_button.addEventListener("click", fuege_naechsten_wettbewerb_hinzu)
let entfernen_button = document.getElementById("entfernen")
entfernen_button.addEventListener("click", entferne_letzten_wettbewerb)
let trennen_checkbox = document.getElementById("trennen")
trennen_checkbox.addEventListener("change", ausgewaehlt)
let importieren_button = document.getElementById("importieren")
importieren_button.addEventListener("click", code_importieren)

code_input.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        event.preventDefault()
        code_importieren()
        code_input.blur()
    }
});

fuege_naechsten_wettbewerb_hinzu([2, 1, 1])
fuege_naechsten_wettbewerb_hinzu()
fuege_naechsten_wettbewerb_hinzu()

ausgewaehlt()

function optionen_html(runde) {
    let result = ``
    for (let i = 0; i < optionen.length; i++) {
        result += `<option value="${i}">${farb_ref[i]} - ${optionen[i][runde < 3 ? 0 : optionen[i].length - 1]}</option>\n`
    }
    return result
}
function wettbewerb_html() {
    let result = `<h2>${wettbewerb_nummer}. Bundeswettbewerb Informatik</h2>\n<div class='runden'>\n`
    for (let i = 1; i <= 3; i++) {
        result += `<div class='runde'>Runde ${i}: <br><select class='runde_select' id='wettbewerb_${wettbewerb_nummer}_runde_${i}' onchange='ausgewaehlt()'>${optionen_html(i)}</select></div>\n`
    }
    return result + `<div hidden class='ungueltig' id='wettbewerb_${wettbewerb_nummer}_ungueltig'>⚠️ Ungültige Auswahl</div>`
}
function fuege_naechsten_wettbewerb_hinzu(circles = [0, 0, 0]) {
    if (wettbewerb_nummer < 1) { return }
    let wettbewerb_div = document.createElement('div')
    wettbewerb_div.id = "wettbewerb_" + wettbewerb_nummer
    wettbewerb_div.innerHTML = wettbewerb_html()
    wettbewerbe_container.insertBefore(wettbewerb_div, wettbewerbe_container.firstChild)
    for (let i = 0; i < 3; i++) {
        document.getElementById(`wettbewerb_${wettbewerb_nummer}_runde_${i + 1}`).value = circles[i] || 0
    }
    wettbewerb_nummer--
    ausgewaehlt()
}

function entferne_letzten_wettbewerb() {
    if (wettbewerb_nummer + 2 > aktueller_wettbewerb) { return }
    wettbewerbe_container.firstChild.remove()
    wettbewerb_nummer++
    ausgewaehlt()
}

function ausgewaehlt() {
    let code = ""
    for (let i = wettbewerb_nummer + 1; i <= aktueller_wettbewerb; i++) {
        let runde = [,]
        for (let j = 1; j <= 3; j++) {
            runde.push(+document.getElementById(`wettbewerb_${i}_runde_${j}`).value)
        }
        let ungueltig = (
            (runde[1] <= 1 && runde[2] > 1) ||
            (runde[2] <= 1 && runde[3] > 1) ||
            ((runde[1] == 2 || runde[1] == 3) && runde[2] > 1) ||
            ((runde[1] == 2 || runde[1] == 3) && runde[3] > 1) ||
            (runde[1] != 4 && runde[1] != 5 && runde[2] > 1) ||
            (runde[2] != 4 && runde[3] > 1)
        )
        document.getElementById(`wettbewerb_${i}_ungueltig`).hidden = !ungueltig;
        let wettbewerb_code = farb_ref[runde[1]] + farb_ref[runde[2]] + farb_ref[runde[3]]
        code += (code != "" && trennen_checkbox.checked ? "|" : "") + (wettbewerb_code == "⚫⚫⚫" && code == "" ? "" : wettbewerb_code)
    }
    code_input.innerText = code
}

function code_importieren() {
    let code = [...code_input.innerText]
    let numList = []
    for (let i = 0; i < code.length; i++) {
        if (code[i] in numb_ref) {
            numList.push(numb_ref[code[i]])
        }
    }

    if (numList.length % 3) {
        alert("Unvollständiger Code! Anzahl der Kreise muss durch 3 teilbar sein.")
        return
    }
    wettbewerbe_container.innerHTML = ""
    wettbewerb_nummer = aktueller_wettbewerb
    for (let i = numList.length - 1; i > 1; i -= 3) {
        fuege_naechsten_wettbewerb_hinzu([numList[i - 2], numList[i - 1], numList[i]])
    }
    ausgewaehlt()
}