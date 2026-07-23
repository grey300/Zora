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

export const GenerateChapterContent_AI = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Explain the concept in Detail on Topic : Java , Chapter : Object-Oriented Programming (OOP) Principles, in JSON Format with list of array with field as title, description in detail, Code Example(Code field in <precode> format) if applicable\n",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "chapterTitle": "Object-Oriented Programming (OOP) Principles in Java",\n  "sections": [\n    {\n      "title": "Abstraction",\n      "description": "Abstraction simplifies complex systems by modeling only essential information and hiding unnecessary details.  It focuses on \'what\' an object does, rather than \'how\' it does it. In Java, this is achieved through abstract classes and interfaces. Abstract classes can have both abstract methods (without implementation) and concrete methods (with implementation). Interfaces define a contract that classes must implement.",\n      "codeExample": "<pre><code>\\n// Abstract class\\nabstract class Animal {\\n    abstract void makeSound();\\n    void eat() {\\n        System.out.println(\\"Animal is eating\\");\\n    }\\n}\\n\\n// Concrete class extending the abstract class\\nclass Dog extends Animal {\\n    @Override\\n    void makeSound() {\\n        System.out.println(\\"Woof!\\");\\n    }\\n}\\n\\n// Interface\\ninterface Flyable {\\n    void fly();\\n}\\n\\n// Class implementing an interface\\nclass Bird extends Animal implements Flyable {\\n    @Override\\n    void makeSound() {\\n        System.out.println(\\"Chirp!\\");\\n    }\\n    @Override\\n    public void fly() {\\n        System.out.println(\\"Bird is flying\\");\\n    }\\n}\\n\\npublic class Main {\\n    public static void main(String[] args) {\\n        Dog dog = new Dog();\\n        dog.makeSound(); // Woof!\\n        dog.eat(); // Animal is eating\\n\\n        Bird bird = new Bird();\\n        bird.makeSound(); // Chirp!\\n        bird.eat(); // Animal is eating\\n        bird.fly(); // Bird is flying\\n    }\\n} \\n</code></pre>"\n    },\n    {\n      "title": "Encapsulation",\n      "description": "Encapsulation bundles data (fields) and methods that operate on that data within a class, protecting the data from outside access and misuse.  It\'s achieved using access modifiers (public, private, protected). Private fields are only accessible within the class, promoting data integrity.  Public methods provide controlled access to the data.",\n      "codeExample": "<pre><code>\\npublic class Person {\\n    private String name;\\n    private int age;\\n\\n    public String getName() {\\n        return name;\\n    }\\n\\n    public void setName(String name) {\\n        this.name = name;\\n    }\\n\\n    public int getAge() {\\n        return age;\\n    }\\n\\n    public void setAge(int age) {\\n        if (age >= 0) {\\n            this.age = age;\\n        } else {\\n            System.out.println(\\"Age cannot be negative\\");\\n        }\\n    }\\n}\\n\\npublic class Main {\\n    public static void main(String[] args) {\\n        Person person = new Person();\\n        person.setName(\\"John Doe\\");\\n        person.setAge(30);\\n        System.out.println(person.getName() + \\" is \\" + person.getAge() + \\" years old.\\");\\n    }\\n} \\n</code></pre>"\n    },\n    {\n      "title": "Inheritance",\n      "description": "Inheritance allows creating new classes (derived classes or subclasses) from existing classes (base classes or superclasses). The subclass inherits the properties and methods of the superclass, and can add its own unique properties and methods or override existing ones. This promotes code reusability and establishes a hierarchical relationship between classes.",\n      "codeExample": "<pre><code>\\nclass Animal {\\n    String name;\\n    public void eat(){\\n        System.out.println(\\"Animal is eating\\");\\n    }\\n}\\n\\nclass Dog extends Animal {\\n    String breed;\\n    public void bark(){\\n        System.out.println(\\"Dog is barking\\");\\n    }\\n}\\n\\npublic class Main {\\n    public static void main(String[] args) {\\n        Dog dog = new Dog();\\n        dog.name = \\"Buddy\\";\\n        dog.breed = \\"Golden Retriever\\";\\n        dog.eat(); // Inherited from Animal\\n        dog.bark();\\n    }\\n}\\n</code></pre>"\n    },\n    {\n      "title": "Polymorphism",\n      "description": "Polymorphism allows objects of different classes to be treated as objects of a common type. This enables flexibility and extensibility.  In Java, it\'s achieved through method overriding (where a subclass provides a specific implementation for a method inherited from the superclass) and method overloading (where multiple methods in a class have the same name but different parameters).",\n      "codeExample": "<pre><code>\\nclass Animal {\\n    public void makeSound() {\\n        System.out.println(\\"Generic animal sound\\");\\n    }\\n}\\n\\nclass Dog extends Animal {\\n    @Override\\n    public void makeSound() {\\n        System.out.println(\\"Woof!\\");\\n    }\\n}\\n\\nclass Cat extends Animal {\\n    @Override\\n    public void makeSound() {\\n        System.out.println(\\"Meow!\\");\\n    }\\n}\\n\\npublic class Main {\\n    public static void main(String[] args) {\\n        Animal[] animals = {new Dog(), new Cat()};\\n        for (Animal animal : animals) {\\n            animal.makeSound();\\n        }\\n    }\\n}\\n</code></pre>"\n    }\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
