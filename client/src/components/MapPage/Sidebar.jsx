import React, { useState, useEffect } from "react";
import { useGlobalContext } from "./Context";
import { FaTimes } from "react-icons/fa";
import styles from "../../styles/mp-sidebar.scss";
import axios from "axios";
import Loding from "./Lodin";
import { BiChevronRight } from "react-icons/bi";

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar, sidebarCategory, isNeedMyLocation } =
    useGlobalContext();
  // const { openSidebar } = useGlobalContext();
  const [area, setArea] = useState();
  const [data, setData] = useState();
  const [weather, setWeather] = useState();
  const [END_POINT, setEND_POINT] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState("00:00:00");

  const getData = async () => {
    const point = localStorage.getItem("END_POINT");
    // const point_latitude = localStorage.getItem("latitude");
    // const point_longitude = localStorage.getItem("longitude");
    console.log(point);
    setIsLoading(true); // 로딩중임을 알림
    try {
      const res = await axios.post("http://localhost:4000/data/getdata", {
        point,
      });
      res.status === 200 ? console.log(res.status) : console.log(res.json());
      const allData = res.data;
      console.log(allData);
      setArea((cur) => allData.model.area_name);
      setData((cur) => allData.model.live_data);
      setWeather((cur) => allData.weatherModel);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false); // 로딩 완료를 알림
  };

  useEffect(() => {
    getData();
    //10분마다 데이터 갱신 시키기
    const reNew = setInterval(() => {
      getData();
      console.log("데이터 갱신 완료");
    }, 600000);
    return () => clearInterval(reNew); // unmount 시 interval 해제
  }, []);

  // 현재 시간 출력

  const currentTimer = () => {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    setTimer(`${hours}:${minutes}:${seconds}`);
  };

  const startTimer = () => {
    setInterval(currentTimer, 1000);
  };

  startTimer();

  return (
    <aside className={`${isSidebarOpen ? "sidebar show-sidebar" : "sidebar"} `}>
      <div className="sidebar-header">
        <p>
          현재 시간 <span>{timer}</span> 기준
        </p>
        <h1>{area}</h1>
        <button className="close-btn" onClick={closeSidebar}>
          <FaTimes />
        </button>
      </div>
      {isLoading ? (
        <Loding /> // 로딩중인 동안 렌더링되는 로딩컴포넌트
      ) : (
        <div className="detail-content">
          {sidebarCategory === "information" && (
            <div className="detail-information">
              <div className="report-population">
                <h3>
                  실시간 인구 <BiChevronRight />
                </h3>
                <h2>
                  현재 인구 혼잡도가{" "}
                  <span className="report-crowded">
                    {data?.AREA_CONGEST_LVL[0]}
                  </span>{" "}
                  입니다.
                </h2>
                <br />
                <span className="report-crowded-msg">
                  {data?.AREA_CONGEST_MSG[0]}
                </span>
              </div>
              <br />
              <br />
              <div className="report-weather">
                <p>
                  오늘 최고 기온은 {weather?.max_temperature}도 <br />
                  최저 기온은 {weather?.min_temperature}도 이고, <br />
                  현재 체감 온도는 {weather?.sen_temperature}입니다. <br />
                  <br />
                  오늘의 날씨는 {weather?.pcp_msg}
                </p>
              </div>
            </div>
          )}
          {sidebarCategory === "emergency" && (
            <div className="detail-emergency"></div>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
