/* 
 * Home Visit AmmaMassageShiatsu & ACupuncture & MoXibustion Calculator 
 * Practitioner-Led Stewardship License (PLSL)
 * Version 1.0
 * Copyright 2026 Genjiro SAKAMAKI at Sorahara-Do
 */
{
    const HV_AMSACMX = window.HV_AMSACMX ??= {};
    
    HV_AMSACMX.version ??= Object.freeze({
        api: "1.0"
    });
    
    HV_AMSACMX.config ??= {
        debug: false
    };
    
    HV_AMSACMX.modules ??= {};
    
    HV_AMSACMX.modules.ui = Object.freeze({
        version: "1.0.0"
    });
}


document.addEventListener("DOMContentLoaded", () => {

    document
        .querySelectorAll(`input[name="${HtmlId.IndicateAcMx}"]`)
        .forEach(cb =>
            cb.addEventListener("change", updateACMXTecState)
        );

    updateACMXTecState();
});

const LimbInfo = Object.freeze([
    { key: "rightUpperLimb", label: "右上肢", correction: true },
    { key: "leftUpperLimb",  label: "左上肢", correction: true },
    { key: "rightLowerLimb", label: "右下肢", correction: true },
    { key: "leftLowerLimb",  label: "左下肢", correction: true },
    { key: "bodyTrunk",      label: "体幹",   correction: false }
]);

const LimbTechnique = Object.freeze({
    NONE       : 0,
    MASSAGE    : 1,
    CORRECTION : 3
});

const AMStechniqueOptions   = Object.freeze([
    { value : LimbTechnique.NONE, text : "なし" },
    { value: LimbTechnique.MASSAGE, text: "マッサージ" },
    { value: LimbTechnique.CORRECTION, text: "変形徒手" }
]);

const ACMXIndicateCase = Object.freeze([
    { label: "神経痛", title: "" },
    { label: "リウマチ", title: "" },
    { label: "五十肩", title: "" },
    { label: "頸腕症候群", title: "" },
    { label: "腰痛症", title: "" },
    { label: "頸椎捻挫後遺症", title: "" },
    { label: "その他", title: "医師の同意書に記載された慢性疼痛等" }
]);

function updateACMXTecState() {
    const tec = document.getElementById(HtmlId.AcMxTec);
    if (!tec) {
        return;
    }
    tec.disabled = !ACMXHasIndication();
}

function updateModeUI()
{
    switch(getMode())
    {
        case MODE_ALL:
            break;

        case MODE_MASSAGE:
            break;

        case MODE_ACMX:
            break;
    }
}

function createAMSUI()
{
    const amsArea = document.getElementById(HtmlId.amsArea);
    if (!amsArea) {
        console.error("amsArea not found.");
        return 0;
    }
    for (const [nIndex, limb] of LimbInfo.entries()) {
        const objLabel = document.createElement("label");
        const objSelect = document.createElement("select");
        objSelect.id = `limb[${nIndex}]`;
        objSelect.name = limb.key;
        objSelect.className = limb.key;
        objLabel.htmlFor = objSelect.id;
        objLabel.className = limb.key;
        objLabel.textContent = limb.label;
        for (const optionInfo of AMStechniqueOptions ) {
            if (!limb.correction && optionInfo.value === 3)
                continue;
            const objOption = document.createElement("option");
            objOption.value = optionInfo.value;
            objOption.textContent = optionInfo.text;
            objSelect.appendChild(objOption);
        }
        amsArea.appendChild(objLabel);
        amsArea.appendChild(objSelect);
    }
}

function createAcMxUI()
{
    const acmxArea = document.getElementById(HtmlId.acmxArea);

    if (!acmxArea) {
        console.error("acmxArea not found.");
        return;
    }

    const objFieldset = document.createElement("fieldset");
    objFieldset.id=HtmlId.IndicateAcMx;
    objFieldset.name=HtmlId.IndicateAcMx;

    const objLegend = document.createElement("legend");
    objLegend.textContent = "鍼灸適応症（複数可）";
    objFieldset.appendChild(objLegend);

    for (const indicate of ACMXIndicateCase) {

        const objLabel = document.createElement("label");
        const objCheckBox = document.createElement("input");
        objCheckBox.type = "checkbox";
        objCheckBox.name = HtmlId.IndicateAcMx;

        objCheckBox.addEventListener(
            "change",
            updateACMXTecState
        );

        if (indicate.title) {
            objLabel.title = indicate.title;
        }

        objLabel.appendChild(objCheckBox);
        objLabel.append(" " + indicate.label);

        objFieldset.appendChild(objLabel);
        objFieldset.appendChild(document.createElement("br"));
    }


    const objSelect = document.createElement("select");
    objSelect.id = HtmlId.AcMxTec;
    objSelect.name = HtmlId.AcMxTec;
    
    const objOptNonVale = document.createElement("option");
    objOptNonVale.value = "";
    objOptNonVale.textContent = "選択してください";
    objSelect.appendChild(objOptNonVale);
    
    for (const rowType of [RowType.ACMX1, RowType.ACMX2]) {
        const objOption = document.createElement("option");
        objOption.value = rowType - RowType.ACMX1 + 1;   // 1,2
        objOption.textContent = SpecialRows[rowType].Title;
        objSelect.appendChild(objOption);
    }
    
    objFieldset.appendChild(objSelect);
    acmxArea.appendChild(objFieldset);

    objFieldset
        .querySelectorAll(`input[name="${HtmlId.IndicateAcMx}"]`)
        .forEach(cb =>
            cb.addEventListener("change", updateACMXTecState)
        );
    
    updateACMXTecState();
}

function clearAMSUI() {
    document.getElementById(HtmlId.amsArea)?.replaceChildren();
}

function clearAcMxUI() {
    document.getElementById(HtmlId.acmxArea)?.replaceChildren();
}

function clearTable() {
    document.getElementById(HtmlId.tableArea)?.replaceChildren();
}

function clearUI() {
    clearAMSUI();
    clearAcMxUI() 
    clearTable();
}

function bindModeChange() {
    const mode = document.getElementById("AMS_AC_MX_Mode");
    if (!mode) return;

    mode.addEventListener("change", () => {
        applyModeUI();
    });

    applyModeUI(); // 初期描画
}

function applyModeUI() {
    const mode = Number(document.getElementById("AMS_AC_MX_Mode").value);

    const amsArea = document.getElementById("amsArea");
    const acmxArea = document.getElementById("acmxArea");

    // 一旦リセット
    clearAMSUI();
    clearAcMxUI();

    switch (mode) {
        case 0:
            createAMSUI();
            createAcMxUI();
            break;

        case 1:
            createAMSUI();
            break;

        case 2:
            createAcMxUI();
            break;
    }
}
