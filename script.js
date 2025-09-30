aktueller_wettbewerb = 44;

wettbewerb_nummer = aktueller_wettbewerb;

optionen = "<option value='⚫'>⚫ - Ohne meine Teilnahme</option>\
            <option value='⚪'>⚪ - Noch nicht gestartet</option>\
            <option value='🟡'>🟡 - In Bearbeitung</option>\
            <option value='🔵'>🔵 - Wird überprüft</option>\
            <option value='🟢'>🟢 - Erster Preis</option>\
            <option value='🟠'>🟠 - Zweiter Preis</option>\
            <option value='🟤'>🟤 - Dritter Preis</option>\
            <option value='🔴'>🔴 - Kläglich Gescheitert</option>"

optionen_endrunde = "<option value='⚫'>⚫ - Ohne meine Teilnahme</option>\
            <option value='⚪'>⚪ - Noch nicht gestartet</option>\
            <option value='🟡'>🟡 - In Bearbeitung</option>\
            <option value='🔵'>🔵 - Wird überprüft</option>\
            <option value='🟢'>🟢 - Bundessieger</option>\
            <option value='🟠'>🟠 - Preisträger</option>\
            <option value='🟤'>🟤 - Sonderpreis</option>\
            <option value='🔴'>🔴 - Kläglich Gescheitert</option>"

window.addEventListener("load", (event) => {
    wettbewerbe_container = document.getElementById("wettbewerbe");

    fuege_naechsten_wettbewerb_hinzu();
    fuege_naechsten_wettbewerb_hinzu();
    fuege_naechsten_wettbewerb_hinzu();

    document.getElementById("wettbewerb_" + aktueller_wettbewerb + "_runde_1").value = "🟡";
    document.getElementById("wettbewerb_" + aktueller_wettbewerb + "_runde_2").value = "⚪";
    document.getElementById("wettbewerb_" + aktueller_wettbewerb + "_runde_3").value = "⚪";

    code_input = document.getElementById("code");
    code_input.addEventListener("enter", code_importieren);
    hinzufuegen_button = document.getElementById("hinzufuegen");
    hinzufuegen_button.addEventListener("click", fuege_naechsten_wettbewerb_hinzu);
    entfernen_button = document.getElementById("entfernen");
    entfernen_button.addEventListener("click", entferne_letzten_wettbewerb);
    trennen_checkbox = document.getElementById("trennen");
    trennen_checkbox.addEventListener("change", ausgewaehlt);
    importieren_button = document.getElementById("importieren");
    importieren_button.addEventListener("click", code_importieren);

    ausgewaehlt();
});

function fuege_naechsten_wettbewerb_hinzu() {
    if (wettbewerb_nummer < 1) { return }
    wettbewerb_html = "<h2>" + wettbewerb_nummer + ". Bundeswettbewerb Informatik</h2>\
        <div class='runden'><div class='runde'>Runde 1: <select class='runde_select' id='wettbewerb_" + wettbewerb_nummer + "_runde_1' onchange='ausgewaehlt()'>" + optionen + "</select></div>\
        <div class='runde'>Runde 2: <select class='runde_select' id='wettbewerb_" + wettbewerb_nummer + "_runde_2' onchange='ausgewaehlt()'>" + optionen + "</select></div>\
        <div class='runde'>Runde 3: <select class='runde_select' id='wettbewerb_" + wettbewerb_nummer + "_runde_3' onchange='ausgewaehlt()'>" + optionen_endrunde + "</select></div></div>\
        <div hidden class='ungueltig' id='wettbewerb_" + wettbewerb_nummer + "_ungueltig'>⚠️ Ungültige Auswahl</div>";
    wettbewerb_div = document.createElement('div');
    wettbewerb_div.id = "wettbewerb_" + wettbewerb_nummer;
    wettbewerb_div.innerHTML = wettbewerb_html;
    wettbewerbe_container.insertBefore(wettbewerb_div, wettbewerbe_container.firstChild);
    wettbewerb_nummer--;
}

