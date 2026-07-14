/* 
 * デモンストレーション用スクリプト
 * Copyright 2026 Genjiro SAKAMAKI(Sorahara-Do)
 */

document.addEventListener("DOMContentLoaded", () => {
    initDemoUI();
});

function bindDemoRunButton() {
    document.getElementById("RunButton")
        .addEventListener("click", () => {

            const funcName =
                document.getElementById("RunFunction").value;

            const api = HV_AMSACMX.modules.calc.api;

            if (typeof api[funcName] === "function") {
                clearTable();
                api[funcName]();
            } else {
                console.error(`Unknown API: ${funcName}`);
            }
        });
}

function initDemoUI() {
    initializeAutoForm();
    initializeAutoTable();
    bindModeChange();
    bindAutoTable();
    bindDemoRunButton();
}
