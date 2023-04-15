import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
  useListener,
  InfoWindow,
  Circle,
} from 'react-naver-maps';
import '../../styles/mp-sidebar.scss';
// import Papa from 'papaparse';
import { useGlobalContext } from './Context';

export default function NaverMaps({ locationData, data }) {
  const navigate = useNavigate();
  const { wantMyLocation, congestLevel } = useGlobalContext();
  // const [coordinates, setCoordinates] = useState([]);
  const [map, setMap] = useState(null);
  const [infowindow, setInfowindow] = useState(null);

  const navermaps = useNavermaps();
  //인구밀집도가 일정 레벨이상이 되면 밑의 sendKakaoAccessToken을 실행
  const sendKakaoAccessToken = async () => {
    //로컬 스토리지에 있는 카카오 엑세스 토큰을 요청body에 담아서
    const kakao_access_token = window.localStorage.getItem('kakaoAccessToken');
    //알림기능 미들웨어로 Post요청 전송
    await axios.post('http://localhost:4000/push', {
      kakao_access_token,
    });
  };

  //50개 지역의 마커 표시를 위한 위도, 경도 값을 로컬스토리지에서 가져와서 변수에 저장
  const point_latitude = localStorage.getItem('latitude');
  const point_longitude = localStorage.getItem('longitude');

  // react naver maps의 geolocation 사용을 위한 코드
  // useEffect안에 있는 navigator.geolocation.getCurrentPosition()의 성공콜백함수로 들어간다.
  const onSuccessGeolocation = (position) => {
    if (!map || !infowindow) return;
    //콘솔로 찍어보면 현재 위치의 위도, 경도값에 (position.coords.위도 or 경도) 형태로 접근할 수 있다.
    const location = new navermaps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    //사용자 위치를 지도 중앙에 위치시키는 코드
    map.setCenter(location);

    infowindow.setContent(
      '<div style="padding:20px;">' + '현재 사용자 위치' + '</div>'
    );
    infowindow.open(map, location);
  };

  ///50개 지역의 마커 표시를 해주는 함수
  const makeMarkerBoundary = () => {
    return locationData?.map(
      (coordinate, index) => (
        console.log(coordinate[2]),
        (
          <>
            {coordinate[2].trim() === localStorage.getItem('END_POINT') ? (
              <Circle
                center={new navermaps.LatLng(coordinate[0], coordinate[1])}
                radius={500}
                strokeColor={
                  data.AREA_CONGEST_LVL[0] === '혼잡' ? 'red' : 'green'
                }
                fillColor={
                  data.AREA_CONGEST_LVL[0] === '혼잡' ? 'red' : 'green'
                }
                fillOpacity={0.1}
              />
            ) : null}
            <Marker
              key={index}
              position={new navermaps.LatLng(coordinate[0], coordinate[1])}
              animation={navermaps.Animation.NONE}
              name={coordinate.name}
              onClick={() => {
                localStorage.setItem('END_POINT', coordinate[2].trim());
                localStorage.setItem('latitude', coordinate[0]);
                localStorage.setItem('longitude', coordinate[1]);
                window.location.reload();
              }}
            />
            <InfoWindow
              position={new navermaps.LatLng(coordinate[0], coordinate[1])}
              content={`<div>${coordinate[2]}</div>`}
            />
          </>
        )
      )
    );
  };

  useEffect(() => {
    // Papa.parse('/data/coordinates.csv', {
    //   download: true,
    //   header: true,
    //   complete: function (results) {
    //     setCoordinates(results.data);
    //   },
    // });

    if (wantMyLocation) {
      navigator.geolocation.getCurrentPosition(onSuccessGeolocation, null);
    }
  }, [wantMyLocation]);

  //여기서 부터 Dom요소 //////////
  return (
    <>
      <NaverMap
        defaultCenter={new navermaps.LatLng(point_latitude, point_longitude)}
        defaultZoom={16}
        ref={setMap}
      >
        <InfoWindow ref={setInfowindow} />
        {makeMarkerBoundary()}
      </NaverMap>
    </>
  );
}
