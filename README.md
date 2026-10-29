# SULIN — 苏林的创意空间

个人前端学习与创意作品集，部署在 https://sulin1122.github.io/ 。使用原生 HTML、CSS 和 JavaScript，无需安装依赖或运行构建命令。

## 页面与文件

- `index.html`：个人作品集首页。
- `style.css`、`myScript.js`：首页版式、环形作品墙、作品筛选、项目弹窗、技能切换与动画控制。
- `1.html`、`todo.css`、`todo.js`：待办清单，支持任务分类、搜索、完成状态筛选、编辑、本地保存及撤销删除。
- `images/creative-hero.png`：原创男生 3D 概念主视觉。
- `images/portfolio-preview.png`、`images/todo-preview.png`：新版页面的浏览器截图；待办预览使用演示任务。
- `images/portfolio-social.png`：分享预览图。
- `robots.txt`、`sitemap.xml`、`sitemap.txt`：爬取规则与站点地图。
- `ASSETS.md`：视觉素材说明及生成提示词。

## 本地预览

在项目目录运行已安装的 Python：

```sh
python -m http.server 4174 --bind 127.0.0.1
```

然后访问 http://127.0.0.1:4174/ 。也可以使用 VS Code 的 Live Server / Live Preview。

## 修改与发布

修改 `index.html` 中的文字、作品入口和联系链接；修改 `myScript.js` 中的 `cases` 对象可调整项目详情。公开内容发生实际更新时，同步修改 `sitemap.xml` 的 `lastmod` 日期。

将相关文件提交到本仓库 `main` 分支，沿用现有 GitHub Pages 发布配置。请勿删除 Google 验证 HTML 文件。

## 交互与数据

首页可暂停动态，并跟随系统的“减少动态效果”设置；手机作品墙改为横向滑动。所有作品入口、弹窗与技能选项均可用键盘操作。

待办任务只保存在当前浏览器的 `localStorage` 中（键名 `sulin.tasks.v2`），没有上传服务器，也不提供跨设备同步。删除任务或清理已完成任务后，12 秒内可以撤销。

## 验证

改版发布前检查了桌面与手机布局、作品筛选、弹窗焦点、技能键盘操作、动效偏好保存、任务增删改查、筛选、本地持久化与输入文本安全。预览图中的任务是演示内容，访客首次使用时从空清单开始。
