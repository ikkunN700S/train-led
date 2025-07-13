    // ▼ ローマ字表示用マッピング
    const typeRomajiMap = {
        "普通": "Local",
        "区間快速": "Semi Rapid",
        "快速": "Rapid",
        "新快速": "New Rapid",
        "特別快速": "Special Rapid",
        "試運転": "Test Run",
        "臨時": "Extra",
        "回送": "Out of Service",
        "各停": "Local",
        "各駅停車": "Local",
        "準急": "Semi Exp.",
        "急行": "Express",
        "快速急行": "Rapid Exp.",
        "特急": "Limited Exp.",
        "快速特急": "Rapid Ltd. Exp."
    };

    let isJapanese = true;  // ▼ 切り替え制御フラグ

function updateDisplay() {
    const carNumber = document.getElementById("car-input").value;
    const carNumberArea = document.getElementById("car-number");
    const carDigit = document.getElementById("car-digit");
    const type = document.getElementById("type-select").value;
    const destination = document.getElementById("destination-input").value;

    const typeArea = document.getElementById("type-area");
    const destinationArea = document.getElementById("destination-area");

    const romaji = document.getElementById("romaji-input")?.value || "Romaji";

    

    // ▼ 表示内容の切り替えに備えて保持（属性として保持しておく）
    typeArea.setAttribute("data-ja", type);
    typeArea.setAttribute("data-en", typeRomajiMap[type] || type);

    destinationArea.setAttribute("data-ja", destination);
    destinationArea.setAttribute("data-en", romaji);

    if (carNumber.trim() === "") {
        carNumberArea.style.display = "none"; // 空なら非表示
    } else {
        carNumberArea.style.display = "flex"; // 表示（元に戻す）
        carDigit.textContent = carNumber;
    }

    // 上位種別リスト（斜体にしたい種別）
    const italicTypes = ["区間快速", "快速", "新快速", "特別快速"];



    if (type === "試運転") {
        // 試運転モード
        typeArea.style.display = "none"; // 非表示にする
        destinationArea.textContent = "試　運　転"; // 幅広表示
        destinationArea.style.letterSpacing = "0.3em";
        destinationArea.style.backgroundColor = "black";
        destinationArea.style.color = "white";
        destinationArea.style.width = "8.5em";    // 幅を広げる
        destinationArea.style.height = "1.5em"; // フレックスを無効化
    }else if(type === "臨時" || type === "回送") {
        // 臨時・回送モード
        typeArea.style.display = "none"; // 非表示にする
        destinationArea.textContent = type.split("").join("　 　"); // 例：「臨　時」
        destinationArea.style.letterSpacing = "";
        destinationArea.style.backgroundColor = "black";
        destinationArea.style.color = "white";
        destinationArea.style.width = "8.5em";    // 幅を広げる
        destinationArea.style.height = "1.5em"; // フレックスを無効化

    } else {
        // 通常の種別表示に戻す
        typeArea.style.display = ""; // 表示に戻す
        typeArea.textContent = type;
        destinationArea.textContent = destination;
        destinationArea.style.flex = ""; 
        destinationArea.style.letterSpacing = "";
        destinationArea.style.backgroundColor = "";
        destinationArea.style.color = "";
        destinationArea.style.width = "";
        destinationArea.style.height = "";


        // ← ここで斜体クラスを切り替え
        if (italicTypes.includes(type)) {
            typeArea.classList.add("italic-text");
        } else {
            typeArea.classList.remove("italic-text");
        }
        
        // 種別ごとの色設定
        switch (type) {
            case "普通":
            case "各停":
            case "各駅停車":
                typeArea.style.backgroundColor = "#787878ff";
                typeArea.style.color = "white";
                break;
            case "区間快速":
                typeArea.style.backgroundColor = "#00cc44";
                typeArea.style.color = "white";
                break;
            case "快速":
                typeArea.style.backgroundColor = "#0052cc";
                typeArea.style.color = "white";
                break;
            case "新快速":
                typeArea.style.backgroundColor = "#ff6600";
                typeArea.style.color = "white";
                break;
            case "特別快速":
                typeArea.style.backgroundColor = "#ffff00ff";
                typeArea.style.color = "black";
                break;
            case "準急":
                typeArea.style.backgroundColor = "#32cd32";
                typeArea.style.color = "white";
                break;
            case "急行":
                typeArea.style.backgroundColor = "#00bfff";
                typeArea.style.color = "white";
                break;
            case "快速急行":
                typeArea.style.backgroundColor = "white";
                typeArea.style.color = "#00bfff";
                break;
            case "特急":
                typeArea.style.backgroundColor = "#ff0000";
                typeArea.style.color = "white";
                break;
            case "快速特急":
                typeArea.style.backgroundColor = "white";
                typeArea.style.color = "#ff0000";
                break;
            default:
                typeArea.style.backgroundColor = "#444";
                typeArea.style.color = "white";
        }
    }
}

function switchLanguage() {
    const typeArea = document.getElementById("type-area");
    const destinationArea = document.getElementById("destination-area");
    const carNumberArea = document.getElementById("car-number");
    const carDigit = document.getElementById("car-digit");
    const carLabel = carNumberArea?.querySelector(".car-label");

    if (!typeArea || !destinationArea || !carLabel || !carDigit) return;

    // 現在の表示モード取得（例: "試運転", "臨時", "回送" など）
    const typeText = typeArea.getAttribute("data-ja");

    // 特殊種別かどうか
    const isSpecialType = ["試運転", "臨時", "回送"].includes(typeText);

    if (isJapanese) {
        if(isSpecialType){
            // 行き先欄に種別を表示
            destinationArea.textContent = typeArea.getAttribute("data-en");
            destinationArea.style.letterSpacing = "normal";
        }else{
            // ▼ ローマ字表示に切り替え
            typeArea.textContent = typeArea.getAttribute("data-en");
            destinationArea.textContent = destinationArea.getAttribute("data-en");
            destinationArea.style.letterSpacing = "normal";
        }
        // 車両番号の表示を切り替え
        carLabel.textContent = "No.";  // ← 上段を No.
        carDigit.textContent = document.getElementById("car-input").value || "1";
        // 要素を入れ替え（No.が上）
        carNumberArea.appendChild(carLabel);
        carNumberArea.appendChild(carDigit);
    } else {
        if(isSpecialType){
            // 行き先欄に種別を表示
            destinationArea.textContent = typeArea.getAttribute("data-ja");
        }else{
            // ▼ 日本語表示に戻す
            typeArea.textContent = typeArea.getAttribute("data-ja");
            destinationArea.textContent = destinationArea.getAttribute("data-ja");
            destinationArea.style.letterSpacing = "0.2em";
        }
        // 車両番号の表示を切り替え
        carDigit.textContent = document.getElementById("car-input").value || "1"; 
        carLabel.textContent = "号車"; 
        // 要素を入れ替え（数字が上）
        carNumberArea.appendChild(carDigit);
        carNumberArea.appendChild(carLabel);
    }

    isJapanese = !isJapanese;
}

// ▼ 3秒ごとに日本語とローマ字を切り替える
setInterval(switchLanguage, 3500);

// ▼ 初期表示更新
window.addEventListener("DOMContentLoaded", updateDisplay);

