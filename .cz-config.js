module.exports = {
  types: [
    {
      value: "wip",
      name: "💪  wip:      正在进行",
    },
    {
      value: "feat",
      name: "✨  feat:     新的内容",
    },
    {
      value: "fix",
      name: "🐞  fix:      修复一个Bug",
    },
    {
      value: "refactor",
      name: "🛠  refactor:  代码重构，注意和特性、修复区分开q2e",
    },
    {
      value: "docs",
      name: "📚  docs:     文档修改",
    },
    {
      value: "test",
      name: "🏁  test:     添加一个测试用例",
    },
    {
      value: "chore",
      name: "🗯  chore:     不修改src或测试文件的更改。例如更新生成任务、包管理器",
    },
    {
      value: "style",
      name: "💅  style:    代码样式，不影响代码含义的更改（空白、格式、缺少分号等）",
    },
    {
      value: "css",
      name: "💅  css:      css样式修改",
    },
    {
      value: "revert",
      name: "⏪  revert:   版本回退",
    },
    {
      value: "review",
      name: "    codeReview:   代码审查",
    },
  ],
  messages: {
    type: "选择一种你的提交类型:",
    scope: "选择一个scope (可选):",
    // used if allowCustomScopes is true
    customScope: "Denote the SCOPE of this change:",
    subject: "短说明(必填):\n",
    body: '长说明，使用"|"换行(可选)：\n',
    breaking: "非兼容性说明 (可选):\n",
    footer: "关联关闭的issue，例如：#31, #34(可选):\n",
    confirmCommit: "确定提交说明?(yes/no)",
  },
  scopes: [{ name: "" }],
  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"],
  skipQuestions: ["footer"],
};
