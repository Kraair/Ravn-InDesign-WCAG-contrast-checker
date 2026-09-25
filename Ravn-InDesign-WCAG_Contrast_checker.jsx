/*
    WCAG Contrast Paneel
    ---------------------------------------------------------------
    Start dit script vanuit het gewone Scripts-paneel.
*/

#targetengine "wcagPaneel"

if ($.global.wcagPaneelActief) {
    alert("Het WCAG-contrastpaneel staat al open.");
    exit();
}
$.global.wcagPaneelActief = true;

var AA_NORMAAL = 4.5;
var AA_GROOT = 3.0;
var AAA_NORMAAL = 7.0;
var AAA_GROOT = 4.5;
var GROTE_TEKST_PT = 18;
var GROTE_TEKST_PT_VET = 14;
var AANGENOMEN_PAGINAKLEUR = [255, 255, 255];
var KLEUR_GROEN = [0.2, 0.7, 0.2];
var KLEUR_ROOD = [0.85, 0.2, 0.2];

function maakBolletje(parent) {
    var bol = parent.add("group");
    bol.preferredSize = [14, 14];
    bol.minimumSize = [14, 14];
    bol.maximumSize = [14, 14];
    bol.kleur = null;
    bol.onDraw = function () {
        if (!this.kleur) return;
        var g = this.graphics;
        var kwast = g.newBrush(g.BrushType.SOLID_COLOR, this.kleur, 1);
        g.ellipsePath(2, 2, 10, 10);
        g.fillPath(kwast);
    };
    return {
        zet: function (kleur) {
            bol.kleur = kleur;
            bol.hide();
            bol.show();
        }
    };
}

var paneelOpen = true;
var selectieListener = null;

// ---------------------- PANEEL OPBOUWEN ----------------------
var w = new Window("palette", "WCAG Contrast", undefined, { closeButton: true });
$.global.wcagPaneelWindow = w; // expliciet vasthouden, test tegen voortijdig verdwijnen
w.orientation = "column";
w.alignChildren = "fill";
w.margins = 14;
w.spacing = 8;

var tabs = w.add("tabbedpanel");
tabs.alignChildren = "fill";

var tabContrast = tabs.add("tab", undefined, "Contrast");
tabContrast.orientation = "column";
tabContrast.alignChildren = "fill";
tabContrast.margins = 10;
tabContrast.spacing = 8;

var tabDocument = tabs.add("tab", undefined, "Document");
tabDocument.orientation = "column";
tabDocument.alignChildren = "fill";
tabDocument.margins = 10;
tabDocument.spacing = 8;

tabs.selection = tabContrast;

var bovenRij = tabContrast.add("group");
bovenRij.alignChildren = "left";
var autoVinkje = bovenRij.add("checkbox", undefined, "On/Off");
autoVinkje.value = true;
var instructieText = bovenRij.add("statictext", undefined, "");
var helpKnop = bovenRij.add("button", undefined, "?");
helpKnop.preferredSize = [24, 24];
helpKnop.alignment = "right";

var instellingenRij = tabContrast.add("group");
instellingenRij.alignChildren = "left";
var niveauAA = instellingenRij.add("radiobutton", undefined, "AA");
niveauAA.value = true;
var niveauAAA = instellingenRij.add("radiobutton", undefined, "AAA");
var verloopVinkje = instellingenRij.add("checkbox", undefined, "Verloop-detectie");
niveauAA.onClick = function () { voerControleUit(); };
niveauAAA.onClick = function () { voerControleUit(); };
verloopVinkje.onClick = function () { voerControleUit(); };

var contrastRij = tabContrast.add("group");
contrastRij.add("statictext", undefined, "Contrast:").preferredSize.width = 90;
var contrastBolletje = maakBolletje(contrastRij);
var contrastWaarde = contrastRij.add("statictext", undefined, "-");
contrastWaarde.preferredSize.width = 300;
contrastWaarde.graphics.font = ScriptUI.newFont(contrastWaarde.graphics.font.name, ScriptUI.FontStyle.BOLD, 13);

var tekstRij = tabContrast.add("group");
tekstRij.add("statictext", undefined, "Tekst:").preferredSize.width = 90;
var tekstWaarde = tekstRij.add("statictext", undefined, "-");
tekstWaarde.preferredSize.width = 200;

