wettbewerb_nummer = 44;

optionen = "<option value='⚫'>⚫ - Ohne meine Teilnahme</option>\
            <option value='⚪'>⚪ - Noch nicht gestartet</option>\
            <option value='🟡'>🟡 - In Bearbeitung</option>\
            <option value='🔵'>🔵 - Wird überprüft</option>\
            <option value='🟢'>🟢 - Erster Platz</option>\
            <option value='🟠'>🟠 - Zweiter Platz</option>\
            <option value='🟤'>🟤 - Dritter Platz</option>\
            <option value='🔴'>🔴 - Kläglich Gescheitert</option>"

window.addEventListener("load", (event) => {
    wettbewerbe_container = document.getElementById("wettbewerbe");
    
    fuege_naechsten_wettbewerb_hinzu();
    fuege_naechsten_wettbewerb_hinzu();
    fuege_naechsten_wettbewerb_hinzu();
    
    document.getElementById("wettbewerb_44_runde_1").value="🟡";
    document.getElementById("wettbewerb_44_runde_2").value="⚪";
    document.getElementById("wettbewerb_44_runde_3").value="⚪";
    
    code_input = document.getElementById("code");
    hinzufuegen_button = document.getElementById("hinzufuegen");
    hinzufuegen_button.addEventListener("click", fuege_naechsten_wettbewerb_hinzu);
    trennen_checkbox = document.getElementById("trennen");
    trennen_checkbox.addEventListener("change", ausgewaehlt);
    importieren_button = document.getElementById("importieren");
    importieren_button.addEventListener("click", code_importieren);

    ausgewaehlt()
});

function fuege_naechsten_wettbewerb_hinzu() {
    if (wettbewerb_nummer < 1) {return}
    wettbewerb_html = "<h2>" + wettbewerb_nummer + ". Bundeswettbewerb Informatik</h2>\
        Runde 1: <select class='runde_select' id='wettbewerb_" + wettbewerb_nummer + "_runde_1' onchange='ausgewaehlt()'>" + optionen + "</select><br>\
        Runde 2: <select class='runde_select' id='wettbewerb_" + wettbewerb_nummer + "_runde_2' onchange='ausgewaehlt()'>" + optionen + "</select><br>\
        Runde 3: <select class='runde_select' id='wettbewerb_" + wettbewerb_nummer + "_runde_3' onchange='ausgewaehlt()'>" + optionen + "</select><br>";
    wettbewerb_div = document.createElement('div');
    wettbewerb_div.id = "wettbewerb_" + wettbewerb_nummer;
    wettbewerb_div.innerHTML = wettbewerb_html;
    wettbewerbe_container.appendChild(wettbewerb_div);
    wettbewerb_nummer--;
}

function ausgewaehlt() {
    code = ""
    code_vorraussichtlich = ""
    for (const wettbewerb_container of wettbewerbe_container.children) {
        runde_1 = document.getElementById(wettbewerb_container.id + "_runde_1");
        runde_2 = document.getElementById(wettbewerb_container.id + "_runde_2");
        runde_3 = document.getElementById(wettbewerb_container.id + "_runde_3");
        wettbewerb_code = runde_1.value + runde_2.value + runde_3.value
        if (code_vorraussichtlich != "" && trennen_checkbox.checked) {
            code_vorraussichtlich = "|" + code_vorraussichtlich;
        }
        code_vorraussichtlich = wettbewerb_code + code_vorraussichtlich
        if (wettbewerb_code != "⚫⚫⚫") {
            code = code_vorraussichtlich;
        }
    }
    code_input.value = code
}

function code_importieren() {
    code = code_input.value;
    i = code.length-1;
    wettbewerb_nummer_import = 44;
    for (const select_element of document.getElementsByClassName("runde_select")) {
        select_element.value = "⚫";
    }
    while (i > 0) {
        if (wettbewerb_nummer_import <= wettbewerb_nummer) {
            fuege_naechsten_wettbewerb_hinzu();
        }
        for (let runde = 3; runde > 0; runde--) {
            if (code[i-1] == '\uD83D') {
                runde_code = '\uD83D' + code[i];
                i -= 2;
            } else {
                runde_code = code[i];
                i -= 1;
            }
            document.getElementById("wettbewerb_" + wettbewerb_nummer_import + "_runde_" + runde).value = runde_code;
        }
        if (code[i] == '|') {
            i--;
        }
        wettbewerb_nummer_import--;
    }
}
