import "./App.less";
import CanvasPanel from "./components/canvasPanel";
import ToolPanel from "./components/toolPanel";
import { useState, useRef } from "react";
import areaCode from "@/utils/code";
function App() {
  const [formData, setFromData] = useState(null);
  const canvasPanelRef = useRef(null);
  const addTime = (time, limit) => {
    const currentDate = new Date(time); // 当前日期 2024-06-06
    const currentYear = currentDate.getFullYear(); // 获取当前年份 2024
    currentDate.setFullYear(currentYear + limit); // 将年份加上10，变成 2034
    return (
      currentDate.getFullYear() +
      "." +
      (currentDate.getMonth() + 1) +
      "." +
      currentDate.getDate()
    );
  };
  const submitForm = (e) => {
    const {
      name,
      sex,
      date,
      province,
      city,
      district,
      idcard,
      address,
      createTime,
      limitTime,
      nation,
    } = e;
    const [year, month, day] = date.split("-");

    const districtStr = areaCode[city][district];
    const provinceStr = areaCode["100000"][province];
    let endTime = "";
    switch (limitTime) {
      case "1":
        endTime = addTime(createTime, 5);
        break;
      case "2":
        endTime = addTime(createTime, 10);
        break;
      case "3":
        endTime = addTime(createTime, 20);
        break;
      default:
        endTime = "";
        break;
    }
    const validityPeriod = createTime.split("-").join(".") + "-" + endTime;
    setFromData({
      name,
      sex: sex === "1" ? "男" : "女",
      year,
      month,
      day,
      address: provinceStr + districtStr + address,
      unit: districtStr + "公安局",
      idcard,
      validityPeriod,
      nation,
    });
  };
  const triggerEvent = () => {
    canvasPanelRef.current.download();
  };
  return (
    <div className="App">
      <div className="layout">
        <div className="layout-left">
          <CanvasPanel cardInfo={formData} ref={canvasPanelRef} />
        </div>
        <div className="layout-right">
          <ToolPanel submit={submitForm} triggerEvent={triggerEvent} />
        </div>
      </div>
    </div>
  );
}

export default App;
