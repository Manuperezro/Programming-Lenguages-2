/**
 * Programming Missions Lab
 * Comprehensive Dataset for Missions 1 - 8 (Gateway Level 2 Computing)
 */

window.LAB_DATA = {
  categories: {
    languages: "Languages & Syntax",
    procedural: "Procedural Flow",
    eventDriven: "Event-Driven Triggers",
    oop: "Object-Oriented Concepts",
    graphical: "Graphical Blocks",
    practical: "Practical Python IDE Coding"
  },

  // ------------------------------------------------------------------------
  // MISSION 1: PROGRAMMING LANGUAGE DETECTIVE
  // ------------------------------------------------------------------------
  mission1: {
    title: "MISSION 1 – Which Language Is It?",
    subtitle: "Discover how different programming languages tell computers to perform tasks.",
    intro: "A programming language is a way of giving instructions to a computer.",
    subintro: "Different programming languages can solve similar problems, but they write the instructions differently.",
    
    languages: [
      {
        id: "python",
        name: "PYTHON",
        icon: "🐍",
        color: "#38bdf8",
        syntaxStyle: "Easy-to-read, clean syntax",
        uses: ["Learning programming", "Automation & scripts", "Data science & AI", "Web apps & backends"],
        example: 'print("Hello")'
      },
      {
        id: "java",
        name: "JAVA",
        icon: "☕",
        color: "#f97316",
        syntaxStyle: "More structured syntax",
        uses: ["Desktop applications", "Large enterprise systems", "Android mobile apps", "Backend servers"],
        example: 'System.out.println("Hello");'
      },
      {
        id: "cpp",
        name: "C++",
        icon: "⚙️",
        color: "#a855f7",
        syntaxStyle: "Fast and high performance",
        uses: ["3D AAA video games", "Operating systems", "Game engines (Unreal)", "High-speed software"],
        example: 'cout << "Hello";'
      },
      {
        id: "php",
        name: "PHP",
        icon: "🌐",
        color: "#818cf8",
        syntaxStyle: "Web-focused scripting",
        uses: ["Server-side websites", "Dynamic web applications", "WordPress & CMS sites"],
        example: 'echo "Hello";'
      },
      {
        id: "scratch",
        name: "SCRATCH",
        icon: "🧩",
        color: "#facc15",
        syntaxStyle: "Visual drag-and-drop blocks",
        uses: ["Learning programming concepts", "Simple 2D games", "Interactive animations"],
        example: '[ say "Hello" ]'
      }
    ],

    moreLanguages: [
      { name: "Visual Basic", icon: "🔷", note: "Event-driven language for Windows desktop software." },
      { name: "Perl", icon: "🐪", note: "Scripting language renowned for text processing." }
    ],

    syntaxComparison: {
      title: "SAME JOB – DIFFERENT SYNTAX",
      task: 'DISPLAY "HELLO"',
      definition: "Syntax = the rules for writing code in a programming language.",
      examples: [
        { lang: "PYTHON", code: 'print("Hello")', highlight: 'print', accent: "#38bdf8" },
        { lang: "JAVA", code: 'System.out.println("Hello");', highlight: 'System.out.println', accent: "#f97316" },
        { lang: "C++", code: 'cout << "Hello";', highlight: 'cout', accent: "#a855f7" },
        { lang: "PHP", code: 'echo "Hello";', highlight: 'echo', accent: "#818cf8" },
        { lang: "SCRATCH", code: '[ say "Hello" ]', highlight: 'say', accent: "#facc15" }
      ],
      note: "All 5 examples are trying to do the exact same thing (show 'Hello'), but their SYNTAX is different!"
    },

    miniChallenge: {
      instruction: "Identify which language wrote each snippet:",
      items: [
        { id: "mc1", code: 'print("Welcome")', correct: "PYTHON", options: ["PYTHON", "JAVA", "PHP", "C++"] },
        { id: "mc2", code: 'echo "Welcome";', correct: "PHP", options: ["PHP", "PYTHON", "SCRATCH", "C++"] },
        { id: "mc3", code: 'System.out.println("Welcome");', correct: "JAVA", options: ["JAVA", "PYTHON", "PHP", "SCRATCH"] },
        { id: "mc4", code: 'cout << "Welcome";', correct: "C++", options: ["C++", "JAVA", "PHP", "PYTHON"] },
        { id: "mc5", code: '[ say "Welcome" ]', correct: "SCRATCH", options: ["SCRATCH", "PYTHON", "JAVA", "C++"] }
      ]
    }
  },

  // ------------------------------------------------------------------------
  // MISSION 2: REAL PROGRAM – TICKET MACHINE
  // ------------------------------------------------------------------------
  mission2: {
    title: "MISSION 2 – How Does a Real Program Work?",
    subtitle: "See how a cinema ticket machine runs code line-by-line in a logical sequence.",
    scenario: "Imagine a ticket machine at a cinema, train station or event.",
    
    codeLines: [
      { lineNum: 1, code: 'print("BRISTOL EVENT TICKETS")', type: "output", outputText: "=== BRISTOL EVENT TICKETS ===" },
      { lineNum: 2, code: 'name = input("Your name: ")', type: "input", promptText: "Enter your customer name:", defaultVal: "Alex" },
      { lineNum: 3, code: 'print("Choose a ticket")', type: "output", outputText: "Choose a ticket type:" },
      { lineNum: 4, code: 'print("1. Adult - £10")', type: "output", outputText: "1. Adult - £10" },
      { lineNum: 5, code: 'print("2. Student - £7")', type: "output", outputText: "2. Student - £7" },
      { lineNum: 6, code: 'ticket = input("Ticket choice (1 or 2): ")', type: "input", promptText: "Enter ticket number (1 or 2):", defaultVal: "2" },
      { lineNum: 7, code: 'print("Ticket created!")', type: "output", outputText: "Creating ticket..." },
      { lineNum: 8, code: 'print("Customer:", name)', type: "output", outputText: "Customer: {name}" },
      { lineNum: 9, code: 'print("Ticket:", ticket)', type: "output", outputText: "Ticket: {ticket}" }
    ],

    proceduralExplanation: {
      title: "THIS IS PROCEDURAL PROGRAMMING",
      definition: "Procedural programs follow instructions in a logical sequence from top to bottom.",
      flowSteps: [
        "STEP 1: Print Title",
        "STEP 2: Get Customer Name",
        "STEP 3: Display Ticket Prices",
        "STEP 4: Get Ticket Choice",
        "RESULT: Print Final Ticket"
      ]
    }
  },

  // ------------------------------------------------------------------------
  // MISSION 3: ROBOT INSTRUCTIONS
  // ------------------------------------------------------------------------
  mission3: {
    title: "MISSION 3 – Control the Robot",
    subtitle: "Guide the robot 🤖 to the star ⭐ and see why line order matters in procedural code!",
    gridSize: 5,
    robotStart: { r: 0, c: 0, dir: "EAST" },
    starPos: { r: 2, c: 2 },
    
    availableCommands: [
      { id: "moveForward", label: "moveForward()", icon: "⬆️", code: "moveForward()" },
      { id: "turnRight", label: "turnRight()", icon: "↪️", code: "turnRight()" },
      { id: "turnLeft", label: "turnLeft()", icon: "↩️", code: "turnLeft()" }
    ],

    defaultSequence: [
      "moveForward()",
      "moveForward()",
      "turnRight()",
      "moveForward()",
      "moveForward()"
    ],

    proceduralConcept: {
      title: "WHY DOES ORDER MATTER?",
      definition: "In procedural thinking, the computer follows instructions strictly in the order given.",
      flow: ["INSTRUCTION 1", "INSTRUCTION 2", "INSTRUCTION 3", "RESULT"]
    }
  },

  // ------------------------------------------------------------------------
  // MISSION 4: EVENT-DRIVEN PROGRAMMING
  // ------------------------------------------------------------------------
  mission4: {
    title: "MISSION 4 – Something Happens!",
    subtitle: "Discover how event-driven programs wait for user triggers like clicks or keypresses.",
    intro: "Some programs do not just run through instructions. They WAIT for something to happen.",
    flow: ["EVENT", "CODE RUNS", "RESULT"],
    
    darkModeDemo: {
      title: "DARK MODE DEMO",
      jsCode: `const button = document.querySelector("#darkMode");\n\nbutton.addEventListener("click", function() {\n    document.body.classList.toggle("dark");\n});`,
      explanation: 'Notice how the code waits for the "click" event before changing the page theme!'
    },

    miniExamples: [
      { id: "ex1", label: "JUMP 🦘", action: "jump", code: 'button.addEventListener("click", jump);', description: "Clicking button causes character to jump!" },
      { id: "ex2", label: "PRESS SPACE ⌨️", action: "space", code: 'window.addEventListener("keydown", move);', description: "Pressing Spacebar moves character right!" },
      { id: "ex3", label: "SHOW MESSAGE 💬", action: "message", code: 'button.addEventListener("click", showMessage);', description: "Clicking button pops up 'Hello!' message!" }
    ],

    conceptQuestion: {
      question: "What do all these event-driven examples have in common?",
      options: [
        "The code runs from top to bottom automatically without stopping",
        "Something happens first (user event), then the program responds",
        "All code must be written using visual Scratch blocks"
      ],
      correct: 1,
      explanation: "Event-driven programming waits for user triggers (clicks, keypresses, timers) before running specific handler functions!"
    }
  },

  // ------------------------------------------------------------------------
  // MISSION 5: GAME OBJECTS (OBJECT-ORIENTED)
  // ------------------------------------------------------------------------
  mission5: {
    title: "MISSION 5 – Game Objects",
    subtitle: "Understand how Object-Oriented Programming (OOP) groups INFORMATION (Data) and ACTIONS (Behaviour).",
    intro: "In Object-Oriented Programming, we represent real-world or game elements as OBJECTS.",
    formula: "OBJECT = DATA (Information) + BEHAVIOUR (Things it can do)",

    objects: [
      {
        name: "👤 PLAYER OBJECT",
        color: "#38bdf8",
        data: [
          { key: "Name", val: "Alex" },
          { key: "Health", val: "100" },
          { key: "Score", val: "50" }
        ],
        behaviour: ["move()", "jump()", "attack()"]
      },
      {
        name: "🚗 CAR OBJECT",
        color: "#f97316",
        data: [
          { key: "Speed", val: "60 mph" },
          { key: "Fuel", val: "80%" }
        ],
        behaviour: ["accelerate()", "brake()"]
      }
    ],

    miniSort: {
      instruction: "Sort these 4 cards into DATA (Information) or BEHAVIOUR (Actions):",
      items: [
        { id: "s1", text: "health", target: "DATA" },
        { id: "s2", text: "score", target: "DATA" },
        { id: "s3", text: "jump()", target: "BEHAVIOUR" },
        { id: "s4", text: "move()", target: "BEHAVIOUR" }
      ]
    }
  },

  // ------------------------------------------------------------------------
  // MISSION 6: GRAPHICAL PROGRAMMING
  // ------------------------------------------------------------------------
  mission6: {
    title: "MISSION 6 – Visual Code Blocks",
    subtitle: "See how graphical programming connects visual blocks instead of typing text syntax.",
    intro: "Instead of typing all the syntax, programmers can connect visual blocks together.",
    
    scratchBlocks: [
      { id: "b1", text: "WHEN GREEN FLAG CLICKED", color: "#facc15" },
      { id: "b2", text: "MOVE 10 STEPS", color: "#a855f7" },
      { id: "b3", text: "SAY 'HELLO!' FOR 2 SECS", color: "#38bdf8" },
      { id: "b4", text: "WAIT 2 SECONDS", color: "#fb923c" }
    ],

    comparison: {
      scratch: '[ say "Hello" ]',
      python: 'print("Hello")',
      difference: "Scratch snaps visual BLOCKS together, whereas Python uses typed TEXT / SYNTAX!"
    }
  },

  // ------------------------------------------------------------------------
  // MISSION 7: QUICK CHECK RECAP
  // ------------------------------------------------------------------------
  mission7: {
    title: "MISSION 7 – Quick Check",
    subtitle: "6 quick questions to test your knowledge of languages, syntax, and programming approaches!",
    questions: [
      {
        id: "q1",
        question: "1. Which programming language uses print(\"Hello\")?",
        options: ["Scratch", "Python", "Java", "PHP"],
        correct: 1,
        explanation: "Python uses clean syntax like print(\"Hello\")!"
      },
      {
        id: "q2",
        question: "2. What does SYNTAX mean in programming?",
        options: ["The rules for writing code in a language", "The computer processor speed", "The color of screen buttons"],
        correct: 0,
        explanation: "Syntax refers to the exact formatting rules, symbols, and words required by a language."
      },
      {
        id: "q3",
        question: "3. The Ticket Machine executed code line-by-line in a logical sequence. Which approach is this?",
        options: ["Event-Driven", "Procedural", "Graphical"],
        correct: 1,
        explanation: "Procedural programming runs instructions step-by-step in logical order!"
      },
      {
        id: "q4",
        question: "4. The Dark Mode button waited for a user click event before changing the page. Which approach is this?",
        options: ["Event-Driven", "Procedural", "Graphical"],
        correct: 0,
        explanation: "Event-driven programming waits for user triggers like clicks or keypresses."
      },
      {
        id: "q5",
        question: "5. A Player object combining data (health: 100) and methods (jump()) is an example of:",
        options: ["Procedural Programming", "Object-Oriented Programming (OOP)", "Graphical Programming"],
        correct: 1,
        explanation: "OOP bundles data properties and behaviour methods into Objects!"
      },
      {
        id: "q6",
        question: "6. Scratch connects visual blocks together instead of typing text syntax. Which approach is this?",
        options: ["Procedural", "Event-Driven", "Graphical / Visual"],
        correct: 2,
        explanation: "Graphical programming uses draggable visual blocks."
      }
    ]
  },

  // ------------------------------------------------------------------------
  // MISSION 8: YOUR TURN – BUILD A VENDING MACHINE
  // ------------------------------------------------------------------------
  mission8: {
    title: "MISSION 8 – Your Coding Mission: Build a Vending Machine",
    subtitle: "Open VS Code or your Python IDE on your computer and build your own Vending Machine program!",
    scenario: "You have been asked to create the software for a simple vending machine in Python.",
    
    tutorialSteps: [
      {
        stepNum: 1,
        title: "Step 1: Create File & Welcome Banner",
        instruction: "Open VS Code (or your Python IDE). Create a new file called `vending_machine.py`. Type the line below and RUN your program:",
        code: 'print("WELCOME TO THE VENDING MACHINE")',
        checkpoint: "Did the welcome message appear in your terminal?"
      },
      {
        stepNum: 2,
        title: "Step 2: Display Products",
        instruction: "Now display three items available to purchase (1. Water, 2. Cola, 3. Crisps).",
        hint1: "You already know print(\"...\"). You need three more print() instructions.",
        hint2: 'Example: print("1. Water")',
        codeSnippet: 'print("1. Water")\nprint("2. Cola")\nprint("3. Crisps")'
      },
      {
        stepNum: 3,
        title: "Step 3: Get Customer Choice",
        instruction: "Ask the customer to choose a product number using the input() function:",
        code: 'choice = input("Choose a product (1, 2, or 3): ")',
        explanation: "input() asks the user a question on screen. Choice stores their answer in a variable!"
      },
      {
        stepNum: 4,
        title: "Step 4: Display Confirmation",
        instruction: "Display a confirmation message showing what the customer selected:",
        code: 'print("You selected product number:", choice)',
        explanation: "Combining a text string with the choice variable displays their selection!"
      },
      {
        stepNum: 5,
        title: "Step 5: Personalise Your Machine!",
        instruction: "Make the program your own! Change product items and titles to create a custom machine:",
        ideas: ["🎮 GAME SHOP", "🍿 CINEMA SNACK BAR", "☕ CAFÉ DRINKS", "🚆 TRAIN TICKET KIOSK"]
      }
    ],

    extensionChallenge: {
      title: "⭐ Extension Challenge (For Early Finishers)",
      ideas: [
        '1. Add prices: print("1. Water - £1")',
        '2. Ask for customer name: name = input("Your name: ")',
        '3. Display personal greeting: print("Thank you,", name, "- Enjoy your purchase!")'
      ]
    },

    finalReflection: {
      title: "📝 Final Reflection (AC 1.1 Assessment Knowledge)",
      questions: [
        { q: "1. What programming language did you use to write your vending machine?", a: "Python (a text-based programming language)." },
        { q: "2. Give one example of Python syntax you used.", a: "Using print(...) with quotation marks \"\" and parentheses ()." },
        { q: "3. Why is your vending machine program PROCEDURAL?", a: "Because instructions execute line-by-line in a logical top-to-bottom sequence." },
        { q: "4. Why does the order of your instructions matter?", a: "Computers execute in strict sequence. Welcome banner and product menu must show BEFORE asking for input!" },
        { q: "5. What happens when input() runs in Python?", a: "The program pauses, waits for the user to type an answer, and saves it to a variable." }
      ]
    }
  }
};
