const express = require("express");
const router = express.Router();
require("../db/conn");

const FAQ = require("../model/FAQSchema");

function generateUniqueId() {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const uniqueId = `${year}${month}${day}${hours}${minutes}${seconds}`;

  return uniqueId;
}

router.get("/getAllFAQs", async (req, res) => {
  try {
    const faqs = await FAQ.find({});

    return res.status(200).json(faqs);
  } catch (error) {
    res.status(500).send("Internal Server Error in FAQ");
  }
});

router.get("/getFAQbyId/:faqId", async (req, res) => {
  const faqParamId = req.params.faqId;

  try {
    const faqById = await FAQ.find({ faqID: faqParamId });

    return res.status(200).json(faqById);
  } catch (error) {
    res.status(500).send("Internal server error in FAQ");
  }
});

router.post("/createFAQ", async (req, res) => {
  const { ques, ans } = req.body;
  try {
    if (!ques || !ans) {
      return res.send("FAQ is empty!");
    }

    const newFAQData = new FAQ({
      faqID: "FAQ" + generateUniqueId(),
      question: ques,
      answer: ans,
    });

    await newFAQData.save();

    res
      .status(200)
      .json({ message: "FAQ Added Successfully", data: newFAQData });
  } catch (error) {
    res.status(500).send("Internal Server Error in FAQ");
  }
});

router.put("/updateFAQ/:faqId", async (req, res) => {
  const faqParamsId = req.params.faqId;
  // console.log(faqParamsId);
  try {
    const { ques, ans } = req.body;

    if (!ques || !ans) {
      return res
        .status(400)
        .json({ error: "question or answer field is missing" });
    }
    // console.log(faqQA);
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      { _id: faqParamsId },
      {
        question: ques,
        answer: ans,
      }
    );

    if (updatedFAQ.n === 0) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.status(200).json({ message: "FAQ updated successfully" });
  } catch (error) {
    res.status(500).send("Internal Server Error in FAQ");
  }
});

router.delete("/deleteFaq/:faqId", async (req, res) => {
  const faqParamsId = req.params.faqId;
  try {
    const deletedFaq = await FAQ.findByIdAndDelete(faqParamsId);

    if (deletedFaq.n === 0) {
      return res.status(404).json({ error: "faq not found!" });
    }

    res.status(200).json({ message: "faq deleted successfully!" });
  } catch (error) {
    res.status(500).send("Internal server error in faq");
  }
});

module.exports = router;
