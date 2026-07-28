# 本仕様書の対象範囲

本仕様書は h-v-ams_ac_mx_calc ライブラリの内部設計および公開仕様を定義する.
公開APIの互換性,HTML Contract,内部データモデル,モジュール構成を対象とする.
APIの利用方法については API.md を参照する.

# 設計理念

本ライブラリは料金計算(CALC)と
ユーザーインターフェース(UI)を分離することを
基本設計とした.

ただし,一覧表の表示については,本来の最低限の表示の中に含め
料金計算(CALC)に関数を収めた.

料金計算ロジックはDOMに依存しない.

UIはDOMの生成・更新・イベント管理を担当する.

制度改定時にはCALCを,
表示変更時にはUIを修正対象とする.

両者の責務を分離することで
保守性・再利用性・移植性を高める.

# プロジェクト構成

本プロジェクトは二つのモジュールから構成される.

** h-v-ams_ac_mx_calc.js **

計算エンジン(以下 CALC)

** h-v-ams_ac_mx_ui.js **

ユーザーインターフェース生成(以下 UI)
内部で h-v-ams_ac_mx_calc.js を利用する.

依存関係は次のとおりである.

## モジュールの依存関係

```
h-v-ams_ac_mx_ui.js
        |
        +---- uses ----> h-v-ams_ac_mx_calc.js
```

現行ではUIはCALCに依存する関係性をもつ.
CALCの持つ変数をUIが使用することとし,CALCが呼ばれる関数群にUIに依存する変数/関数はおかないものとする.

# グローバル名空間

*** window.HV_AMSACMX ***

初期化順序として,以下の変数を持つ.

```HV_AMSACMX

version

config

modules
```
## HV_AMSACMX.version

CALC/UI共に本来的なapiのバージョンにより相互のバージョン情報として設ける.
UIはCALCに依存する互いの関係性を保証し適合性・整合性を保たせるため将来的に監視しあう可能性を持たせた情報.

## HTMLとの契約(HTML Contract)

本ライブラリはHTMLとの契約(Contract)に基づいて動作する.
ここに示すid属性は公開仕様の一部であり,互換性維持の対象とする.
HtmlIdはHTML Contractを定義する識別子群である.

```Required HTML IDs
Mode            AMS_AC_MX_Mode
AcMxTec         AcMxTec
HeadCount       HeadCount
BurdenRatio     BurdenRatio
Answer          AnswersBodyAnatomy
amsArea         amsArea
acmxArea        acmxArea
tableArea       tableArea
TotalTable      TotalFeeTable
```

ここにいう必須のHTML IDとはタグに持たせたid属性を意味し,その属性要素を元にプログラムされている.

```Required Input IDs
limb[0]
limb[1]
limb[2]
limb[3]
limb[4]
```

createAMSUI() を使用する場合は,これらの入力要素は自動生成される.
HTMLを手動で実装する場合は,上記のIDをすべて用意しなければならない.

### AMS_AC_MX_Mode

「あん摩マッサージ指圧/はり&きゅう」の複合モードか単体モードかをvalue値で与える.
→ Data Model 参照

### AcMxTec

「はり&きゅう」での術数を指し,value値で与える.
→ Data Model 参照

### HeadCount

「訪問施術料」に関して,同一日に同一の建築物で施術を行った患者数による区分「訪問施術料１」,「訪問施術料２」,「訪問施術料３」,「訪問施術料４」,「訪問施術料５」の各区分に定義される人数をvalue値で与える.
→ Data Model 参照

### BurdenRatio

療養費の健康保険負担割合をvalue値で与える.
→ Data Model 参照

### AnswersBodyAnatomy

訪問施術料を含めた療養費の健康保険負担割合に応じた一部負担金合計額をテキストで返す空間.
→ Data Model 参照

### tableArea

訪問施術料を含めない療養費の健康保険負担割合に応じた各一部負担金を一覧にした表を置く空間.

### amsArea

UIにより"AMS_AC_MX_Mode"で与えた値で,「あん摩マッサージ指圧」の部位の入力UIを描画する空間.

### acmxArea

UIにより"AMS_AC_MX_Mode"で与えた値で,「はり&きゅう」の適応及び術数の入力UIを描画する空間.

## Data Model

処置清算 createTreatmentFee() で以下の構成データを生成する.

```
Treatment Object … 施術内容を保持する内部データ構造.
    ├─Price    … 数値型で合計された療養費
    ├─arrLimb  … Arrayタイプ5つの要素からなり,以下の値が入る
    │  0        … なし
    │  1        … マッサージ
    │  3        … マッサージ + 変形徒手
    └─ACMXTec  … 以下の値が入る
        0        … なし
        1        … １術
        2        … ２術
```

**arrLimbの施術/(UI)LimbTechnique**

本来タイプについて2が変形徒手に該当するが,
マッサージに加算されるという特質から"1+2=3"として特別扱いしている.

```
0 … なし
1 … マッサージ
3 … マッサージ + 変形徒手(2)
```

**TherapyMode**

id属性"AMS_AC_MX_Mode"のvalue値

```tpMode
  0 … ALL = あん摩マッサージ指圧+はりきゅう
  1 … AMS = あん摩マッサージ指圧
  2 … ACMX = はりきゅう
```

指定しなかった場合0扱いとして全モード「あん摩マッサージ指圧+はりきゅう」として扱う.

**RowType**

table用タイトルthデータ,1はマッサージおよび2〜5変形徒手の行として内部で連番処理されるため定数を定義せず,
特殊処置のみ RowType として定数化している.

```
0 MASSAGE
6 HOTPACK
7 ELEHOTPACK
8 ACMX1
9 ACMX2
10 ELEACMX
```

