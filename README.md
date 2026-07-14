# 訪問鍼灸・あん摩マッサージ指圧料金シミュレーター
**Project Name** 
訪問鍼灸・あん摩マッサージ指圧料金シミュレーター
**English Name**
 Home Visit Amma-Massage-Shiatsu, Acupuncture & Moxibustion Calculator
**Project Abbreviation**
HV-AMS/AC/MX Project
**Identifier**
h-v-ams_ac_mx_calc

## プロジェクト概要

訪問鍼灸・あん摩マッサージ指圧料金シミュレーター（Home Visit Amma-Massage-Sh
iatsu, Acupuncture & Moxibustion Calculator、略称 h-v-ams_ac_mx_calc）は、受
領委任制度下の療養費に基づく訪問あん摩マッサージ指圧・はり・きゅうの施術料を
Webブラウザ上で試算するJavaScriptプログラムです。

計算ロジックとユーザーインターフェースを分離した構成を採用しており、施術内容
や負担割合の変更に応じて施術料および、療養費（一部負担金）一覧表を動的に再計
算・再表示できます。

HTMLから読み込むだけで利用できます。外部ライブラリやサーバーサイド環境は必要
ありません。動作確認用のサンプルHTMLも添付しているため、そのまま料金シミュレ
ーターとして利用することも、既存のWebページへ組み込むことも可能です。

## システム要件

### 必要な環境
本プロジェクトはHTMLおよびJavaScriptに対応したWebブラウザで動作します。
（ECMAScript 2015（ES6）以降対応）

Webサーバー上に配置したHTMLから読み込んで利用します。外部ライブラリは必要あ
りません。サンプルHTMLも添付しているため、動作確認後、そのまま療養費シミュレ
ーターとして利用できます。

### 動作確認環境

以下の環境で開発動作確認を実施しています。

- Windows 11 Pro 25H2
- FreeBSD 14.4-RELEASE（Xorg 7.7、Firefox）
- FreeBSD 14.4-RELEASE（Apache 2.4.68、Webサーバ開発環境）
- Microsoft Edge バージョン 149.0.4022.98（公式ビルド）（64 ビット）
- Brave（Chromium 149.0.7827.201ベース）
- Firefox 152.0.3（64 ビット）

※ 上記以外の環境でも動作する可能性がありますが、未確認です。

## 特徴

本JavaScriptプログラムは、受領委任制度における療養費の算定に基づき、施術料お
よび利用者負担額（一部負担金）を計算します。

- Webブラウザ上で動作
- HTMLから読み込むだけで利用可能
- 外部ライブラリ不要
- 訪問あん摩マッサージ指圧、はり、きゅうの施術料計算に対応
- 負担割合に応じた自己負担額を自動計算
- 療養費一覧表を動的に生成・更新

## 対応している制度
### 対応制度
受領委任制度によるあん摩マッサージ指圧師、はり師、きゅう師の訪問施術の療養費

さらに、健康保険（公的医療保険）上の負担割合
- 1割
- 2割
- 3割
- 全額負担（10割）

## ディレクトリ構成
h-v-ams_ac_mx_calc/

├── h-v-ams_ac_mx_calc.js  …計算ロジック
├── h-v-ams_ac_mx_ui.js    …UI制御
├── sample-basic.html      …自動入力を使わずに展開したサンプル画面
├── sample-auto-form.html  …自動入力使用サンプル画面
├── sample-auto-table.html …自動表示一覧表のみサンプル画面
├── sample-full-auto.html  …モード切替つき自動入力表示のサンプル画面
├── canvas.js              …画像を自由に変更してお使いください
├── demo.html              …デモ画面
├── demo.css               …デモ画面用スタイルシート
├── demo.js                …デモ画面用JavaScript
├── LICENSE
├── LICENSE-PROJECT
├── NOTICE
└── README.md

## Quick Start

sample-basic.html、sample-auto-form.html、sample-full-auto.html、何れかのフ
ァイル名を変更して、h-v-ams_ac_mx_calc.js、h-v-ams_ac_mx_ui.jsおよびcanvas.js
を同一ディレクトリに置いてWebブラウザで読み込みます

