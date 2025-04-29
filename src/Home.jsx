import { useState, useEffect, useRef } from "react";

const codeSnippets = [
    `print("Hello, world!")\nfor i in range(10):\n    print(i)\ndef greet(name):\n    return f"Hello, {name}"\nif x > 0 and x < 10:\n    print("Valid number")`,
    `System.out.println("Hello, World");\npublic static void main(String[] args) {\n    int x = 5;\n    if (x == 5) System.out.println("Five");\n}\nList<String> names = new ArrayList<>();`,
    `console.log("Hello, world!");\nconst sum = (a, b) => a + b;\nif (user.isLoggedIn) alert("Welcome back!");\nfor (let i = 0; i < 5; i++) console.log(i);`,
    `#include <iostream>\nint main() {\n    std::cout << "Hello, world" << std::endl;\n    return 0;\n}\nfor (int i = 0; i < 10; ++i) std::cout << 1;`,
    `echo "Hello, world!"\nfor file in *.txt; do echo $file; done\nif [ "$1" == "yes" ]; then echo "Confirmed"; fi`,
    `with open("file.txt", "r") as f:\n    lines = f.readlines()\ntry:\n    result = do_something()\nexcept Exception as e:\n    print(e)\nconst regex = /^[a-z0-9_-]{3,16}$/;\nwhile (*ptr != '\\0') ptr++;`
];

function Home() {
    const [snippet, setSnippet] = useState("");
    const [chars, setChars] = useState([]);
    const [currentIndex, setIndex] = useState(0);
    const [errors, setErrors] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [finished, setFinished] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [countdown, setCountdown] = useState(null);

    const startGame = () => {
        setGameStarted(false);
        setFinished(false);
        setErrors(0);
        setStartTime(null);
        setIndex(0);
        setCountdown(3);
      
        const countdownInterval = setInterval(() => {
          setCountdown(prev => {
            if (prev === 1) {
              clearInterval(countdownInterval);
              const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
              setSnippet(randomSnippet);
              setChars(randomSnippet.split(""));
              setGameStarted(true);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      };      

      useEffect(() => {
        function handleKeyDown(e) {
          if (!gameStarted || finished) return;
      
          if (startTime === null) {
            setStartTime(performance.now());
          }
      
          const expected = chars[currentIndex];
          let key = e.key;
          if (key === "Enter") key = "\n";
        
          if (key === expected) {
            setIndex(i => i + 1);
            if (currentIndex + 1 >= chars.length) {
              setFinished(true);
            }
          } else if (e.key === "Shift"){
            return;
          }
           else {
            setErrors(err => err + 1);
          }
        }
      
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
      }, [chars, currentIndex, finished, startTime, gameStarted]);      
    
      let stats = null;
      if (finished && startTime !== null) {
        const durationMins = (performance.now() - startTime) / 1000 / 60;
        const grossWPM    = chars.length / 5 / durationMins;
        const accuracy    = ((chars.length - errors) / chars.length) * 100;
        stats = {
          wpm: Math.round(grossWPM),
          accuracy: Math.round(accuracy),
          errors
        };
      }

      return (
        <div id="home-container">
          <h1 id="home-text">Code-Type Race</h1>
          <p className="instructions">
            KeyStroke, a nitro-type style game for coders!<br></br>
            To see other fun projects check out <strong>github.com/royce-swe</strong>
          </p>
      
            {!gameStarted && countdown === null ? (
            <button onClick={startGame}>Start</button>
            ) : countdown !== null ? (
            <h2 style={{ fontSize: "3rem", marginTop: "2rem" }}>{countdown === 0 ? "GO!" : countdown}</h2>
            ) : (
            <>
                <div id="code-text-container">
                {chars.map((char, i) => {
                    let cls =
                    i < currentIndex
                        ? "correct"
                        : i === currentIndex
                        ? "current"
                        : "upcoming";
                    return (
                    <span key={i} className={cls}>
                        {char === "\n" ? (
                        <>
                            <span className="arrow">↵</span>
                            <br />
                        </>
                        ) : (
                        char
                        )}
                    </span>
                    );
                })}
                </div>
                {finished ? (
                <>
                    <div className="finished-stats">
                    <h2>🏁 Finished!</h2>
                    <p>WPM: {stats.wpm}</p>
                    <p>Accuracy: {stats.accuracy}%</p>
                    <p>Errors: {stats.errors}</p>
                    </div>
                    <button onClick={startGame}>Restart</button>
                </>
                ) : (
                <p className="instructions">
                    Type the <strong>highlighted</strong> character next.<br></br>
                    Press <strong>enter/return</strong> at each <strong>↵</strong>.<br/>
                    Press the <strong>spacebar</strong> to add whitespace!
                </p>
                )}
            </>
            )}
        </div>
      );
    }

export default Home;
