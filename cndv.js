function tabel(rows) {
    var linii = '';
    let nl = 0;
    rows.forEach((row) => {
        nl++;
        if (nl == 1) { // prima linie
            var aRow = Object.keys(row); // Facem array format din numele campurilor.
            // console.log(aRow) // pentru prezentare
            let linie = "<tr>"
            for (var camp = 0; camp < aRow.length; camp++) {    
                linie += "<th>" + aRow[camp] + "</th>" // 0 pentru denumirea campului
            }
            linie += "</tr>"
            linii += linie;
        }
        var aRow = Object.values(row); // Facem array format din valorile campurilor de pe line.
        // console.log(aRow) // pentru prezentare
        let linie = "<tr>"
        for (var camp = 0; camp < aRow.length; camp++) {
            linie += "<td>" + aRow[camp] + "</td>" // 1 pentru valoarea campului
        }
        linie += "</tr>"
        linii += linie;
    });
    return '<table>' + linii + '</table>'
}

module.exports = {
    tabel
};
