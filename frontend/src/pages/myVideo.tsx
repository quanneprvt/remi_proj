import { useCallback, useEffect, useState } from "react";
import BaseLayout from "@/app/baseLayout";
import { Card, Input, List, Modal } from "antd";
import useApi from "@/hooks/useApi";
import { useSessionProvider } from "@/providers/useSessionProvider";
import { Video } from "@/app/interfaces";
import VideoCard from "@/components/VideoCard/VideoCard";

const MyVideo = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const { getMethod } = useApi("/api/videos/me");
  const { putMethod } = useApi("/api/videos");
  const session = useSessionProvider();
  const [videoModal, setVideoModal] = useState<boolean>(false);
  const [videoData, setVideoData] = useState<{
    id: string;
    name?: string;
    link?: string;
  }>();

  const fetchVideos = useCallback(async () => {
    const result = await getMethod<Video[]>();
    result?.data && setVideos(result.data);
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
    if (session.access_token) fetchVideos();
  }, [fetchVideos, getMethod, session.access_token]);

  useEffect(() => {
    if (session.eventHandlers) {
      const eventHandler = session.eventHandlers?.find(
        (eventHandler) => eventHandler.component === "myVideo"
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
        (eventHandler) => eventHandler.component !== "myVideo"
      );
    };
  }, [fetchVideos, session, session.eventHandlers]);

  return (
    <>
      <BaseLayout onPostVideo={() => fetchVideos()}>
        <List
          dataSource={videos}
          renderItem={(item) => (
            <List.Item style={{ paddingLeft: 0 }}>
              <VideoCard item={item} onEdit={onClickEdit} />
            </List.Item>
          )}
        />
      </BaseLayout>
      <Modal
        title={"Edit Video"}
        open={videoModal}
        onOk={onEditVideo}
        onCancel={() => setVideoModal(false)}
        destroyOnClose
      >
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
        <Input
          onChange={(e) =>
            setVideoData({
              ...videoData,
              link: e.target.value as string,
            } as Video)
          }
          placeholder="Video Link"
        ></Input>
      </Modal>
    </>
  );
};

export default MyVideo;
