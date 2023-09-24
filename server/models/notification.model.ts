import mongoose, { Document, Model, Schema } from 'mongoose';

type INotification = {
  title: string;
  message: string;
  status: string;
  userId: string;
} & Document;

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'unread',
    },
    // userId: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true },
);

const NotificationModel: Model<INotification> = mongoose.model(
  'Notification',
  notificationSchema,
);

export default NotificationModel;
