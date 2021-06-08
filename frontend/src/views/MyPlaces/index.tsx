import { List, Typography, Divider, Button, Col, Row, Switch } from "antd";
import React from "react";
import data from "../../data/test.json";
interface Props {}

export const MyPlaces = (props: Props) => {
  const [showColumn, setShowColumn] = React.useState(false);
  const show = () => {
    setShowColumn(!showColumn);
  };
  // const data = [
  //   'Racing car sprays burning fuel into crowd.',
  //   'Japanese princess to wed commoner.',
  //   'Australian walks 100km after outback crash.',
  //   'Man charged over missing wedding girl.',
  //   'Los Angeles battles huge wildfires.',
  // ];
  return (
    <Row>
      <Col span={12}>
        <Divider orientation="left">Large Size</Divider>
        <List
          size="large"
          header={<div>Header</div>}
          footer={<div>Footer</div>}
          bordered
          dataSource={data}
          renderItem={(item) => (
            <List.Item
              style={{
                display: "flex",
                // flexDirection: "column",
                
              }}
            >
              <div style={{ flexDirection: "column",justifyContent: "space-around", }}>
                <p>{item.address}</p>
                <p style={{ color: 'green' }}>$5</p>

              </div>
              <div>
                <Switch defaultChecked  />
              </div>
            </List.Item>
          )}
        />
        <Button
          style={{ float: "right" }}
          onClick={() => {
            show();
          }}
        >
          Lägg till ny plats
        </Button>
      </Col>
      {showColumn ? <Col span={12}>col-12</Col> : null}
    </Row>
  );
};
