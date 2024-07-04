import "./index.less";
import areaCode from "@/utils/code";
import { randomIdCard } from "@/utils/idcard";
import { useState } from "react";
import { surnames, givenNames, ethnicities } from "./option";
function ToolPanel({ submit, triggerEvent }) {
  const oneLevel = areaCode["100000"];
  const [twoLevel, setTwoLevel] = useState({});
  const [threeLevel, setThreeLevel] = useState({});
  const [fromData, setFromData] = useState({
    name: "",
    sex: "",
    date: "",
    province: "",
    city: "",
    district: "",
    address: "",
    idcard: "",
    createTime: "",
    limitTime: "",
    nation: "",
  });
  const [isCreate, setIsCreate] = useState(false);
  const limitList = [
    { label: "5年", value: "1" },
    { label: "10年", value: "2" },
    { label: "20年", value: "3" },
  ];
  const changeArea = (e, level) => {
    const { value } = e.target;
    if (level === 1) {
      setTwoLevel(areaCode[value]);
      setThreeLevel({});
      setFromData({
        ...fromData,
        province: value,
        city: "",
        district: "",
      });
    }
    if (level === 2) {
      setThreeLevel(areaCode[value]);
      setFromData({ ...fromData, city: value, district: "" });
    }
    if (level === 3) {
      setFromData({ ...fromData, district: value });
    }
  };
  const changeValue = (e) => {
    const { value, name } = e.target;
    setFromData({ ...fromData, [name]: value });
  };
  const validateForm = () => {
    let valid = true;
    Object.keys(fromData).forEach((key) => {
      if (!fromData[key]) {
        valid = false;
      }
    });
    if (!valid) {
      alert("请将信息填写完整");
    }
    return valid;
  };
  const submitForm = () => {
    if (!validateForm()) return;
    const { district, date, sex, idcard: idCard } = fromData;
    const idcard = idCard
      ? idCard
      : randomIdCard(district, date.split("-").join(""), sex, 1)[0];
    setFromData({ ...fromData, idcard });
    setIsCreate(true);
    submit({ ...fromData, idcard });
  };
  const generateName = () => {
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const givenName1 =
      givenNames[Math.floor(Math.random() * givenNames.length)];
    const givenName2 =
      givenNames[Math.floor(Math.random() * givenNames.length)];
    const fullName = surname + givenName1 + givenName2;
    return fullName;
  };
  const generateSex = () => {
    return Math.floor(Math.random() * 2);
  };
  const generateDate = () => {
    const startYear = 1970;
    const endYear = 2023;
    const year =
      Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = Math.floor(Math.random() * 12) + 1;
    const paddedMonth = month.toString().padStart(2, "0"); // 月份补零
    const daysInMonth = new Date(year, month, 0).getDate();
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    const paddedDay = day.toString().padStart(2, "0");
    const formattedDate = `${year}-${paddedMonth}-${paddedDay}`;
    return formattedDate;
  };
  const generateLimitTime = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear(); // 获取当前年份
    const month = currentDate.getMonth() + 1; // 获取当前月份（加1是因为月份从0开始）
    const date = currentDate.getDate();
    const createTime = `${year}-${month.toString().padStart(2, "0")}-${date
      .toString()
      .padStart(2, "0")}`;
    const limitTime = "2";
    return { createTime, limitTime };
  };
  const generateAddress = () => {
    const keys1 = Object.keys(oneLevel);
    const province = keys1[Math.floor(Math.random() * keys1.length)];
    setTwoLevel(areaCode[province]);
    const keys2 = Object.keys(areaCode[province]);
    const city = keys2[Math.floor(Math.random() * keys2.length)];
    setThreeLevel(areaCode[city]);
    const keys3 = Object.keys(areaCode[city]);
    const district = keys3[Math.floor(Math.random() * keys3.length)];
    const streets = ["人民路", "解放路", "建设路", "和平路", "中山路"];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const houseNumber = Math.floor(Math.random() * 1000) + 1;
    const address = street + houseNumber + "号";
    return { province, city, district, address };
  };
  const autoGenerate = () => {
    const name = generateName();
    const sex = generateSex().toString();
    const date = generateDate();
    const addressCode = generateAddress();
    const idcard = randomIdCard(
      addressCode.district,
      date.split("-").join(""),
      sex,
      1
    )[0];
    const limitObj = generateLimitTime();
    const nation = "汉族";
    setFromData({
      ...fromData,
      name,
      sex,
      date,
      ...addressCode,
      idcard,
      ...limitObj,
      nation,
    });
  };
  const download = () => {
    triggerEvent();
  };
  return (
    <div className="tool-panel">
      <div className="form-item">
        <div className="form-item-label">姓名</div>
        <input
          type="text"
          name="name"
          value={fromData.name}
          maxLength="5"
          onChange={(e) => changeValue(e)}
        />
      </div>
      <div className="form-item">
        <div className="form-item-label">性别</div>
        <div className="redio-group">
          <label>
            <input
              type="radio"
              name="sex"
              value="1"
              checked={fromData.sex === "1"}
              onChange={(e) => changeValue(e)}
            />
            男
          </label>
          <label>
            <input
              type="radio"
              name="sex"
              value="0"
              checked={fromData.sex === "0"}
              onChange={(e) => changeValue(e)}
            />
            女
          </label>
        </div>
      </div>
      <div className="form-item">
        <div className="form-item-label">民族</div>
        <select
          value={fromData.nation}
          name="nation"
          onChange={(e) => changeValue(e)}
        >
          <option value="" disabled hidden>
            请选择
          </option>
          {ethnicities.map((item, index) => {
            return (
              <option value={item} key={index}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div className="form-item">
        <div className="form-item-label">出生日期</div>
        <input
          type="date"
          name="date"
          value={fromData.date}
          onChange={(e) => changeValue(e)}
        />
      </div>
      <div className="form-item">
        <div className="form-item-label">住址</div>
        <div className="select-group">
          <select value={fromData.province} onChange={(e) => changeArea(e, 1)}>
            <option value="" disabled hidden>
              省
            </option>
            {Object.keys(oneLevel).map((key) => {
              return (
                <option value={key} key={key}>
                  {oneLevel[key]}
                </option>
              );
            })}
          </select>
          <select value={fromData.city} onChange={(e) => changeArea(e, 2)}>
            <option value="" disabled hidden>
              市
            </option>
            {Object.keys(twoLevel).map((key) => {
              return (
                <option value={key} key={key}>
                  {twoLevel[key]}
                </option>
              );
            })}
          </select>
          <select value={fromData.district} onChange={(e) => changeArea(e, 3)}>
            <option value="" disabled hidden>
              区
            </option>
            {Object.keys(threeLevel).map((key) => {
              return (
                <option value={key} key={key}>
                  {threeLevel[key]}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="form-item">
        <div className="form-item-label">详细住址</div>
        <input
          type="text"
          name="idcard"
          value={fromData.address}
          maxLength="20"
          onChange={(e) => changeValue(e)}
        />
      </div>
      <div className="form-item">
        <div className="form-item-label">身份证号</div>
        <input
          type="text"
          name="idcard"
          value={fromData.idcard}
          maxLength="18"
          onChange={(e) => changeValue(e)}
        />
      </div>
      <div className="form-item">
        <div className="form-item-label">有效期限</div>
        <input
          type="date"
          name="createTime"
          value={fromData.createTime}
          onChange={(e) => changeValue(e)}
        />
        <select
          value={fromData.limitTime}
          name="limitTime"
          onChange={(e) => changeValue(e)}
        >
          <option value="" disabled hidden>
            请选择
          </option>
          {limitList.map((item) => {
            return (
              <option value={item.value} key={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
      </div>
      <div className="button-content">
        <button onClick={submitForm}>生成</button>
        <button onClick={autoGenerate}>自动生成</button>
        <button disabled={!isCreate} onClick={download}>
          导出
        </button>
      </div>
    </div>
  );
}
export default ToolPanel;