var achtergrondRij = tabContrast.add("group");
achtergrondRij.add("statictext", undefined, "Frame Fill:").preferredSize.width = 90;
var achtergrondWaarde = achtergrondRij.add("statictext", undefined, "-");
achtergrondWaarde.preferredSize.width = 200;

var frameStrokeRij = tabContrast.add("group");
frameStrokeRij.add("statictext", undefined, "Frame Stroke:").preferredSize.width = 90;
var frameStrokeWaarde = frameStrokeRij.add("statictext", undefined, "-");
frameStrokeWaarde.preferredSize.width = 200;

var bronText = tabContrast.add("statictext", undefined, "", { multiline: true });
bronText.preferredSize.width = 420;
bronText.preferredSize.height = 48;

var knopRij = tabContrast.add("group");
knopRij.alignment = "right";
var verversKnop = knopRij.add("button", undefined, "Check nu");

// ---------------------- TAB: DOCUMENT ----------------------
var docNaamRij = tabDocument.add("group");
docNaamRij.add("statictext", undefined, "Documentnaam:").preferredSize.width = 130;
var docNaamBolletje = maakBolletje(docNaamRij);
var docNaamTekst = docNaamRij.add("statictext", undefined, "-", { multiline: true });
docNaamTekst.preferredSize.width = 260;

var docTaalRij = tabDocument.add("group");
docTaalRij.add("statictext", undefined, "Taal:").preferredSize.width = 130;
var docTaalBolletje = maakBolletje(docTaalRij);
var docTaalTekst = docTaalRij.add("statictext", undefined, "-", { multiline: true });
docTaalTekst.preferredSize.width = 260;

var docStijlenRij = tabDocument.add("group");
docStijlenRij.add("statictext", undefined, "PDF-tags stijlen:").preferredSize.width = 130;
var docStijlenBolletje = maakBolletje(docStijlenRij);
var docStijlenTekst = docStijlenRij.add("statictext", undefined, "-", { multiline: true });
docStijlenTekst.preferredSize.width = 260;

var docDetailText = tabDocument.add("edittext", undefined, "", { multiline: true, scrollable: true, readonly: true });
docDetailText.preferredSize.width = 420;
docDetailText.preferredSize.height = 180;

var docKnopRij = tabDocument.add("group");
docKnopRij.alignment = "right";
var docCheckKnop = docKnopRij.add("button", undefined, "Check document");

w.preferredSize.width = 460;

helpKnop.onClick = function () {
    alert(
        "Gebruik:\n\n" +
        "- Een tekstkader of stuk tekst selecteren; bij 'On' wordt automatisch gecheckt.\n\n" +
        "- Twee objecten samen selecteren (shift-klik): een tekstkader met tekst en een achtergrondobject. Dit is het meest betrouwbaar.\n\n" +
        "- Zet 'On/Off' uit om zelf op 'Check nu' te klikken in plaats van automatisch bij te werken.\n\n" +
        "- AA/AAA kiest welk WCAG-niveau wordt getoetst.\n\n" +
        "- 'Verloop-detectie' aanzetten laat verloop-kleuren herkennen en buiten de contrastmeting houden (met waarschuwing), i.p.v. ze als grijs te benaderen."
    );
};

// ---------------------- AUTO/HANDMATIGE MODUS ----------------------
function zetAutoModus(aan) {
    if (aan) {
        if (!selectieListener) {
            selectieListener = app.eventListeners.add("afterSelectionChanged", voerControleUit);
        }
        verversKnop.enabled = false;
        instructieText.text = "Automatisch actief, selecteer iets.";
    } else {
        if (selectieListener) {
            try { selectieListener.remove(); } catch (e) { }
            selectieListener = null;
        }
        verversKnop.enabled = true;
        instructieText.text = "Selecteer iets en klik op Check nu.";
    }
    w.layout.layout(true);
}

autoVinkje.onClick = function () { zetAutoModus(autoVinkje.value); };

