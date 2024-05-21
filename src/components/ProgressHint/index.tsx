import { observer } from "mobx-react-lite";
import style from "./index.module.scss";
import { Flex, Progress, Typography } from "antd";
import { gstate } from "@/global";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { homeState } from "@/states/home";
import { formatSize } from "@/functions";

export const ProgressHint = observer(() => {
  const info = homeState.getProgressHintInfo();

  let rate: React.ReactNode = null;
  if (info.originSize > info.outputSize) {
    rate = (
      <Typography.Text type="success" strong>
        {info.rate}%&nbsp;
        <ArrowDownOutlined />
      </Typography.Text>
    );
  } else {
    rate = (
      <Typography.Text type="danger" strong>
        {info.rate}%&nbsp;
        <ArrowUpOutlined />
      </Typography.Text>
    );
  }

  return (
    <Flex align="center">
      <Progress
        type="circle"
        percent={info.percent}
        // strokeColor={info.percent === 100 ? token.colorPrimary : token.colorInfo}
        strokeWidth={20}
        size={14}
      />
      <div className={style.progress}>
        <Typography.Text strong type="success">
          {info.loadedNum}
        </Typography.Text>
        <Typography.Text type="secondary">
          &nbsp;/&nbsp;{info.totalNum}&nbsp;&nbsp;&nbsp;&nbsp;
        </Typography.Text>
        <Typography.Text type="secondary">
          {gstate.locale?.progress.before}：
          <Typography.Text>{formatSize(info.originSize)}</Typography.Text>
          &nbsp;&nbsp;&nbsp;&nbsp;
        </Typography.Text>
        <Typography.Text type="secondary">
          {gstate.locale?.progress.after}：
          <Typography.Text>{formatSize(info.outputSize)}</Typography.Text>
          &nbsp;&nbsp;&nbsp;&nbsp;
        </Typography.Text>
        <Typography.Text type="secondary">
          {gstate.locale?.progress.rate}：{rate}
          &nbsp;&nbsp;&nbsp;&nbsp;
        </Typography.Text>
      </div>
    </Flex>
  );
});
