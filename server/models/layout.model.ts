import mongoose, { Document, Schema } from 'mongoose';

type FaqItem = {
  question: string;
  answer: string;
} & Document;

type Category = {
  title: string;
} & Document;

type BannerImage = {
  public_id: string;
  url: string;
} & Document;

type Layout = {
  type: string;
  faq: FaqItem[];
  categories: Category[];
  banner: {
    image: BannerImage;
    title: string;
    subtitle: string;
  };
} & Document;

const faqSchema = new Schema<FaqItem>({
  question: { type: String },
  answer: { type: String },
});

const categorySchema = new Schema<Category>({
  title: { type: String },
});

const bannerImageSchema = new Schema<BannerImage>({
  public_id: { type: String },
  url: { type: String },
});

const layoutSchema = new Schema<Layout>({
  type: { type: String },
  faq: [faqSchema],
  categories: [categorySchema],
  banner: {
    image: bannerImageSchema,
    title: { type: String },
    subtitle: { type: String },
  },
});

const LayoutModel = mongoose.model<Layout>('Layout', layoutSchema);

export default LayoutModel;
