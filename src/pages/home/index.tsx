import { Button, Divider, Dropdown, Flex, Space, Typography } from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { Logo } from "@/components/Logo";
import { GithubOutlined, MenuOutlined } from "@ant-design/icons";
import { gstate } from "@/global";
import { changeLang, langList } from "@/locale";
import { homeState } from "@/states/home";
import { wait } from "@/functions";
import { UploadCard } from "@/components/UploadCard";
import { useWorkerHandler } from "@/engines/transform";
import { Compare } from "@/components/Compare";
import { useResponse } from "@/media";
import { RightOption } from "./RightOption";
import { LeftContent } from "./LeftContent";

function getCurentLangStr(): string | undefined {
  const findLang = langList.find((item) => item?.key == gstate.lang);
  return (findLang as any)?.label;
}

const Header = observer(() => {
  const { isPC } = useResponse();

  return (
    <Flex align="center" justify="space-between" className={style.header}>
      <Logo title={gstate.locale?.logo} />
      <Space>
        <Dropdown
          menu={{
            items: langList,
            selectedKeys: [gstate.lang],
            async onClick({ key }) {
              await wait(300);
              changeLang(key);
            },
          }}
        >
          <Flex className={style.locale} align="center">
            <svg viewBox="0 0 24 24" style={{ color: "currentcolor" }}>
              <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07M18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z" />
            </svg>
            <Typography.Text>{getCurentLangStr()}</Typography.Text>
          </Flex>
        </Dropdown>
        <Typography.Link
          className={style.github}
          target="_blank"
          href="https://github.com/joye61/pic-smaller"
        >
          <GithubOutlined />
        </Typography.Link>

        {/* If non-PC is determined, the menu button will be displayed */}
        {!isPC && homeState.list.size > 0 && (
          <>
            <Divider type="vertical" style={{ background: "#dfdfdf" }} />
            <Button
              icon={<MenuOutlined />}
              onClick={() => {
                homeState.showOption = !homeState.showOption;
              }}
            />
          </>
        )}
      </Space>
    </Flex>
  );
});

const Body = observer(() => {
  return (
    <Flex align="stretch" className={style.main}>
      {homeState.list.size === 0 ? (
        <UploadCard />
      ) : (
        <>
          <LeftContent />
          <RightOption />
        </>
      )}
    </Flex>
  );
});

const Home = observer(() => {
  useWorkerHandler();

  return (
    <div className={style.container}>
      <Header />
      <Body />
      {homeState.compareId !== null && <Compare />}
    </div>
  );
});

export default Home;
