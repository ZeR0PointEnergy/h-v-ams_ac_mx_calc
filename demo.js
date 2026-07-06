document.addEventListener("DOMContentLoaded", () => {
    initUI();
});

function bindRunButton() {
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

function initUI() {
    bindModeChange();
    bindRunButton();
}
