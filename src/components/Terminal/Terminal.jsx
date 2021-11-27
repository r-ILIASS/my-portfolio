import React, { useState } from "react";
import "./terminal.scss";

const TerminalWindow = () => {
  const [theme, setTheme] = React.useState("dark");
  const themeVars =
    theme === "dark"
      ? {
          app: { backgroundColor: "#333444" },
          terminal: { boxShadow: "0 2px 5px #111" },
          window: { backgroundColor: "#222345", color: "#F4F4F4" },
          field: {
            backgroundColor: "#222333",
            color: "#F4F4F4",
            fontWeight: "normal",
          },
          cursor: { animation: "1.02s blink-dark step-end infinite" },
        }
      : {
          app: { backgroundColor: "#ACA9BB" },
          terminal: { boxShadow: "0 2px 5px #33333375" },
          window: { backgroundColor: "#5F5C6D", color: "#E3E3E3" },
          field: {
            backgroundColor: "#E3E3E3",
            color: "#474554",
            fontWeight: "bold",
          },
          cursor: { animation: "1.02s blink-light step-end infinite" },
        };

  return /*#__PURE__*/ React.createElement(
    "div",
    { id: "app", style: themeVars.app } /*#__PURE__*/,
    React.createElement(Terminal, { theme: themeVars, setTheme: setTheme })
  );
};
const Terminal = ({ theme, setTheme }) => {
  const [maximized, setMaximized] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const handleClose = () => console.log("closed");
  const handleMinMax = () => {
    setMaximized(!maximized);
    document.querySelector("#field").focus();
  };

  return /*#__PURE__*/ React.createElement(
    "div",
    {
      id: "terminal",
      style: maximized
        ? { height: "100vh", width: "100vw", maxWidth: "100vw" }
        : theme.terminal,
    } /*#__PURE__*/,
    React.createElement(
      "div",
      { id: "window", style: theme.window } /*#__PURE__*/,
      React.createElement("button", {
        className: "btn red",
        onClick: handleClose,
      }) /*#__PURE__*/,
      React.createElement("button", {
        id: "useless-btn",
        className: "btn yellow",
      }) /*#__PURE__*/,
      React.createElement("button", {
        className: "btn green",
        onClick: handleMinMax,
      }) /*#__PURE__*/,
      React.createElement(
        "span",
        { id: "title", style: { color: theme.window.color } },
        title
      )
    ) /*#__PURE__*/,

    React.createElement(Field, {
      theme: theme,
      setTheme: setTheme,
      setTitle: setTitle,
    })
  );
};
class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commandHistory: [],
      commandHistoryIndex: 0,
      fieldHistory: [
        { text: "Welcome To My Portfolio." },
        {},
        {
          text: "Type HELP to see the full list of commands.",
          hasBuffer: true,
        },
      ],
      userInput: "",
      isMobile: false,
    };

    this.recognizedCommands = [
      {
        command: "help",
        purpose: "Provides help information for React Terminal commands.",
      },
      {
        command: "date",
        purpose: "Displays the current date.",
      },
      {
        command: "clear",
        purpose: "Clears the screen.",
      },
      {
        command: "theme",
        purpose: "Sets the color scheme of the React Terminal.",
        help: [
          "THEME <L|LIGHT|D|DARK> [-s, -save]",
          "Sets the color scheme of the React Terminal.",
          "",
          "L, LIGHT.................Sets the color scheme to light mode.",
          "D, DARK..................Sets the color scheme to dark mode.",
          "",
          "-s, -save................Saves the setting to localStorage.",
        ],
      },
      {
        command: "time",
        purpose: "Displays the current time.",
      },
      {
        command: "about",
        isMain: true,
        purpose: "Displays basic information about Iliass.",
      },
      {
        command: "skills",
        isMain: true,
        purpose: "Displays information My skills as a developer.",
      },
      {
        command: "contact",
        isMain: true,
        purpose: "Displays information to contact me.",
      },
      {
        command: "projects",
        isMain: true,
        purpose: "Displays brief informations about my personal projects.",
      },
    ];
    this.handleTyping = this.handleTyping.bind(this);
    this.handleInputEvaluation = this.handleInputEvaluation.bind(this);
    this.handleInputExecution = this.handleInputExecution.bind(this);
  }
  componentDidMount() {
    if (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    ) {
      this.setState((state) => ({
        isMobile: true,
        fieldHistory: [
          ...state.fieldHistory,
          { isCommand: true },
          {
            text: `Unfortunately due to this application being an 'input-less' environment, mobile is not supported. I'm working on figuring out how to get around this, so please bear with me! In the meantime, come on back if you're ever on a desktop.`,
            isError: true,
            hasBuffer: true,
          },
        ],
      }));
    } else {
      const userElem = document.querySelector("#field");
      const themePref = window.localStorage.getItem("reactTerminalThemePref");

      // Disable this if you're working on a fork with auto run enabled... trust me.
      userElem.focus();

      document.querySelector("#useless-btn").addEventListener("click", () =>
        this.setState((state) => ({
          fieldHistory: [
            ...state.fieldHistory,
            { isCommand: true },
            {
              text: "SYS >> That button doesn't do anything.",
              hasBuffer: true,
            },
          ],
        }))
      );

      if (themePref) {
        this.props.setTheme(themePref);
      }
    }
  }
  componentDidUpdate() {
    const userElem = document.querySelector("#field");

    userElem.scrollTop = userElem.scrollHeight;
  }
  handleTyping(e) {
    e.preventDefault();

    const { key, ctrlKey, altKey } = e;
    const forbidden = [
      ...Array.from({ length: 12 }, (x, y) => `F${y + 1}`),
      "ContextMenu",
      "Meta",
      "NumLock",
      "Shift",
      "Control",
      "Alt",
      "CapsLock",
      "Tab",
      "ScrollLock",
      "Pause",
      "Insert",
      "Home",
      "PageUp",
      "Delete",
      "End",
      "PageDown",
    ];

    if (!forbidden.some((s) => s === key) && !ctrlKey && !altKey) {
      if (key === "Backspace") {
        this.setState(
          (state) => (state.userInput = state.userInput.slice(0, -1))
        );
      } else if (key === "Escape") {
        this.setState({ userInput: "" });
      } else if (key === "ArrowUp" || key === "ArrowLeft") {
        const { commandHistory, commandHistoryIndex } = this.state;
        const upperLimit = commandHistoryIndex >= commandHistory.length;

        if (!upperLimit) {
          this.setState((state) => ({
            commandHistoryIndex: (state.commandHistoryIndex += 1),
            userInput: state.commandHistory[state.commandHistoryIndex - 1],
          }));
        }
      } else if (key === "ArrowDown" || key === "ArrowRight") {
        const { commandHistory, commandHistoryIndex } = this.state;
        const lowerLimit = commandHistoryIndex === 0;

        if (!lowerLimit) {
          this.setState((state) => ({
            commandHistoryIndex: (state.commandHistoryIndex -= 1),
            userInput:
              state.commandHistory[state.commandHistoryIndex - 1] || "",
          }));
        }
      } else if (key === "Enter") {
        const { userInput } = this.state;

        if (userInput.length) {
          this.setState(
            (state) => ({
              commandHistory:
                userInput === ""
                  ? state.commandHistory
                  : [userInput, ...state.commandHistory],
              commandHistoryIndex: 0,
              fieldHistory: [
                ...state.fieldHistory,
                { text: userInput, isCommand: true },
              ],
              userInput: "",
            }),
            () => this.handleInputEvaluation(userInput)
          );
        } else {
          this.setState((state) => ({
            fieldHistory: [...state.fieldHistory, { isCommand: true }],
          }));
        }
      } else {
        this.setState((state) => ({
          commandHistoryIndex: 0,
          userInput: (state.userInput += key),
        }));
      }
    }
  }
  handleInputEvaluation(input) {
    try {
      const evaluatedForArithmetic = Math.evaluate(input);

      if (!isNaN(evaluatedForArithmetic)) {
        return this.setState((state) => ({
          fieldHistory: [
            ...state.fieldHistory,
            { text: evaluatedForArithmetic },
          ],
        }));
      }

      throw Error;
    } catch (err) {
      const { recognizedCommands, giveError, handleInputExecution } = this;
      const cleanedInput = input.toLowerCase().trim();
      const dividedInput = cleanedInput.split(" ");
      const parsedCmd = dividedInput[0];
      const parsedParams = dividedInput.slice(1).filter((s) => s[0] !== "-");
      const parsedFlags = dividedInput.slice(1).filter((s) => s[0] === "-");
      const isError = !recognizedCommands.some((s) => s.command === parsedCmd);

      if (isError) {
        return this.setState((state) => ({
          fieldHistory: [...state.fieldHistory, giveError("nr", input)],
        }));
      }

      return handleInputExecution(parsedCmd, parsedParams, parsedFlags);
    }
  }
  handleInputExecution(cmd, params = [], flags = []) {
    if (cmd === "help") {
      if (params.length) {
        if (params.length > 1) {
          return this.setState((state) => ({
            fieldHistory: [
              ...state.fieldHistory,
              this.giveError("bp", { cmd: "HELP", noAccepted: 1 }),
            ],
          }));
        }

        const cmdsWithHelp = this.recognizedCommands.filter((s) => s.help);

        if (cmdsWithHelp.filter((s) => s.command === params[0]).length) {
          return this.setState((state) => ({
            fieldHistory: [
              ...state.fieldHistory,
              {
                text: cmdsWithHelp.filter((s) => s.command === params[0])[0]
                  .help,
                hasBuffer: true,
              },
            ],
          }));
        } else if (
          this.recognizedCommands.filter((s) => s.command === params[0]).length
        ) {
          return this.setState((state) => ({
            fieldHistory: [
              ...state.fieldHistory,
              {
                text: [
                  `No additional help needed for ${this.recognizedCommands
                    .filter((s) => s.command === params[0])[0]
                    .command.toUpperCase()}`,
                  this.recognizedCommands.filter(
                    (s) => s.command === params[0]
                  )[0].purpose,
                ],

                hasBuffer: true,
              },
            ],
          }));
        }

        return this.setState((state) => ({
          fieldHistory: [
            ...state.fieldHistory,
            this.giveError("up", params[0].toUpperCase()),
          ],
        }));
      }

      return this.setState((state) => ({
        fieldHistory: [
          ...state.fieldHistory,
          {
            text: [
              "Main commands:",
              ...this.recognizedCommands
                .sort((a, b) => a.command.localeCompare(b.command))
                .filter(({ isMain }) => isMain)
                .map(
                  ({ command, purpose }) =>
                    `${command.toUpperCase()}${Array.from(
                      { length: 15 - command.length },
                      (x) => "."
                    ).join("")}${purpose}`
                ),
              "",
              "All commands:",
              ...this.recognizedCommands
                .sort((a, b) => a.command.localeCompare(b.command))
                .map(
                  ({ command, purpose }) =>
                    `${command.toUpperCase()}${Array.from(
                      { length: 15 - command.length },
                      (x) => "."
                    ).join("")}${purpose}`
                ),
              "",
              "For help about a specific command, type HELP <CMD>, e.g. HELP PROJECT.",
            ],

            hasBuffer: true,
          },
        ],
      }));
    } else if (cmd === "clear") {
      return this.setState({ fieldHistory: [] });
    } else if (cmd === "date") {
      return this.setState((state) => ({
        fieldHistory: [
          ...state.fieldHistory,
          {
            text: `The current date is: ${new Date(
              Date.now()
            ).toLocaleDateString()}`,
            hasBuffer: true,
          },
        ],
      }));
    } else if (cmd === "theme") {
      const { setTheme } = this.props;
      const validParams =
        params.length === 1 &&
        ["d", "dark", "l", "light"].some((s) => s === params[0]);
      const validFlags = flags.length
        ? flags.length === 1 && (flags[0] === "-s" || flags[0] === "-save")
          ? true
          : false
        : true;

      if (validParams && validFlags) {
        const themeToSet =
          params[0] === "d" || params[0] === "dark" ? "dark" : "light";

        return this.setState(
          (state) => ({
            fieldHistory: [
              ...state.fieldHistory,
              {
                text: `Set the theme to ${themeToSet.toUpperCase()} mode`,
                hasBuffer: true,
              },
            ],
          }),
          () => {
            if (
              flags.length === 1 &&
              (flags[0] === "-s" || flags[0] === "-save")
            ) {
              window.localStorage.setItem("reactTerminalThemePref", themeToSet);
            }

            setTheme(themeToSet);
          }
        );
      }

      return this.setState((state) => ({
        fieldHistory: [
          ...state.fieldHistory,
          this.giveError(
            !validParams ? "bp" : "bf",
            !validParams ? { cmd: "THEME", noAccepted: 1 } : "THEME"
          ),
        ],
      }));
    } else if (cmd === "time") {
      return this.setState((state) => ({
        fieldHistory: [
          ...state.fieldHistory,
          {
            text: `The current time is: ${new Date(
              Date.now()
            ).toLocaleTimeString()}`,
            hasBuffer: true,
          },
        ],
      }));
    } else if (cmd === "about") {
      return this.setState((state) => ({
        fieldHistory: [
          ...state.fieldHistory,
          {
            text: [
              "Hey there!",
              `My name is Iliass. I'm a Computer Engineering graduate and a self-taught web developer, I fell in love with the JavaScript ecosystem, still! I am language agnostic. I love spending my days coding and expanding my range of skills!`,
              `Type CONTACT if you'd like to get in touch!`,
            ],
            hasBuffer: true,
          },
        ],
      }));
    } else if (cmd === "skills") {
      return this.setState((state) => ({
        fieldHistory: [
          ...state.fieldHistory,
          {
            text: [
              "Languages:",
              "HTML",
              "CSS",
              "JavaScript",
              "",
              "Libraries/Frameworks:",
              "React",
              "Scss",
              "Bootstrap",
              "TailwindCss",
              "",

              "Libraries/Frameworks I am familiar with:",
              "NodeJs",
              "NextJs",
              "MaterialUi",

              "",
              "Other:",
              "Git",
              "GitHub",
              "Gitkraken",
              "GitLens",
              "Figma",
              "Heroku",
              "",
            ],
            hasBuffer: true,
          },
        ],
      }));
    } else if (cmd === "contact") {
      return this.setState((state) => ({
        fieldHistory: [
          ...state.fieldHistory,
          {
            text: [
              "Email: iliass.root@gmail.com",
              "GitHub: https://github.com/r-ILIASS",
              "PhoneNumber: +212689444004",
            ],
            hasBuffer: true,
          },
        ],
      }));
    } else if (cmd === "projects") {
      return this.setState((state) => ({
        fieldHistory: [
          ...state.fieldHistory,
          {
            text: [
              "Minesweeper",
              "Built with React",
              `Some time ago I became increasingly addicted to minesweeper, specifically the version offered by Google. In fact, I was so addicted that I decided to build the damn thing.`,
              "",
              "PuniUrl",
              "Built with Express, Firebase",
              "Ever heard of TinyUrl? Ever been to their website? Atrocious. So I made my own version of it.",
              "",
            ],
            hasBuffer: true,
          },
        ],
      }));
    }
  }
  giveError(type, extra) {
    const err = { text: "", isError: true, hasBuffer: true };

    if (type === "nr") {
      err.text = `${extra} : The term or expression '${extra}' is not recognized. Check the spelling and try again. If you don't know what commands are recognized, type HELP.`;
    } else if (type === "nf") {
      err.text = `The ${extra} command requires the use of flags. If you don't know what flags can be used, type HELP ${extra}.`;
    } else if (type === "bf") {
      err.text = `The flags you provided for ${extra} are not valid. If you don't know what flags can be used, type HELP ${extra}.`;
    } else if (type === "bp") {
      err.text = `The ${extra.cmd} command requires ${extra.noAccepted} parameter(s). If you don't know what parameter(s) to use, type HELP ${extra.cmd}.`;
    } else if (type === "up") {
      err.text = `The command ${extra} is not supported by the HELP utility.`;
    }

    return err;
  }
  render() {
    const { theme } = this.props;
    const { fieldHistory, userInput } = this.state;

    return /*#__PURE__*/ React.createElement(
      "div",
      {
        id: "field",
        className: theme.app.backgroundColor === "#333444" ? "dark" : "light",
        style: theme.field,
        onKeyDown: (e) => this.handleTyping(e),
        tabIndex: 0,
      },

      fieldHistory.map(({ text, isCommand, isError, hasBuffer }) => {
        if (Array.isArray(text)) {
          return /*#__PURE__*/ React.createElement(MultiText, {
            input: text,
            isError: isError,
            hasBuffer: hasBuffer,
          });
        }

        return /*#__PURE__*/ React.createElement(Text, {
          input: text,
          isCommand: isCommand,
          isError: isError,
          hasBuffer: hasBuffer,
        });
      }) /*#__PURE__*/,
      React.createElement(UserText, { input: userInput, theme: theme.cursor })
    );
  }
}