function entferne_letzten_wettbewerb() {
    if (wettbewerb_nummer + 2 > aktueller_wettbewerb) { return }
    wettbewerbe_container.firstChild.remove();
    wettbewerb_nummer++;
    ausgewaehlt();
}

function ausgewaehlt() {
    code = ""
    for (const wettbewerb_container of wettbewerbe_container.children) {
        runde_1 = document.getElementById(wettbewerb_container.id + "_runde_1").value;
        runde_2 = document.getElementById(wettbewerb_container.id + "_runde_2").value;
        runde_3 = document.getElementById(wettbewerb_container.id + "_runde_3").value;
        ungueltig = false;
        if ((["⚪", "⚫"].includes(runde_1) && !["⚪", "⚫"].includes(runde_2))
            || (["⚪", "⚫"].includes(runde_2) && !["⚪", "⚫"].includes(runde_3))) {
            // Wenn man an einer Runde nicht teilnimmt, kann man auch nicht an der folgenden teilnehmen
            ungueltig = true;
        } else if ((["🟡", "🔵"].includes(runde_1) && !["⚪", "⚫", "🟡"].includes(runde_2))
            || (["🟡", "🔵"].includes(runde_2) && !["⚪", "⚫"].includes(runde_3))) {
            // Wenn Runde 1 läuft, kann Runde 2 noch nicht bewertet werden
            ungueltig = true;
        } else if ((!["🟢", "🟠"].includes(runde_1) && !["⚪", "⚫"].includes(runde_2))
            || (!["🟢"].includes(runde_2) && !["⚪", "⚫"].includes(runde_3))) {
            // Wenn man keinen 1. oder 2. Preis hat, kommt man nicht in die 2. Runde
            // Ohne 1. Preis kommt man nicht in die 3. Runde
            ungueltig = true;
        }
        document.getElementById(wettbewerb_container.id + "_ungueltig").hidden = !ungueltig;
        wettbewerb_code = runde_1 + runde_2 + runde_3
        if (wettbewerb_code == "⚫⚫⚫" && code == "") {
            continue;
        }
        if (code != "" && trennen_checkbox.checked) {
            code += "|";
        }
        code += wettbewerb_code
    }
    code_input.value = code
}

function code_importieren() {
    code = "|" + code_input.value;
    i = code.length - 1;
    wettbewerb_nummer_import = aktueller_wettbewerb;
    wettbewerb_nummer = aktueller_wettbewerb
    wettbewerbe_container.innerHTML = "";
    unvollstaendig = false;
    while (i > 1) {
        for (let runde = 3; runde > 0; runde--) {
            runde_code = "";
            while (true) {
                if (["⚫", "⚪"].includes(code[i])) {
                    runde_code = code[i];
                    i -= 1;
                    break
                } else if (["🟡", "🔵", "🟢", "🟠", "🟤", "🔴"].includes(code[i - 1] + code[i])) {
                    runde_code = code[i - 1] + code[i];
                    i -= 2;
                    break;
                } else {
                    i -= 1;
                    if (i <= 0) {
                        if (runde == 3) {
                            ausgewaehlt();
                            return;
                        }
                        unvollstaendig = true;
                        break
                    }
                }
            }
            if (unvollstaendig) {
                break;
            }
            if (runde == 3) {
                fuege_naechsten_wettbewerb_hinzu();
            }
            document.getElementById("wettbewerb_" + wettbewerb_nummer_import + "_runde_" + runde).value = runde_code;
        }
        if (unvollstaendig) {
            break;
        }
        if (code[i] == '|') {
            i--;
        }
        wettbewerb_nummer_import--;
    }
    if (unvollstaendig) {
        entferne_letzten_wettbewerb();
        alert("Unvollständiger Code! Anzahl der Kreise muss durch 3 teilbar sein.");
    }
    ausgewaehlt();
}
