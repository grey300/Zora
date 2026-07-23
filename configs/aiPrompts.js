// Few-shot histories for the AI generators. Server-only data (no secrets),
// consumed by app/api/ai/route.js.

export const COURSE_HISTORY = [
  {
    role: "user",
    content:
      "Generate a Course Tutorial on Following Detail With field as Course Name, Description, Along with Chapter Name, about, Duration: Category: 'Programming', Topic: Python, Level: Basic, Duration: 1 hours, NoOfChapters:5, in JSON format",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      CourseName: "Introduction to Python Programming",
      Description:
        "This course provides a basic understanding of Python programming. It covers fundamental concepts, data types, and control flow.",
      Chapters: [
        {
          ChapterName: "Getting Started with Python",
          About:
            "Setting up your Python environment and writing your first program.",
          Duration: "15 minutes",
        },
        {
          ChapterName: "Data Types and Variables",
          About: "Exploring integers, floats, strings, booleans and variables.",
          Duration: "20 minutes",
        },
        {
          ChapterName: "Control Flow",
          About: "Conditional statements and for/while loops.",
          Duration: "15 minutes",
        },
      ],
      Category: "Programming",
      Topic: "Python",
      Level: "Basic",
      TotalDuration: "1 hour",
      NoOfChapters: 5,
    }),
  },
];

export const CHAPTER_HISTORY = [
  {
    role: "user",
    content:
      "Explain the concept in Detail on Topic : Java , Chapter : Object-Oriented Programming (OOP) Principles, in JSON Format with list of array with field as title, description in detail, Code Example(Code field in <precode> format) if applicable",
  },
  {
    role: "assistant",
    content: JSON.stringify({
      chapterTitle: "Object-Oriented Programming (OOP) Principles in Java",
      sections: [
        {
          title: "Encapsulation",
          description:
            "Encapsulation bundles data and methods within a class, protecting data from outside access using access modifiers (public, private, protected).",
          codeExample:
            "<pre><code>public class Person {\n  private String name;\n  public String getName() { return name; }\n  public void setName(String name) { this.name = name; }\n}</code></pre>",
        },
      ],
    }),
  },
];

export const QUIZ_HISTORY = [
  {
    role: "user",
    content:
      "Generate a set of challenging multiple-choice questions about Java. Provide the question, correct answer, and four options (each with a maximum of 15 words) in a JSON array.",
  },
  {
    role: "assistant",
    content: JSON.stringify([
      {
        question:
          "Which statement best describes the purpose of a Java interface?",
        correct_answer: "Defines a contract for classes to implement.",
        options: [
          "Creates objects.",
          "Inherits from classes.",
          "Defines a contract for classes to implement.",
          "Represents concrete implementations.",
        ],
      },
      {
        question: "Which keyword prevents a method from being overridden?",
        correct_answer: "final",
        options: ["static", "abstract", "final", "private"],
      },
    ]),
  },
];
