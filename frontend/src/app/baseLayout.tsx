import useApi from "@/hooks/useApi";
import useLogUser from "@/hooks/useLogUser";
import { useSessionProvider } from "@/providers/useSessionProvider";
import { Avatar, Button, Form, Input, Layout, Menu, Modal } from "antd";
import { Router, useRouter } from "next/router";
import { PropsWithChildren, useCallback, useState } from "react";
import { User, Video } from "./interfaces";

const { Content, Footer, Header } = Layout;

const menuItems = [
  { key: "video", label: "All Video", ignoreAuth: true },
  { key: "myVideo", label: "My Video" },
];

const BaseLayout = (
  props: PropsWithChildren & { onPostVideo?: () => void }
) => {
  const router = useRouter();
  const { access_token, name } = useSessionProvider();
  const [videoModal, setVideoModal] = useState<boolean>(false);
  const [videoData, setVideoData] = useState<{
    name?: string;
    link?: string;
  }>();
  const { postMethod } = useApi("/api/videos");
  const { onLogout } = useLogUser();

  const onPostVideo = useCallback(async () => {
    await postMethod<Video>({
      body: {
        video: {
          ...videoData,
        },
      },
    });
    if (props.onPostVideo) props.onPostVideo();
    setVideoModal(false);
  }, [postMethod, props, videoData]);

  const onLogin = useCallback(() => {
    router.push({ pathname: "/login" });
  }, [router]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        className="header"
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[router.asPath.split("/")[1]]}
          items={
            access_token
              ? menuItems.map((item) => ({ label: item.label, key: item.key }))
              : menuItems
                  .filter((item) => item.ignoreAuth)
                  .map((item) => ({ label: item.label, key: item.key }))
          }
          onClick={({ key }) => router.push(`/${key}`)}
          style={{ width: "100%" }}
        />
        <div
          style={{
            width: "60%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          {access_token ? (
            <>
              <Avatar style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}>
                {name?.slice(0, 1).toUpperCase()}
              </Avatar>

              <Button type="primary" onClick={() => setVideoModal(true)}>
                Share Video
              </Button>
              <Button type="primary" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={onLogin}>
              Login
            </Button>
          )}
        </div>
      </Header>
      <Content style={{ padding: "50px 50px" }}>{props.children}</Content>
      <Footer style={{ textAlign: "center", position: "sticky", bottom: 0 }}>
        Ant Design ©2023 Created by Ant UED
      </Footer>
      <Modal
        title={"Share Video"}
        open={videoModal}
        onOk={onPostVideo}
        onCancel={() => setVideoModal(false)}
        destroyOnClose
      >
        <Form>
          <Form.Item>
            <Input
              onChange={(e) =>
                setVideoData({
                  ...videoData,
                  name: e.target.value as string,
                })
              }
              placeholder="Video Name"
              style={{ marginBottom: 20 }}
            ></Input>
          </Form.Item>
          <Form.Item
            validateStatus={
              !videoData?.link ||
              new RegExp(
                /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
              ).test(videoData?.link as string)
                ? ""
                : "error"
            }
            help={
              !videoData?.link ||
              new RegExp(
                /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
              ).test(videoData?.link as string)
                ? ""
                : "Incorrect link pattern"
            }
          >
            <Input
              onChange={(e) =>
                setVideoData({
                  ...videoData,
                  link: e.target.value as string,
                })
              }
              placeholder="Video Link"
            ></Input>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default BaseLayout;
