import { Form, Input, Slider, theme } from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";

export const CompressOption = observer(() => {
  const { token } = theme.useToken();

  return (
    <div className={style.container}>
      <Form layout="vertical">
        <Form.Item label="缩放到指定宽度" name="width">
          <Input allowClear placeholder="指定宽度，高度等比缩放" suffix="px" />
        </Form.Item>
        <Form.Item label="调整压缩质量(0-100)" name="width">
          <div
            style={{
              borderRadius: token.borderRadius,
            }}
            className={style.sliderBox}
          >
            <Slider defaultValue={70} />
          </div>
        </Form.Item>
      </Form>
    </div>
  );
});
