const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const GenerateCourseLayout_AI = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate a Course Tutorial on Following Detail With field as Course Name, Description, Along with Chapter Name, about, Duration: Category: 'Programming', Topic: Python, Level: Basic, Duration: 1 hours, NoOfChapters:5, in JSON format",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "CourseName": "Introduction to Python Programming",\n  "Description": "This course provides a basic understanding of Python programming.  It covers fundamental concepts, data types, and control flow, preparing you for more advanced Python studies.",\n  "Chapters": [\n    {\n      "ChapterName": "Getting Started with Python",\n      "About": "Setting up your Python environment, installing necessary tools, and writing your first Python program.  Introduction to the Python interpreter and basic syntax.",\n      "Duration": "15 minutes"\n    },\n    {\n      "ChapterName": "Data Types and Variables",\n      "About": "Exploring fundamental data types in Python: integers, floats, strings, booleans.  Learning about variables, assignment, and type conversions.",\n      "Duration": "20 minutes"\n    },\n    {\n      "ChapterName": "Operators and Expressions",\n      "About": "Understanding arithmetic, comparison, logical, and assignment operators.  Working with expressions and operator precedence.",\n      "Duration": "15 minutes"\n    },\n    {\n      "ChapterName": "Control Flow (if-else statements and loops)",\n      "About": "Learning about conditional statements (if, elif, else) and iterative statements (for and while loops).  Controlling the flow of execution in your programs.",\n      "Duration": "15 minutes"\n    },\n    {\n      "ChapterName": "Introduction to Functions",\n      "About": "Defining and calling functions. Understanding function parameters, return values, and scope.  Writing modular and reusable code.",\n      "Duration": "15 minutes"\n    }\n  ],\n  "Category": "Programming",\n  "Topic": "Python",\n  "Level": "Basic",\n  "TotalDuration": "1 hour",\n  "NoOfChapters": 5\n}\n```\n',
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
