import { Form, Input, Button, Radio, Space, Col, Row } from "antd";
import React from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import TimePicker from "../../components/TimePicker";
import DatePicker from "../../components/DatePicker";
const { RangePicker } = DatePicker;

interface Props {
  basemap: string | number | readonly string[] | undefined;
}
type LayoutType = Parameters<typeof Form>[0]["layout"];

export const Overlay = (props: Props) => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = React.useState<LayoutType>("vertical");
  function onChange1(dates: any, dateStrings: any) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
  }
  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const formItemLayout =
    formLayout === "horizontal"
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }
      : {
          labelCol: { span: 20 },
          wrapperCol: { span: 20 },
        };

  const buttonItemLayout =
    formLayout === "horizontal"
      ? {
          wrapperCol: { span: 14, offset: 4 },
        }
      : {
          wrapperCol: { span: 14, offset: 4 },
        };
  const size = "large";
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };
  return (
    <div className="basemaps-container">
      <Form>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Form.Item
              label="Från"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 40 }}
            >
    <RangePicker
      ranges={{
        Today: [dayjs(), dayjs()],
        'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
      }}
      showTime
      format="YYYY-MM-DD HH:mm"
      onChange={onChange1}
      size="large"
    />
            </Form.Item>
          </Col>
          {/* <Col span={6}>
            <Form.Item
              label="Från"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <TimePicker
                format="HH:mm"
                defaultValue={dayjs("12:08", "HH:mm")}
                size="large"
              />
            </Form.Item>
          </Col> */}
          <Col span={10}>
            <Form.Item
              label="I närheten av"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 20 }}
            >
              <Input size="large" placeholder="asdasd" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
