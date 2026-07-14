/* 
 * Home Visit AmmaMassageShiatsu & ACupuncture & MoXibustion Calculator 
 * Developed to support licensed practitioners and related organizations.
 * Licensed under the Practitioner-Led Stewardship License (PLSL) Version 1.0.
 *
 * Copyright (c) 2025-2026 Genjiro SAKAMAKI
 * See LICENSE for details.
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
        version : "1.0.0",
        revision: "2026.07",
        api: Object.freeze({
           runModeUI
        })
    });
}


// 手書きHTMLで checkbox が記述されている場合でも初期化できるよう対応
document.addEventListener("DOMContentLoaded", initUI);

const LimbInfo = Object.freeze([
    { key: "rightUpperLimb", label: "右上肢", correction: true },
    { key: "leftUpperLimb",  label: "左上肢", correction: true },
    { key: "rightLowerLimb", label: "右下肢", correction: true },
    { key: "leftLowerLimb",  label: "左下肢", correction: true },
    { key: "bodyTrunk",      label: "体躯",   correction: false }
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

// <input id="AMS_AC_MX_Mode" ... data-autoform="true">
function initializeAutoForm() {
    const cMode = getCalcMode();

    if (!cMode.autoForm)
        return;

    runModeUI();
}

// <input id="AMS_AC_MX_Mode" ... data-autotable="true">
function initializeAutoTable() {
    const cMode = getCalcMode();

    if (!cMode.autoTable)
        return;

    runDrawTableCalc();
}

// autoForm と autoTable をまとめて初期化
function initializeAutoUI() {
    initializeAutoForm();
    initializeAutoTable();
}

function initUI() {
    if (HV_AMSACMX.config.debug) console.log("initUI");
    initializeAutoUI();
    bindModeChange();
    bindAutoTable();

    document
        .querySelectorAll(`input[name="${HtmlId.IndicateAcMx}"]`)
        .forEach(cb =>
            cb.addEventListener("change", updateACMXTecState)
        );

    updateACMXTecState();

}

/*
 * １術２術セレクターを
 * 「適用症状」のチェックがない場合＝calc.js:ACMXHasIndication()
 * ロックする
 */
function updateACMXTecState() {
    const objAcMxTec = document.getElementById(HtmlId.AcMxTec);
    if (!objAcMxTec) {
        return;
    }
    objAcMxTec.disabled = !ACMXHasIndication();
}

/*
 * HTML:
 * <div id="amsArea"></div>
 * id="amsArea"のタグを基準に
 * あん摩マッサージ指圧の5部位<select>を描く
 */
function createAMSUI()
{
    const amsArea = document.getElementById(HtmlId.amsArea);
    if (!amsArea) {
        console.error("amsArea not found.");
        return;
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

/*
 * HTML:
 * <div id="acmxArea"></div>
 * id="acmxArea"のタグを基準に
 * はりきゅうの適用症状を<fieldest>内に<label><input type="checkbox">で列記
 */
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

/*
 * 描画時のチェックボックス監視
 */
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

function clearUI() {
    clearAMSUI();
    clearAcMxUI();
    clearTable();
    clearAnswer();
}

function bindModeChange() {
    const modeElement  = document.getElementById(HtmlId.Mode);
    if (!modeElement ) return;

    modeElement.addEventListener("change", () => {
        const cMode = getCalcMode();
        if (HV_AMSACMX.config.debug) console.log("bindModeChange");
        if (cMode.autoForm) runModeUI();
    });
}

function bindAutoTable()
{
    const cMode = getCalcMode();

    if (!cMode.autoTable)
        return;

    const objBurdenRatio =
        document.getElementById(HtmlId.BurdenRatio);

    if (!objBurdenRatio)
        return;

    objBurdenRatio.addEventListener(
        "change",
        runDrawTableCalc
    );
}

/*
 * AMS_AC_MX_Mode の値に従ってUIを更新する。
 *
 * 現在の入力フォームを破棄し、
 * 指定されたモードのフォームを再描画する。
 *
 * data-autotable="true" が指定されている場合は、
 * 料金一覧表もあわせて再描画する。
 */
function runModeUI() {
    const cMode = getCalcMode();

    // 一旦リセット
    clearUI();

    switch (cMode.tpMode) {
        case TherapyMode.ALL:
            createAMSUI();
            createAcMxUI();
            break;

        case TherapyMode.AMS:
            createAMSUI();
            break;

        case TherapyMode.ACMX:
            createAcMxUI();
            break;
    }

    if (cMode.autoTable) {
        runDrawTableCalc();
    }
}

