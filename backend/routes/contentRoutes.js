import express from "express";

const router = express.Router();

router.get("/testimonials", (req, res) => {
  const testimonials = [
    {
      id: 1,
      name: "Rohan K.",
      role: "Tech YouTuber",
      content:
        "A.R. Wealth & Tax Co. completely took the anxiety out of filing taxes.",
      rating: 5,
    },
    {
      id: 2,
      name: "Sneha M.",
      role: "Lifestyle Influencer",
      content: "As a freelancer, I had no idea how GST applied to PR packages.",
      rating: 5,
    },
  ];

  res.set("Cache-Control", "public, max-age=3600");
  res.status(200).json(testimonials);
});

export default router;
