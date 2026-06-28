/* 
 * Home Visit AmmaMassageShiatsu & ACupuncture & MoXibustion Calculator 
 * Practitioner-Led Stewardship License (PLSL)
 * Version 1.0
 * Copyright 2025 Genjiro SAKAMAKI at Sorahara-Do
 */

const UnitPrice = Object.freeze({
    Massage : 470 , // Price for one of 4 limbs
    MCorrection : 470 , 
    HotPack : 180 , 
    EleHotPack : 300 , 
    AandM1tec : 1650 , 
    AandM2tec : 1820 , 
    EleAandM : 100 , 
    MedExp :  Object.freeze([
        0, 2300, 1150, 460, 460, 460, 460, 460, 460, 460, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 70 ]), 
});

const HtmlId = Object.freeze({
    Mode        : "AMS_AC_MX_Mode",
    AcMxTec     : "AcMxTec",
    IndicateAcMx: "IndicateAcMx",
    HeadCount   : "HeadCount",
    BurdenRatio : "BurdenRatio",
    Answer      : "AnswersBodyAnatomy",
    tableArea   : "tableArea",
    TotalTable  : "TotalFeeTable"
});

function getCalcMode() {
    // <imput id="AMS_AC_MX_Mode"> に埋め込む
    // Value値 0 : なし
    //         1 : マッサージ
    //         2 : 
    const MODE_ALL     = 0;
    const MODE_MASSAGE = 1;
    const MODE_ACMX    = 2;
    let ModeMin = 0;
    let ModeMax = 10;

    let obj = document.getElementById(HtmlId.Mode);

    if (obj) {
        switch (Number(obj.value)) {
            case MODE_MASSAGE:
                ModeMin = 0;
                ModeMax = 7;
                break;

            case MODE_ACMX:
                ModeMin = 7;
                ModeMax = 10;
                break;
        }
    }
    return {
        ModeMin,
        ModeMax
    };
}

const RowType = Object.freeze({
    MASSAGE     : 0,
    HOTPACK     : 6,
    ELEHOTPACK  : 7,
    ACMX1       : 8,
    ACMX2       : 9,
    ELEACMX     : 10
});

const SpecialRows = Object.freeze({
    [RowType.HOTPACK]: {
        Title : "温罨法",
        Price : UnitPrice.HotPack,
        Note : "（変形徒手矯正併用不可） +"
    },
    [RowType.ELEHOTPACK]: {
        Title : "電気温罨法",
        Price : UnitPrice.EleHotPack,
        Note : "（変形徒手矯正併用不可） +"
    },
    [RowType.ACMX1]: {
        Title : "鍼きゅう１術",
        Price : UnitPrice.AandM1tec,
        Note : ""
    },
    [RowType.ACMX2]: {
        Title : "鍼きゅう２術",
        Price : UnitPrice.AandM2tec,
        Note : ""
    },
    [RowType.ELEACMX]: {
        Title : "電療料",
        Price : UnitPrice.EleAandM,
        Note : ""
    }
});

function getSelectedCell(arrLimb)
{
    let massageCount = 0;
    let correctionCount = 0;

    for(let i=0;i<5;i++) {
        if(arrLimb[i] !== 0) massageCount++;
        if(arrLimb[i] === 3) correctionCount++;
    }

    return {
        row : correctionCount + 1,
        col : massageCount
    };
}

function OnSitePrice(arrLimb = null){
    const cMode = getCalcMode();

    if (cMode.ModeMin === 0) {
        return AMSPrice(arrLimb);
    }

    return ACMXPrice(ACMXtec());
}

function CalcRatio(argPrice, BurdenRatio) {
    return argPrice * BurdenRatio;
}

function isValidLimb(arrLimb)
{
    let correctionCount = 0;

    for(let iCount=0; iCount<arrLimb.length; iCount++) {
        if(arrLimb[iCount] === 3) {
            correctionCount++;
        }
    }

    return correctionCount <= 4;
}