sample-auto-table.htmlはh-v-ams_ac_mx_calc.js、h-v-ams_ac_mx_ui.jsを同一ディ
レクトリに配置して使います（canvas.jsは使いません）

- sample-basic.html … 最小構成（フォーム用のタグは記載）
- sample-auto-form.html … 自動フォーム生成
- sample-auto-table.html … 一覧表のみ
- sample-full-auto.html … フル機能

### id属性と用途一覧

詳しくは使い方とsample-*.htmlのソースをご覧ください

- AMS_AC_MX_Mode     : モード指定
- BurdenRatio        : 負担割合
- HeadCount          : 訪問人数
- AnswersBodyAnatomy : 計算結果
- tableArea          : 一覧表

更にUI制御機能を使って入力タグを展開したい時など、他のid属性が必要となります
ので使い方とsample-*.htmlのソースを参考にされてください

## 使い方

### JavaScriptの読み込み
```html
<script src="h-v-ams_ac_mx_calc.js"></script>
<script src="h-v-ams_ac_mx_ui.js"></script>
```
本プロジェクトは次の2つのJavaScriptファイルで構成されています。
HTMLの <body> 終了タグ直前などで読み込んでください。
依存関係がありますので記述する順番は上記の通りとしてください。

- **h-v-ams_ac_mx_calc.js**（以下「CALC」）
  - 療養費計算ロジック
  - 公開API
  - 一部負担金計算

- **h-v-ams_ac_mx_ui.js**（以下「UI」）
  - 入力フォーム自動生成・監視（一部）
  - 負担金一覧表生成
  - UI制御

### 訪問あん摩マッサージ指圧・訪問はりきゅうとモード（CALC）
制度上から見て、訪問による「あん摩マッサージ指圧」と「はり・きゅう」の２つに
分けられていると解釈できる。「あん摩マッサージ指圧」モードと「はりきゅう」モ
ードと分けて計算する。両モードを混合か独立して計算するために以下のid属性をも
つタグを必要とする

```html
<input id="AMS_AC_MX_Mode">
```
- value="0" ... あん摩マッサージ指圧とはりきゅう
- value="1" ... あん摩マッサージ指圧
- value="2" ... はりきゅう
value属性がない場合やvalue属性の値を上記以外にしても無視して"0"モードとして動
作する