**Price Constants（UnitPrice）**

UnitPrice は制度改定に対応するための内部料金定数である.
令和8年7月の療養費改定を基準とする.

```UnitPrice
    Massage : 470
    MCorrection : 470
    HotPack : 180
    EleHotPack : 300
    AandM1tec : 1650
    AandM2tec : 1820
    EleAandM : 100
    MedExp : [ 0, 2300, 1150, 460, 460, 460, 460, 460, 460, 460, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 70 ]
```

制度改定時はこの定数群のみ変更することを基本とする.

## DOMによる生成
### createAMSUI()

内部関数createAMSUI()により<div id="amsArea"></div>配下に各属性を持つ<label><select>～</select></label>を生成する.

```必須html
<div id="amsArea"></div>
```

```html
<div id="amsArea">
 <label class="rightUpperLimb">
  <span>右上肢</span>
  <select id="limb[0]" class="rightUpperLimb">
  …</select>
 </label>
 <label class="leftUpperLimb">
  <span>左上肢</span>
  <select id="limb[1]" class="leftUpperLimb">
  …</select>
 </label>
 <label class="rightLowerLimb">
  <span>右下肢</span>
  <select id="limb[2]" class="rightLowerLimb">
  …</select>
 </label>
 <label class="lefttLowerLimb">
  <span>左下肢</span>
  <select id="limb[3]" class="leftLowerLimb">
  …</select>
 </label>
 <label class="bodyTrunk">
  <span>体躯</span>
  <select id="limb[4]" class="bodyTrunk">
  …</select>
 </label>
</div>
```

### createAcMxUI()

内部関数createAcMxUI()により<div id="acmxArea"></div>配下に以下の各属性を持つ<fieldset><label><input type="checkbox">…<select>～</select></label></fieldset>を生成する.

```必須html
<div id="acmxArea"></div>
```

```html
<div id="acmxArea">
 <fieldset>
  <legend>鍼灸適応症（複数可）</legend>
  <label>
   <input type="checkbox" name="IndicateAcMx">
   神経痛
  </label>
  <label>
   <input type="checkbox" name="IndicateAcMx">
   リウマチ
  </label>
  <label>
   <input type="checkbox" name="IndicateAcMx">
   五十肩
  </label>
  <label>
   <input type="checkbox" name="IndicateAcMx">
   頸腕症候群
  </label>
  <label>
   <input type="checkbox" name="IndicateAcMx">
   腰痛症
  </label>
  <label>
   <input type="checkbox" name="IndicateAcMx">
   頸椎捻挫後遺症
  </label>
  <label title="医師の同意書に記載された慢性疼痛等">
   <input type="checkbox" name="IndicateAcMx">
   その他
  </label>
  <select id="AcMxTec">
   …</select>
 </fieldset>
</div>
```

## Public API/外部公開関数群

この4つだけが外部公開とする.
以下の関数は公開APIであり,互換性維持の対象とする.

runCalculator()

runOnSiteCalc()

runDrawTableCalc()

runModeUI()

これ以外の内部APIであり,
予告なく変更される場合がある.

### 関数フロー

```
runCalculator()
    │
    ├─> runOnSiteCalc()
    │        │
    │        ├─> createTreatmentFee()
    │        │        │
    │        │        ├─> AMSPrice()
    │        │        └─> ACMXPrice()
    │        │
    │        └─> OnSiteTotal()
    │
    └─> drawTable()
```

```
runDrawTableCalc()
    │
    └─> drawTable()
```

#### Return Value

runOnSiteCalc()
    -> Result

createTreatmentFee()
    -> Treatment

AMSPrice()
    -> number

ACMXPrice()
    -> number

OnSiteTotal()
    -> number

### 内部API - Internal API

以下の関数はライブラリ内部で利用する実装である.
外部からの利用は保証しない.

```h-v-ams_ac_mx_calc.js:
getCalcMode()

getHighlightCell(Treatment)

isValidLimb(arrLimb)

AMSCountParts()

AMSPrice(arrLimb)

ACMXHasIndication()

ACMXCountTec()

ACMXPrice(argTecs)

CalcRatio(argPrice, BurdenRatio)

OnSiteTotal(argPrice, BurdenRatio, HeadCount)

createTreatmentFee()

getRowTitle(argIndex)

getHeadCount()

getBurdenRatio()

clearAnswer()

clearTable()

drawTable(BurdenRatio, Treatment)

appendTableFoot(objTable)
```

```h-v-ams_ac_mx_ui.js:
initializeAutoForm()

initializeAutoTable()

initializeAutoUI()

initUI()

updateACMXTecState()

createAMSUI()

createAcMxUI()

clearAMSUI()

clearAcMxUI()

clearUI()

bindModeChange()

bindAutoTable()
```

## AMSPrice() エラー処理

isValidLimb関数で診断している

```返値
-1 … 変形徒手矯正が4肢を超えた場合.
 0 … 施術なし.
 0～4 … 正常な療養費.
```

## HTML data-* Attributes

### AMS_AC_MX_Mode

必須である
制度と同じで「あん摩マッサージ指圧+はりきゅう」若しくは「あん摩マッサージ指圧」のみか「はりきゅう」なのかを選別するためのid属性として設けられている

#### data-autoform

必要に応じて true/false

入力タグを自動で生成するモード

#### data-autotable

必要に応じて true/false

テーブルを自動で生成するモード

# 互換性ポリシー

公開API
HTML Contract
Data Model

は互換性維持の対象とする.

内部API
内部定数
内部アルゴリズム

は将来予告なく変更される場合がある.