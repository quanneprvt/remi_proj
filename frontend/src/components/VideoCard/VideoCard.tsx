import React from "react";
import { Button, Card } from "antd";
import { useSessionProvider } from "@/providers/useSessionProvider";
import { Video } from "@/app/interfaces";

interface ItemCardProps {
  item: Video;
  onEdit?: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit }) => {
  const session = useSessionProvider();

  return (
    <Card
      title={item.name}
      style={{ width: "100%" }}
      actions={
        session.access_token && session.id === item.createdBy.id
          ? [
              <Button
                key="Edit"
                type="primary"
                style={{ width: "50%" }}
                onClick={() => onEdit && onEdit(item._id)}
              >
                Edit
              </Button>,
            ]
          : []
      }
    >
      <p>Link: {item.link}</p>
      <p>Created By: {item.createdBy.name}</p>
    </Card>
  );
};

export default ItemCard;