// ---------------------- CONTROLE UITVOEREN ----------------------
function zetVelden(contrast, tekst, achtergrond, frameStroke, bron, kleur) {
    if (!paneelOpen) return;
    try {
        contrastWaarde.text = contrast;
        contrastWaarde.graphics.foregroundColor = kleur
            ? contrastWaarde.graphics.newPen(contrastWaarde.graphics.PenType.SOLID_COLOR, kleur, 1)
            : contrastWaarde.graphics.foregroundColor;
        contrastBolletje.zet(kleur);
        tekstWaarde.text = tekst;
        achtergrondWaarde.text = achtergrond;
        frameStrokeWaarde.text = frameStroke;
        bronText.text = bron;
        w.layout.layout(true);
    } catch (e) {
        // paneel is waarschijnlijk net gesloten, negeren
    }
}

function voerControleUit() {
    if (!paneelOpen) return;
    try {
        if (app.documents.length === 0) {
            zetVelden("-", "-", "-", "-", "Geen document open.", null);
            return;
        }
        if (app.selection.length === 0) {
            zetVelden("-", "-", "-", "-", "Selecteer een tekstkader of tekst.", null);
            return;
        }

        var frame = null, page = null, textObj = null, achtergrond = null;

        if (app.selection.length === 2) {
            var a = app.selection[0], b = app.selection[1];
            var aIsTekst = (a.constructor.name === "TextFrame" && a.texts.length > 0 && a.contents !== "");
            var bIsTekst = (b.constructor.name === "TextFrame" && b.texts.length > 0 && b.contents !== "");
            var bgItem = null;

            if (aIsTekst && !bIsTekst) { frame = a; bgItem = b; }
            else if (bIsTekst && !aIsTekst) { frame = b; bgItem = a; }
            else {
                zetVelden("-", "-", "-", "-", "Selecteer een tekstkader met tekst en een achtergrondobject.", null);
                return;
            }

            textObj = frame.texts[0];
            try { page = frame.parentPage; } catch (e) { }

            var fc = null;
            try { fc = bgItem.fillColor; } catch (e2) { }
            if (!fc || fc.name === "None") {
                zetVelden("-", "-", "-", "-", "Achtergrondobject heeft geen leesbare vulkleur.", null);
                return;
            }
            achtergrond = { color: fc, source: "handmatig geselecteerd object", item: bgItem };

        } else if (app.selection.length === 1) {
            var sel = app.selection[0];

            if (sel.constructor.name === "TextFrame") {
                frame = sel;
                try { page = frame.parentPage; } catch (e) { }
                if (frame.texts.length === 0 || frame.contents === "") {
                    zetVelden("-", "-", "-", "-", "Dit tekstkader bevat geen tekst.", null);
                    return;
                }
                textObj = frame.texts[0];
            } else {
                try { if (sel.contents !== undefined) textObj = sel; } catch (e) { }
                if (!textObj) { try { textObj = sel.texts[0]; } catch (e2) { } }
                if (textObj) {
                    try { frame = textObj.parentTextFrames[0]; page = frame.parentPage; } catch (e3) { }
                }
            }

            if (!textObj || !textObj.contents || textObj.contents === "") {
                zetVelden("-", "-", "-", "-", "Geen tekst in selectie. Tip: shift-klik ook het achtergrondobject aan voor een betrouwbare meting.", null);
                return;
            }

            achtergrond = frame
                ? getAchtergrondKleur(frame, page)
                : { color: null, source: "pagina-achtergrond (aanname, kader niet gevonden)", item: null };
        } else {
            zetVelden("-", "-", "-", "-", "Selecteer 1 tekstkader/tekst, of 2 objecten samen.", null);
            return;
        }

        var bevatVerloop = verloopVinkje.value && isGradient(achtergrond.color);
        var bgRgb = bevatVerloop ? null : kleurNaarRgb(achtergrond.color);
        if (bgRgb === null) bgRgb = AANGENOMEN_PAGINAKLEUR;
        var strokeWeergave = strokeKleurWeergave(achtergrond.item);

        var ranges;
        try { ranges = textObj.textStyleRanges; } catch (e) {
            zetVelden("-", "-", "-", strokeWeergave, "Kon opmaak niet uitlezen (object mogelijk niet meer geldig).", null);
            return;
        }

        var laagsteRatio = null;
        var laagsteVereist = null;
        var alleGoed = true;
        var voorbeeldTekst = "";
        var fgHexWeergave = "";
        var bgHex = bevatVerloop ? "verloop" : rgbNaarHex(bgRgb);
        var aantal = 0;

        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            if (!range.contents || range.contents === "") continue;
            if (verloopVinkje.value && isGradient(range.fillColor)) {
                bevatVerloop = true;
                continue;
            }
            var fgRgb = kleurNaarRgb(range.fillColor);
            if (fgRgb === null) continue;
            aantal++;

            var isGroot = (range.pointSize >= GROTE_TEKST_PT) ||
                (range.pointSize >= GROTE_TEKST_PT_VET && isVet(range.fontStyle));
            var vereist = isGroot
                ? (niveauAAA.value ? AAA_GROOT : AA_GROOT)
                : (niveauAAA.value ? AAA_NORMAAL : AA_NORMAAL);
            var ratio = contrastRatio(fgRgb, bgRgb);
            if (!(ratio >= vereist)) alleGoed = false;

            if (laagsteRatio === null || ratio < laagsteRatio) {
                laagsteRatio = ratio;
                laagsteVereist = vereist;
                voorbeeldTekst = kortSnippet(range.contents);
                fgHexWeergave = rgbNaarHex(fgRgb);
            }
        }

        if (aantal === 0) {
            var geenTekstBron = bevatVerloop
                ? "Alleen verloop-tekst gevonden, contrast niet betrouwbaar te meten."
                : "Geen gekleurde tekst gevonden.";
            zetVelden("-", "-", "-", strokeWeergave, geenTekstBron, null);
            return;
        }

        var status = alleGoed ? "GOED  " : "FOUT  ";
        var kleurGroenRood = alleGoed ? KLEUR_GROEN : KLEUR_ROOD;
        var goedFoutLabel = status + laagsteRatio.toFixed(2) + ":1  (vereist " + laagsteVereist + ":1)";
        var bronRegel =
            "\"" + voorbeeldTekst + "\"  -  " + achtergrond.source +
            (aantal > 1 ? "  (" + aantal + " fragmenten, laagste waarde getoond)" : "") +
            (bevatVerloop ? "\nLET OP: bevat ook verloop-kleur, die is buiten beschouwing gelaten." : "");

        zetVelden(goedFoutLabel, fgHexWeergave, bgHex, strokeWeergave, bronRegel, kleurGroenRood);

    } catch (fout) {
        zetVelden("-", "-", "-", "-", "Fout bij verwerken selectie: " + String(fout), null);
    }
}


