export class DictItem {
    通關簽審文件編號: string;
    中文品名: string;
    英文品名: string;
    適應症: string;
    劑型: string;
    管制藥品分類級別: string;
    用法用量: string;
    包裝: string;
    包裝與國際條碼: string;
    有效日期: string;
    發證日期: string;
    許可證字號: string;
    許可證種類: string;
    舊證字號: string;
    藥品類別: string;
    主成分略述: string;
    異動日期: string;

    申請商名稱: string;
    申請商地址: string;
    申請商統一編號: string;
    製造商名稱: string;
    製造廠國別: string;
    製造廠廠址: string;
    製造廠公司地址: string;

    製程: string;
    註銷狀態: string;
    註銷日期: string;
    註銷理由: string;

    constructor(json: any) {
        this.製造廠廠址 = json.製造廠廠址;
        this.許可證種類 = json.許可證種類;
        this.許可證字號 = json.許可證字號;
        this.註銷理由 = json.註銷理由;
        this.劑型 = json.劑型;
        this.通關簽審文件編號 = json.通關簽審文件編號;
        this.舊證字號 = json.舊證字號;
        this.發證日期 = json.發證日期;
        this.異動日期 = json.異動日期;
        this.製造商名稱 = json.製造商名稱;
        this.主成分略述 = json.主成分略述;
        this.管制藥品分類級別 = json.管制藥品分類級別;
        this.有效日期 = json.有效日期;
        this.製造廠國別 = json.製造廠國別;
        this.註銷狀態 = json.註銷狀態;
        this.藥品類別 = json.藥品類別;
        this.適應症 = json.適應症;
        this.製造廠公司地址 = json.製造廠公司地址;
        this.英文品名 = json.英文品名;
        this.包裝與國際條碼 = json.包裝與國際條碼;
        this.申請商地址 = json.申請商地址;
        this.包裝 = json.包裝;
        this.申請商統一編號 = json.申請商統一編號;
        this.中文品名 = json.中文品名;
        this.用法用量 = json.用法用量;
        this.申請商名稱 = json.申請商名稱;
        this.製程 = json.製程;
        this.註銷日期 = json.註銷日期;
    }

    static sortedKeys = [
        "中文品名",
        "英文品名",
        "通關簽審文件編號",
        "適應症",
        "用法用量",
        "主成分略述",
        "劑型",
        "包裝",
        "包裝與國際條碼",
        "藥品類別",
        "管制藥品分類級別",
        "許可證字號",
        "許可證種類",
        "發證日期",
        "有效日期",
        "異動日期",
        "舊證字號",
        "製程",
        "註銷狀態",
        "註銷日期",
        "註銷理由",

        "申請商名稱",
        "申請商地址",
        "申請商統一編號",
        "製造商名稱",
        "製造廠國別",
        "製造廠廠址",
        "製造廠公司地址",
    ];
}