function AMSCountParts(){
    let arrLimb = Array(5).fill(0);
    // スクリプトでも加工しやすい limb[0] ～ limb[4] までの id を 
    // <select id="limb[X]"> に埋め込む
    // Value値 0 : なし
    //         1 : マッサージ
    //         3 : 変形徒手矯正 (3=1+2)
    for (let iCount = 0; iCount<5; iCount++ ) {
        arrLimb[iCount] = Number(document.getElementById('limb['+iCount+']').value);
    }
    return arrLimb;
}
function AMSPrice(arrLimb){
    let Price = 0;
    if (arrLimb[0] === 0 && arrLimb[1] === 0 && arrLimb[2] === 0 && arrLimb[3] === 0 && arrLimb[4] === 0)
        return 0;
    else if (!isValidLimb(arrLimb))
        return -1;
    else {
        for (let iCount=0; iCount<5 ;iCount++){
            if (arrLimb[iCount]===3) {
                Price = Price + UnitPrice.Massage + UnitPrice.MCorrection ;
            } else if (arrLimb[iCount]===1) {
                Price = Price + UnitPrice.Massage ;
            }
        }
    }
    return Price;
}

function updateTecState() {
    const tec = document.getElementById(HtmlId.AcMxTec);
    tec.disabled = !ACMXHasIndication();
}

function ACMXHasIndication() {
    return document.querySelectorAll(
        'input[name="IndicateAcMx"]:checked'
    ).length > 0;
}

function ACMXtec(){
    if (!ACMXHasIndication())
        return 0;

    return Number(document.getElementById(HtmlId.AcMxTec).value);
}

function ACMXPrice(argTecs){
    if(argTecs === 1)
        return SpecialRows[RowType.ACMX1].Price;
    if(argTecs === 2)
        return SpecialRows[RowType.ACMX2].Price;
    else
        return 0;
}

function OnSiteTotal(argPrice, BurdenRatio, HeadCount){
    let Price = 0;
    return CalcRatio(( argPrice + UnitPrice.MedExp[HeadCount] ), BurdenRatio);
}

function InnerHTMLwritePrice(arrLimb,arrElementById){
    let divarrElementById = document.getElementById(arrElementById);
    divarrElementById.innerHTML= OnSitePrice(arrLimb);
}

function getTreatmentFee() {
    const cMode = getCalcMode();

    let arrLimb = null;
    let Price = 0;

    if (cMode.ModeMin === 0) {
        arrLimb = AMSCountParts();
        Price = AMSPrice(arrLimb);

        if (cMode.ModeMax === 10) {
            Price += ACMXPrice(ACMXtec());
        }
    } else {
        if (ACMXHasIndication()) {
            Price = ACMXPrice(ACMXtec());
        }
    }

    return {
        Price,
        arrLimb
    };
}

function runBodyAnatomyCalc(){
    let Price = 0;
    let BurdenRatio = 1;
    let divAnswersBodyAnatomy = document.getElementById(HtmlId.Answer);
    const HeadCount = Number(document.getElementById(HtmlId.HeadCount).value);
    const Treatment = getTreatmentFee();
    BurdenRatio = Number(document.getElementById(HtmlId.BurdenRatio).value) / 10;
    
    if (Treatment.Price > 0) {
        Price = OnSiteTotal(Treatment.Price, BurdenRatio, HeadCount);
    } else {
        Price = 0;
    }
    divAnswersBodyAnatomy.innerHTML= "施術料(含訪問施術料)" + Price + "円/１回";
    drawTable(BurdenRatio, Treatment.arrLimb);
}

function runDrawTableCalc(){
    let BurdenRatio = Number(document.getElementById(HtmlId.BurdenRatio).value) / 10;
    drawTable(BurdenRatio, null);
}

function getRowTitle(argIndex) {
    if (argIndex === 0) {
        return "マッサージ部位数";
    }
    if (argIndex === 1) {
        return "マッサージのみ";
    }
    if (argIndex < RowType.HOTPACK) {
        return `変形徒手 ${argIndex - 1}部位`;
    }
    if (SpecialRows[argIndex]) {
        return SpecialRows[argIndex].Title;
    }
    return "";
}

