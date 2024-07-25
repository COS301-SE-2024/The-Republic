import { MulterFile } from "@/lib/types";

const mockFile: MulterFile = {
  fieldname: "image",
  originalname: "profile.png",
  encoding: "7bit",
  mimetype: "image/png",
  size: 1024,
  destination: "uploads/",
  filename: "profile.png",
  path: "uploads/profile.png",
  buffer: Buffer.from(""),
};

export default mockFile;
