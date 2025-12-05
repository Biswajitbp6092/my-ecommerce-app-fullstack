import mongoose from "mongoose";
const homeSliderSchema = mongoose.Schema(
  {
    images: [
      {
        type: String,
        required: true,
      },
    ],
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const HomeSliderModel = mongoose.model("homeSlider", homeSliderSchema);

export default HomeSliderModel;