verversKnop.onClick = function () { voerControleUit(); };

// ---------------------- DOCUMENTCONTROLE (TAB 2) ----------------------
function voerDocumentControleUit() {
    if (!paneelOpen) return;
    try {
        if (app.documents.length === 0) {
            docNaamBolletje.zet(null);
            docNaamTekst.text = "-";
            docTaalBolletje.zet(null);
            docTaalTekst.text = "-";
            docStijlenBolletje.zet(null);
            docStijlenTekst.text = "-";
            docDetailText.text = "Geen document open.";
            w.layout.layout(true);
            return;
        }
        var doc = app.activeDocument;
        var details = [];

        try {
            if (doc.saved) {
                docNaamBolletje.zet(KLEUR_GROEN);
                docNaamTekst.text = doc.name;
            } else {
                docNaamBolletje.zet(KLEUR_ROOD);
                docNaamTekst.text = doc.name + " (nog niet opgeslagen)";
            }
        } catch (eNaam) {
            docNaamBolletje.zet(KLEUR_ROOD);
            docNaamTekst.text = "Kon niet uitlezen";
            details.push("Documentnaam: " + String(eNaam));
        }

        try {
            var talenGevonden = {};
            var talenLijst = [];
            var geenTaalGevonden = false;
            for (var s = 0; s < doc.stories.length; s++) {
                var story = doc.stories[s];
                if (!story.contents || story.contents === "") continue;
                var taal = null;
                try { taal = story.texts[0].appliedLanguage; } catch (eTaalLezen) { }
                var taalNaam = null;
                try { taalNaam = taal ? taal.name : null; } catch (eTaalNaam) { }
                if (!taalNaam || /no ?language/i.test(taalNaam)) {
                    geenTaalGevonden = true;
                } else if (!talenGevonden[taalNaam]) {
                    talenGevonden[taalNaam] = true;
                    talenLijst.push(taalNaam);
                }
            }
            if (geenTaalGevonden) {
                docTaalBolletje.zet(KLEUR_ROOD);
                docTaalTekst.text = "Tekst zonder ingestelde taal gevonden";
            } else if (talenLijst.length > 0) {
                docTaalBolletje.zet(KLEUR_GROEN);
                docTaalTekst.text = talenLijst.join(", ");
            } else {
                docTaalBolletje.zet(null);
                docTaalTekst.text = "Geen tekst gevonden";
            }
        } catch (eTaal) {
            docTaalBolletje.zet(KLEUR_ROOD);
            docTaalTekst.text = "Kon niet controleren";
            details.push("Taal: " + String(eTaal));
        }

        try {
            var stijlenZonderTag = [];
            var alleStijlen = doc.allParagraphStyles;
            for (var p = 0; p < alleStijlen.length; p++) {
                var stijl = alleStijlen[p];
                if (stijl.name === "[No Paragraph Style]") continue;
                var heeftPdfTag = false;
                try {
                    var maps = stijl.styleExportTagMaps;
                    for (var m = 0; m < maps.length; m++) {
                        if (String(maps[m].exportType).indexOf("PDF") > -1) {
                            heeftPdfTag = true;
                            break;
                        }
                    }
                } catch (eStijl) { }
                if (!heeftPdfTag) stijlenZonderTag.push(stijl.name);
            }
            if (stijlenZonderTag.length === 0) {
                docStijlenBolletje.zet(KLEUR_GROEN);
                docStijlenTekst.text = "Alle alineastijlen hebben een PDF-exporttag";
            } else {
                docStijlenBolletje.zet(KLEUR_ROOD);
                docStijlenTekst.text = stijlenZonderTag.length + " stijl(en) zonder PDF-exporttag";
                details.push("Zonder PDF-exporttag: " + stijlenZonderTag.join(", "));
            }
        } catch (eStijlen) {
            docStijlenBolletje.zet(KLEUR_ROOD);
            docStijlenTekst.text = "Kon niet controleren";
            details.push("Alineastijlen: " + String(eStijlen));
        }

        docDetailText.text = details.join("\n\n");
        w.layout.layout(true);
    } catch (foutTotaal) {
        try { docDetailText.text = "Fout bij documentcontrole: " + String(foutTotaal); } catch (eSchrijf) { }
    }
}

