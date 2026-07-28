# Home Visit Anma-Massage-Shiatsu,Acupuncture & Moxibustion Calculator

## API Reference

本書は h-v-ams_ac_mx_calc が公開する JavaScript API を定義する.
内部実装および設計については SPEC.md を参照する.

This document describes the public JavaScript API provided by
h-v-ams_ac_mx_calc.

For internal design, data structures and HTML Contract,
see SPEC.md.

### Project
    訪問鍼灸マッサージ料金シミュレーター

### Short Name
    h-v-ams_ac_mx_calc

### License
    Practitioner-Led Stewardship License Version 1.0

## Contents

1. Namespace
2. Modules
3. Calculator API
4. UI API
5. Configuration
6. HTML Contract
7. Supported API Version
8. Examples
9. Compatibility

## 1. Namespace

The library exports a single global namespace.

window.HV_AMSACMX

```Tree
window
 └── HV_AMSACMX
        version
        config
        modules
```

### version

HV_AMSACMX.version.api

Type
    string

Example
    "1.0"

### config

HV_AMSACMX.config.debug

Type
    boolean

Default
    false

## 2. Modules

HV_AMSACMX.modules.calc

    Fee calculation engine

HV_AMSACMX.modules.ui

    User interface generator

## 3. Calculator Module
HV_AMSACMX.modules.calc

Version

```
version
revision
api
```

API

### HV_AMSACMX.modules.calc.api.runCalculator()

Description

Perform a fee calculation and redraw the fee table.

Return

None

### HV_AMSACMX.modules.calc.api.runOnSiteCalc()

Description

Calculate one treatment session and return the calculation result.

Return

Result Object

    BurdenRatio
        number

    Treatment
        Treatment Object

    Price
        number

### HV_AMSACMX.modules.calc.api.runDrawTableCalc()

Description

Redraw only fee table.

Return

None

## 4. UI API

### HV_AMSACMX.modules.ui.api.runModeUI()

Description

Rebuilds the user interface according to the selected mode.

Return

None

## 5. Configuration

HV_AMSACMX.config.debug

Type

boolean

Default

false

Description

Outputs internal debug information to the browser console.

## 6. HTML Contract

The following HTML IDs form part of the
public HTML Contract.

AMS_AC_MX_Mode

HeadCount

BurdenRatio

AcMxTec

AnswersBodyAnatomy

tableArea

amsArea

acmxArea

See SPEC.md for details.

Required Input IDs
(when the UI is implemented manually)

limb[0]

limb[1]

limb[2]

limb[3]

limb[4]

When createAMSUI() is used,
these elements are generated automatically.

When implementing the HTML manually,
all input IDs listed above are required

## 7. Supported API Version

Current

1.0

Compatible

1.x

## 8. Examples

Minimal Example

```javascript
HV_AMSACMX.modules.ui.api.runModeUI();

HV_AMSACMX.modules.calc.api.runCalculator();

HV_AMSACMX.config.debug = true;
```

## 9. Compatibility

The following interfaces are guaranteed
within API Version 1.x.

- window.HV_AMSACMX
- HV_AMSACMX.modules.calc.api
- HV_AMSACMX.modules.ui.api

Internal functions and constants are not
covered by compatibility guarantees.

Applications should use only the
documented public interfaces.