function drawTable(BurdenRatio, arrLimb = null) {
    // <table id="TotalFeeTable">のidは"TotalFeeTable"とする
    // HtmlId.TotalTable => "TotalFeeTable"
    let row;
    let cell;
    let cellText;
    let cMode = getCalcMode();
    const selectedCell = Array.isArray(arrLimb) ? getSelectedCell(arrLimb) : null;
    const tableArea = document.getElementById(HtmlId.tableArea);
    if (!tableArea) {
        console.error("tableArea not found.");
        return;
    }    // <table> 要素と <tbody> 要素を作成
    const objTable = document.createElement("table");
    objTable.id = HtmlId.TotalTable;
    const objTableBody = document.createElement("tbody");
    // すべてのセルを作成
    for (let yCount = cMode.ModeMin; yCount <= cMode.ModeMax; yCount++) {
        let limb = [0,0,0,0,0]; // limb Arrayの初期化
        let strCell = "";
        let yIndex = yCount - 1;
        const rowInfo = SpecialRows[yCount];
        // 表の行を作成
        row = document.createElement("tr");
        for (let xCount = 0; xCount < 6; xCount++) {
            let xIndex = xCount - 1;
            // <th>の生成と分類表示
            if (yCount === cMode.ModeMin || xCount === 0) {
                cell = document.createElement("th");
                if (cMode.ModeMin === 0 && yCount === 0 && xCount === 0)
                  strCell = getRowTitle(yCount); // "マッサージ部位数";
                else if (yCount === 0)
                  strCell = `${xCount}部位`;
                else {
                  if (cMode.ModeMin === 7 && yCount === RowType.ELEHOTPACK) {
                    strCell = "はり＆きゅう"; // 鍼灸専用モードでは
                    cell.colSpan = "5";       // RowType.ELEHOTPACK の行を
                    xCount = 5;               // 「はり＆きゅう」見出しとして再利用する
                  } else {
                    strCell = getRowTitle(yCount);
                  }
                }
                cellText = document.createTextNode(strCell);
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (rowInfo) { // ( yCount >= RowType.HOTPACK && yCount <= RowType.ELEACMX )
                cell = document.createElement("td");
                cell.colSpan = "5";
                strCell = rowInfo.Note + CalcRatio(rowInfo.Price, BurdenRatio);
                cellText = document.createTextNode(strCell);
                cell.style.textAlign = "right";
                cell.appendChild(cellText);
                row.appendChild(cell);
                xCount += 4;
            } else {
                // <td> 要素とテキストノードを作成し、テキストノードを
                // <td> の内容として、その <td> を表の行の末尾に追加
                cell = document.createElement("td");
                if (yIndex>xCount) {
                    limb[xIndex] = 3; // 3:マッサージ+変形徒手矯正 X肢未満に3を代入 表示は空
                    strCell = "";
                } else if ( yIndex > xIndex ) {
                    limb[xIndex] = 3; // 3:マッサージ+変形徒手矯正 X肢に3を代入 表示は含めた値段の計
                    strCell = CalcRatio(OnSitePrice(limb), BurdenRatio);
                } else {
                   limb[xIndex] = 1; // 1:マッサージ X肢に1を代入 表示は含めた値段の計
                    strCell = CalcRatio(OnSitePrice(limb), BurdenRatio);
                }
                cellText = document.createTextNode(strCell);
                cell.appendChild(cellText);
                cell.style.textAlign = "right";
                if ( selectedCell && yCount === selectedCell.row && xCount === selectedCell.col ) {
                    cell.style.backgroundColor = "red";
                }
                row.appendChild(cell);
            }
        }
        // 表の本体の末尾に行を追加
        objTableBody.appendChild(row);
    }
    // <tbody> を <table> の中に追加
    objTable.appendChild(objTableBody);
    // objTable の border 属性を 1 に設定
    objTable.setAttribute("border", "2");
    // 最後に一発だけ画面へ
    tableArea.replaceChildren(objTable);
}