const Text = ({ input, isCommand, isError, hasBuffer }) =>
  /*#__PURE__*/ React.createElement(
    React.Fragment,
    null /*#__PURE__*/,
    React.createElement(
      "div",
      null,
      isCommand &&
        /*#__PURE__*/ React.createElement(
          "div",
          { id: "query" },
          "><>"
        ) /*#__PURE__*/,
      React.createElement(
        "span",
        { className: !isCommand && isError ? "error" : "" },
        input
      )
    ),

    hasBuffer && /*#__PURE__*/ React.createElement("div", null)
  );

const MultiText = ({ input, isError, hasBuffer }) =>
  /*#__PURE__*/ React.createElement(
    React.Fragment,
    null,
    input.map((s) =>
      /*#__PURE__*/ React.createElement(Text, { input: s, isError: isError })
    ),
    hasBuffer && /*#__PURE__*/ React.createElement("div", null)
  );

const UserText = ({ input, theme }) =>
  /*#__PURE__*/ React.createElement(
    "div",
    null /*#__PURE__*/,
    React.createElement("div", { id: "query" }, "><>") /*#__PURE__*/,
    React.createElement("span", null, input) /*#__PURE__*/,
    React.createElement("div", { id: "cursor", style: theme })
  );

export default TerminalWindow;
