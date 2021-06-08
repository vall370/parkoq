import { useState, useEffect } from "react";
import axios from "axios";
import { User } from "./interfaces";
import { Button,Divider,Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import FavoritesMap from './views/Map/FavoritesMap'
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useLocation
} from "react-router-dom";
import { FindParking } from "./views/FindParking";
import { MyEconomy } from "./views/MyEconomy";
import { MyVehicles } from "./views/MyVehicles";
import { OurTerms } from "./views/OurTerms";
import { MyPlaces } from "./views/MyPlaces";
import { VisitOurPage } from "./views/VisitOurPage";
const { Header, Content, Footer, Sider } = Layout;

function App() {
  const [me, setMe] = useState<User>();
  let location = useLocation();
  console.log(location.pathname);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            //If granted then you can directly call your function here
          } else if (result.state === "prompt") {
            console.log(result.state);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
    } else {
      alert("Sorry Not available!");
    }
    async function getMe() {
      await axios
        .get("http://localhost:4000/auth/me", {
          withCredentials: true,
        })
        .then((res) => setMe(res.data));
    }

    getMe();
  }, []);

  if (me) {
    return (
      <Layout style={{height: 'auto'}}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        style={{backgroundColor: '#143D59'}}
      >
        <div className="logo" />
        <Menu mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/findplaces" icon={<UserOutlined />}>
          <Link to="/findplaces">Hitta P-plats</Link>
          </Menu.Item>
          <Menu.Item key="/myplaces" icon={<VideoCameraOutlined />}>
          <Link to="/myplaces">Hyr ut din P-plats</Link>
          </Menu.Item>
          <Menu.Item key="/myvehicles" icon={<UploadOutlined />}>
          <Link to="/myvehicles">Mina fordon</Link>
          </Menu.Item>
          <Menu.Item key="/myeconomy" icon={<UserOutlined />}>
          <Link to="/myeconomy">Min ekonomi</Link>
          </Menu.Item>
          <Divider />
          <Menu.Item key="/terms" icon={<UserOutlined />}>
          <Link to="/terms">Villkor</Link>
          </Menu.Item>
          <Menu.Item key="/visitourwebpage" icon={<VideoCameraOutlined />}>
          <Link to="/visitourwebpage">Besök våran hemsida</Link>
          </Menu.Item>
          <Menu.Item key="/referafriend" icon={<UploadOutlined />}>
          <Link to="/referafriend">Bjud in en kompis</Link>
          </Menu.Item>
          <Menu.Item key="/aboutus" icon={<UserOutlined />}>
          <Link to="/aboutus">Om oss</Link>
          </Menu.Item>
          <Menu.Item key="/logout" icon={<UserOutlined />}>
          <Link to="/logout">Logga ut</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{height: 'auto'}}>
        <Content style={{backgroundColor: 'white',height: 'auto', margin: '0 0 0' }}>
        <Switch>
          <Route path="/findplaces">
            <FavoritesMap />
          </Route>
          <Route path="/users">
            <FindParking/>
          </Route>
          <Route path="/myeconomy">
            <MyEconomy />
          </Route>
          <Route path="/myvehicles">
            <MyVehicles/>
          </Route>
          <Route path="/terms">
            <OurTerms />
          </Route>
          <Route path="/myplaces">
            <MyPlaces/>
          </Route>
          <Route path="/visitourwebpage">
            <VisitOurPage />
          </Route>
        </Switch>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
      )
  }
  return (
    <div className="App">
          <Button href="https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Fgoogle&client_id=122380427496-ae1uid9bg25skmhvk65o9h391ftgqmvg.apps.googleusercontent.com&access_type=offline&response_type=code&prompt=consent&display=popup&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email" type="primary">Button</Button>

      <a href="https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Fgoogle&client_id=122380427496-ae1uid9bg25skmhvk65o9h391ftgqmvg.apps.googleusercontent.com&access_type=offline&response_type=code&prompt=consent&display=popup&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email">
        LOGIN WITH GOOGLE
      </a>
      <a href="https://www.facebook.com/v10.0/dialog/oauth?redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Ffacebook&client_id=766122917398035&state=%7Bst%3Dstate123abc%2Cds%3D123456789%7D&scope=email&scope=public_profile">
        LOGIN WITH FACEBOOK
      </a>
    </div>
  );
}

export default App;