### UIコントロールのモード（CALC・UI）
入力UI設置補助のために"true"を指定することで機能を持たせることもできる
```html
<input 
    id="AMS_AC_MX_Mode"
    data-autoform="true"
    data-autotable="true">
```data-autoform="true"```
value属性の値に応じてid属性"amsArea"若しくは"acmxArea"を持つタグに入力フォー
ムを自動的に展開する
```<div id="amsArea"></div>```
「あん摩マッサージ指圧」の５部位の<select>を展開する
```<div id="acmxArea"></div>```
「はりきゅう」の適応チェックボックスと術数の<select>を展開する
```data-autotable="true"```
```<div id="tableArea"></div>```
テーブル「負担金一覧表」を展開する

### 負担金一覧表の表示（CALC）
テーブル「負担金一覧表」を展開するためには以下のid属性"tableArea"を持つタグが
必須となる
```<div id="tableArea"></div>```
また、負担割合を計算させるためにid属性"BurdenRatio"を持ちvalue属性で値を渡す
必要がある
```<select name="BurdenRatio" id="BurdenRatio">
<option value="1">１割</option>
<option value="2">２割</option>
<option value="3">３割</option>
<option value="10">全額(10割)</option>
</select>```
「全額負担（10割）」は制度上の施術料相当額を表示するための計算モードであり、
  自由診療等の保険外施術料金を示すものではありません。

### 負担金の計算結果の表示（CALC）
id属性"AnswersBodyAnatomy"を持つタグに
`利用者負担額(含訪問施術料)${Price}円/１回`
として表示展開する
```<div id="AnswersBodyAnatomy"></div>```

負担割合を計算させるためにid属性"BurdenRatio"を持ちvalue属性で値を渡すことに
加え、１建物当たりの人数をid属性"HeadCount"を持ちvalue属性で値を渡す必要があ
る
```<select name="BurdenRatio" id="BurdenRatio">
<option value="1">１割</option>
<option value="2">２割</option>
<option value="3">３割</option>
<option value="10">全額(10割)</option>
</select>
<select name="HeadCount" id="HeadCount">
<option value="1">ご自宅</option>
<option value="1">１人</option>
<option value="2">２人</option>
<option value="3">３～９人</option>
<option value="10">１０～１９人</option>
<option value="20">２０人以上</option>
<option value="0">訪問施術料含まない</option>
</select>```
id属性"HeadCount"のvalue値は現在の制度下に合わせて表記しています
value="10" ・・・10〜19人
value="20" ・・・20人以上
10〜19人の場合は、その範囲であれば適正な同じ値を返します
value値は"20"を上限とし21人以上の場合でも"20"としてください

### javascript公開関数
#### 負担金計算の実行と負担金一覧表（CALC）
```javascript
HV_AMSACMX.modules.calc.api.runCalculator() 
```
療養費（一部負担金）計算および療養費（一部負担金）一覧表の更新を行います。
簡易呼び出し（互換API） ```runCalculator() ```

#### 療養費計算の実行のみ（CALC）

```javascript
HV_AMSACMX.modules.calc.api.runOnSiteCalc() 
```
療養費計算（一部負担金）の実行のみ更新を行います。
簡易呼び出し（互換API） ```runOnSiteCalc() ```

#### 療養費一覧表のみ更新（CALC）

```javascript
HV_AMSACMX.modules.calc.api.runDrawTableCalc() 
```
療養費（一部負担金）一覧表のみを更新します。
簡易呼び出し（互換API） ```runDrawTableCalc() ```

#### 負担金計算の実行と負担金一覧表（CALC・UI）
```javascript
HV_AMSACMX.modules.ui.api.runModeUI() 
```
療養費（一部負担金）計算および療養費（一部負担金）一覧表の更新を行います。
簡易呼び出し（互換API） ```runModeUI() ```

## 計算内容

利用者様の負担額を表示するために以下の計算を行っている
### 療養費計算：
( 施術料 + 訪問施術料 ) / 負担割合計算 = 一部負担金
- マッサージ
- 変形徒手矯正
- はりきゅう

### 療養費（一部負担金）一覧表：

表では以下が表示している
訪問施術料がどこにかかるかということと分けて考えたため一覧表には含めていない
施術料 / 負担割合計算 = 一部負担金
- マッサージ
- 変形徒手矯正
- 温罨法
- 電気温罨法
- はりきゅう
- 電療料

## 更新方針
本プロジェクトは、療養費制度の改定、関係通知の変更、不具合修正、機能追加等に
応じて更新します。

単価設定や組み込み方法など、開発者向けのカスタマイズについては別途技術資料を
参照してください。

## ライセンスおよび免責事項
本ソフトウェアは、LICENSE-PROJECT の定めに従い、現状有姿（AS IS）で提供され
ます。
本ソフトウェアの利用によって生じたいかなる損害についても、著作者は責任を負い
ません。
実際の療養費の算定にあたっては、関係法令、通知、保険者等の最新の取扱いをご確
認ください。
また、本プロジェクトに付属するサンプルHTMLおよびサンプル画像は、動作確認およ
び利用例を示すことを目的として提供しています。
サンプルに含まれる第三者著作物の著作権は、それぞれの著作権者に帰属します。こ
れらの著作物は本プロジェクトのライセンスの対象外であり、利用にあたっては各著
作権者の定める条件に従ってください。

## Author
Genjiro SAKAMAKI(空波羅堂)

ライセンスおよび商用利用に関するお問い合わせは、Webサイトのお問い合わせフォ
ームをご利用ください。
https://www.zpe.rest/コンタクト/