docCheckKnop.onClick = function () { voerDocumentControleUit(); };

tabs.onChange = function () {
    if (tabs.selection === tabDocument) voerDocumentControleUit();
};

w.onClose = function () {
    paneelOpen = false;
    if (selectieListener) {
        try { selectieListener.remove(); } catch (e) { }
        selectieListener = null;
    }
    try { $.global.wcagPaneelActief = false; } catch (e) { }
    try { $.global.wcagPaneelWindow = null; } catch (e) { }
};

zetAutoModus(autoVinkje.value);
w.show();


// ---------------------- ACHTERGROND BEPALEN ----------------------
function getAchtergrondKleur(frame, page) {
    try {
        if (frame.fillColor && frame.fillColor.name !== "None") {
            return { color: frame.fillColor, source: "kader eigen vulling", item: frame };
        }
    } catch (e) { }

    try {
        var spread = page.parent;
        var items = spread.pageItems;
        var frameIndex = -1;
        for (var i = 0; i < items.length; i++) {
            if (items[i] === frame) { frameIndex = i; break; }
        }
        if (frameIndex > -1) {
            var frameBounds = frame.geometricBounds;
            for (var j = frameIndex - 1; j >= 0; j--) {
                var it = items[j];
                if (it === frame) continue;
                var bounds;
                try { bounds = it.geometricBounds; } catch (e2) { continue; }
                if (!bounds) continue;
                if (boundsOverlappen(frameBounds, bounds)) {
                    var fc = null;
                    try { fc = it.fillColor; } catch (e3) { }
                    if (fc && fc.name !== "None") {
                        return { color: fc, source: "achterliggend object (geschat op stapelvolgorde)", item: it };
                    }
                }
            }
        }
    } catch (e) { }

    return { color: null, source: "pagina-achtergrond (aanname)", item: frame };
}

