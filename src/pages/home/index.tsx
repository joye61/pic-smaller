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
            {/* <svg viewBox="0 0 24 24" style={{ color: "currentcolor" }}>
              <path d="M12.87,15.07L10.33,12.56L10.36,12.53C12.1,10.59 13.34,8.36 14.07,6H17V4H10V2H8V4H1V6H12.17C11.5,7.92 10.44,9.75 9,11.35C8.07,10.32 7.3,9.19 6.69,8H4.69C5.42,9.63 6.42,11.17 7.67,12.56L2.58,17.58L4,19L9,14L12.11,17.11L12.87,15.07M18.5,10H16.5L12,22H14L15.12,19H19.87L21,22H23L18.5,10M15.88,17L17.5,12.67L19.12,17H15.88Z" />
            </svg> */}

            <svg viewBox="0 0 1024 1024" style={{ color: "currentcolor" }}>
              <path d="M640 416h256c35.36 0 64 28.48 64 64v416c0 35.36-28.48 64-64 64H480c-35.36 0-64-28.48-64-64V640h128c53.312 0 96-42.976 96-96V416zM64 128c0-35.36 28.48-64 64-64h416c35.36 0 64 28.48 64 64v416c0 35.36-28.48 64-64 64H128c-35.36 0-64-28.48-64-64V128z m128 276.256h46.72v-24.768h67.392V497.76h49.504V379.488h68.768v20.64h50.88V243.36H355.616v-34.368c0-10.08 1.376-18.784 4.16-26.112a10.56 10.56 0 0 0 1.344-4.16c0-0.896-3.2-1.792-9.6-2.72h-46.816v67.36H192v160.896z m46.72-122.368h67.392v60.48h-67.36V281.92z m185.664 60.48h-68.768V281.92h68.768v60.48z m203.84 488l19.264-53.632h100.384l19.264 53.632h54.976L732.736 576h-64.64L576 830.4h52.256z m33.024-96.256l37.12-108.608h1.376l34.368 108.608h-72.864zM896 320h-64a128 128 0 0 0-128-128v-64a192 192 0 0 1 192 192zM128 704h64a128 128 0 0 0 128 128v64a192 192 0 0 1-192-192z" />
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
      {homeState.list.size === 0 ? <UploadCard /> : <LeftContent />}
      <RightOption />
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
