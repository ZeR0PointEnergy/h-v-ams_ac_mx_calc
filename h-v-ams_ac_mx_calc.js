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
    HeadCount   : "HeadCount",
    BurdenRatio : "BurdenRatio",
    Answer      : "AnswersBodyAnatomy",
    tableArea   : "tableArea",
    TotalTable : "TotalFeeTable"
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
        title : "温罨法",
        price : UnitPrice.HotPack,
        note : "（変形徒手矯正併用不可） +"
    },
    [RowType.ELEHOTPACK]: {
        title : "電気温罨法",
        price : UnitPrice.EleHotPack,
        note : "（変形徒手矯正併用不可） +"
    },
    [RowType.ACMX1]: {
        title : "鍼きゅう１術",
        price : UnitPrice.AandM1tec,
        note : ""
    },
    [RowType.ACMX2]: {
        title : "鍼きゅう２術",
        price : UnitPrice.AandM2tec,
        note : ""
    },
    [RowType.ELEACMX]: {
        title : "電療料",
        price : UnitPrice.EleAandM,
        note : ""
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

function OnSitePrice(){

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

function AMS_Total(arrLimb){
    let Price = AMSPrice(arrLimb);
    return CalcRatio(( Price + UnitPrice.MedExp[HeadCount] ), BurdenRatio);
}

function OnSiteTotal(BurdenRatio, HeadCount){
    let AMSPrice = AMSPrice(arrLimb);


}

function InnerHTMLwritePrice(arrLimb,arrElementById){
    let divarrElementById = document.getElementById(arrElementById);
    divarrElementById.innerHTML= OnSitePrice(arrLimb);
}

function runBodyAnatomyCalc(){
    let limb = Array(5).fill(0);
    let Price = 0;
    let BurdenRatio = 1;
    let divAnswersBodyAnatomy = document.getElementById(HtmlId.Answer);
    let cMode = getCalcMode();

    switch 

    // スクリプトでも加工しやすい limb[0] ～ limb[4] までの id を 
    // <select id="limb[X]"> に埋め込む
    // Value値 0 : なし
    //         1 : マッサージ
    //         3 : 変形徒手矯正 (3=1+2)
    for (let iCount = 0; iCount<5; iCount++ ) {
        limb[iCount] = Number(document.getElementById('limb['+iCount+']').value);
    }
    const HeadCount = Number(document.getElementById(HtmlId.HeadCount).value);
    BurdenRatio = Number(document.getElementById(HtmlId.BurdenRatio).value) / 10;
    Price = OnSiteTotal(limb, BurdenRatio, HeadCount);
    divAnswersBodyAnatomy.innerHTML= "施術料(含訪問施術料)" + Price + "円/１回";
    drawTable(BurdenRatio, limb);
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
        return SpecialRows[argIndex].title;
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
                strCell = rowInfo.note + CalcRatio(rowInfo.price, BurdenRatio);
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