// ---------------------- VERLOOP-DETECTIE ----------------------
function isGradient(colorObj) {
    if (!colorObj) return false;
    try { return colorObj.constructor.name === "Gradient"; } catch (e) { return false; }
}

// ---------------------- STROKE WEERGAVE ----------------------
function strokeKleurWeergave(item) {
    if (!item) return "None";
    var sc = null, sw = 0;
    try { sc = item.strokeColor; } catch (e) { }
    try { sw = item.strokeWeight; } catch (e2) { }
    if (!sc || sc.name === "None" || !sw) return "None";
    var rgb = kleurNaarRgb(sc);
    if (rgb === null) return "None";
    return rgbNaarHex(rgb);
}

function boundsOverlappen(a, b) {
    var aY1 = a[0], aX1 = a[1], aY2 = a[2], aX2 = a[3];
    var bY1 = b[0], bX1 = b[1], bY2 = b[2], bX2 = b[3];
    return !(aX2 < bX1 || aX1 > bX2 || aY2 < bY1 || aY1 > bY2);
}

// ---------------------- KLEURCONVERSIE ----------------------
function kleurNaarRgb(colorObj) {
    if (!colorObj) return null;
    var naam = colorObj.name;
    if (naam === "None") return null;
    if (naam === "Paper") return [255, 255, 255];

    var ruimte, waarde;
    try {
        ruimte = colorObj.space;
        waarde = colorObj.colorValue;
    } catch (e) {
        if (naam === "Registration" || naam === "Black") return [0, 0, 0];
        return [128, 128, 128];
    }

    if (ruimte === ColorSpace.RGB) {
        return [waarde[0], waarde[1], waarde[2]];
    } else if (ruimte === ColorSpace.CMYK) {
        var c = waarde[0] / 100, m = waarde[1] / 100, y = waarde[2] / 100, k = waarde[3] / 100;
        return [
            255 * (1 - c) * (1 - k),
            255 * (1 - m) * (1 - k),
            255 * (1 - y) * (1 - k)
        ];
    } else if (ruimte === ColorSpace.LAB) {
        return labNaarRgb(waarde[0], waarde[1], waarde[2]);
    }
    return [128, 128, 128];
}

function labNaarRgb(L, a, b) {
    var fy = (L + 16) / 116;
    var fx = fy + (a / 500);
    var fz = fy - (b / 200);

    function finv(t) { return (t > 6 / 29) ? t * t * t : 3 * (6 / 29) * (6 / 29) * (t - 4 / 29); }

    var Xn = 0.9642, Yn = 1.0, Zn = 0.8249;
    var X = Xn * finv(fx);
    var Y = Yn * finv(fy);
    var Z = Zn * finv(fz);

    var R = X * 3.1338561 + Y * -1.6168667 + Z * -0.4906146;
    var G = X * -0.9787684 + Y * 1.9161415 + Z * 0.0334540;
    var B = X * 0.0719453 + Y * -0.2289914 + Z * 1.4052427;

    function gamma(c) {
        c = c < 0 ? 0 : (c > 1 ? 1 : c);
        return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    }

    return [gamma(R) * 255, gamma(G) * 255, gamma(B) * 255];
}

function rgbNaarHex(rgb) {
    function h(v) {
        v = Math.round(Math.max(0, Math.min(255, v)));
        var s = v.toString(16);
        return s.length === 1 ? "0" + s : s;
    }
    return "#" + h(rgb[0]) + h(rgb[1]) + h(rgb[2]);
}

// ---------------------- WCAG BEREKENING ----------------------
function relatieveLuminantie(rgb) {
    function channel(c) {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
    var r = channel(rgb[0]), g = channel(rgb[1]), b = channel(rgb[2]);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fg, bg) {
    var l1 = relatieveLuminantie(fg);
    var l2 = relatieveLuminantie(bg);
    var lichtste = Math.max(l1, l2);
    var donkerste = Math.min(l1, l2);
    return (lichtste + 0.05) / (donkerste + 0.05);
}

function isVet(fontStyle) {
    if (!fontStyle) return false;
    return /bold|zwaar|black|heavy/i.test(fontStyle);
}

function kortSnippet(tekst) {
    tekst = tekst.replace(/[\r\n]+/g, " ");
    return tekst.length > 40 ? tekst.substr(0, 40) + "..." : tekst;
}
