import { useCallback, useEffect, useState } from "react";
import BaseLayout from "@/app/baseLayout";
import { SocketMessage, Video } from "@/app/interfaces";
import useApi from "@/hooks/useApi";
import { useSessionProvider } from "@/providers/useSessionProvider";
import { Form, Input, List, Modal } from "antd";
import VideoCard from "@/components/VideoCard/VideoCard";

const Video = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const { getMethod, putMethod } = useApi("/api/videos");
  const [videoModal, setVideoModal] = useState<boolean>(false);
  const session = useSessionProvider();
  const [videoData, setVideoData] = useState<{
    id: string;
    name?: string;
    link?: string;
  }>();

  const fetchVideos = useCallback(async () => {
    const result = await getMethod<Video[]>({
      ignoreAuth: true,
      ignoreRefresh: true,
    });
    result?.data && !(result.data as any)?.messages && setVideos(result.data);
  }, [getMethod]);

  const onClickEdit = useCallback((id: string) => {
    setVideoData({
      id,
    });
    setVideoModal(true);
  }, []);

  const onEditVideo = useCallback(async () => {
    await putMethod<Video>({
      body: {
        video: { ...videoData },
      },
    });
    setVideoModal(false);
    fetchVideos();
  }, [fetchVideos, putMethod, videoData]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos, getMethod]);

  useEffect(() => {
    if (session.eventHandlers) {
      const eventHandler = session.eventHandlers?.find(
        (eventHandler) => eventHandler.component === "video"
      );
      if (!eventHandler)
        session.eventHandlers.push({
          component: "video",
          handler: () => {
            fetchVideos();
          },
        });
    }
    return () => {
      session.eventHandlers = session.eventHandlers?.filter(
        (eventHandler) => eventHandler.component !== "video"
      );
    };
  }, [fetchVideos, session, session.eventHandlers]);

  return (
    <>
      <BaseLayout onPostVideo={() => fetchVideos()}>
        <div>There are currently {videos?.length || 0} video(s)</div>
        <List
          dataSource={videos}
          renderItem={(item) => (
            <List.Item style={{ paddingLeft: 0 }}>
              <VideoCard item={item} onEdit={onClickEdit} />
            </List.Item>
          )}
        />
        {session.access_token && (
          <div>
            You can go to click on Share Video at top right corner to create new
            share video
          </div>
        )}
      </BaseLayout>
      <Modal
        title={"Edit Video"}
        open={videoModal}
        onOk={onEditVideo}
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
                } as Video)
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
                } as Video)
              }
              placeholder="Video Link"
            ></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Video;
