import inq from "inquirer";
import moment from "moment";
import fs from "fs";

const questions = [
  {
    type: "input",
    name: "id",
    message: "id(english):",
    required: true,
  },
  {
    type: "input",
    name: "title",
    message: "title(chinese):",
    required: true,
  },
  {
    type: "input",
    name: "tags",
    message: "tags(seperated by ,):",
    required: true,
  },
  {
    type: "input",
    name: "categories",
    message: "categories(seperated by ,):",
    default: "实用",
    required: true,
  },
  {
    type: "input",
    name: "description",
    message: "description(seperated by ,):",
    required: true,
  },
];

function handleAnswers(answers) {
  const filename = `${moment().format("YYYY-MM-DD")}-${answers.id}.md`;

  const content = `---
title: ${answers.title}
date: ${moment().format("YYYY-MM-DD HH:mm:ss")}
tags:
${answers.tags
  .split(",")
  .map((tag) => "  - " + tag)
  .join("\n")}
categories:
${answers.categories
  .split(",")
  .map((tag) => "  - " + tag)
  .join("\n")}
---

${answers.description}

<!--more-->

`;

  fs.writeFileSync(`./source/_posts/${filename}`, content);
}
inq.prompt(questions).then(handleAnswers);
