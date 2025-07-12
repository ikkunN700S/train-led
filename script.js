function updateDisplay() {
    const carNumber = document.getElementById("car-input").value;
    const type = document.getElementById("type-select").value;
    const destination = document.getElementById("destination-input").value;

    const carNumberArea = document.getElementById("car-number");
    const typeArea = document.getElementById("type-area");
    const destinationArea = document.getElementById("destination-area");

    document.getElementById("car-digit").textContent = carNumber;


    // 上位種別リスト（斜体にしたい種別）
    const italicTypes = ["区間快速", "快速", "新快速", "特別快速"];


    if (type === "試運転") {
        // 試運転モード
        typeArea.style.display = "none"; // 非表示にする
        //destinationArea.style.flex = "1"; // フレックス拡張
        destinationArea.textContent = "試　運　転"; // 幅広表示
        destinationArea.style.letterSpacing = "0.3em";
        destinationArea.style.backgroundColor = "black";
        destinationArea.style.color = "white";
        typeArea.classList.remove("italic-text");
        destinationArea.style.width = "8.5em";    // 幅を広げる
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

        // ← ここで斜体クラスを切り替え
        if (italicTypes.includes(type)) {
            typeArea.classList.add("italic-text");
        } else {
            typeArea.classList.remove("italic-text");
        }
        
        // 種別ごとの色設定
        switch (type) {
            case "普通":
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
            default:
                typeArea.style.backgroundColor = "#444";
                typeArea.style.color = "white";
        }
    }
}
