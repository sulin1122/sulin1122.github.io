# SULIN — 苏林的创意空间

个人前端学习与创意作品集，部署在 https://sulin1122.github.io/ 。使用原生 HTML、CSS 和 JavaScript，无需安装依赖或运行构建命令。

## 页面与文件

- `index.html`：个人作品集首页。
- `style.css`、`myScript.js`：首页版式、环形作品墙、作品筛选、项目快速预览、静态技能面板切换与动画控制。
- `1.html`、`todo.css`、`todo.js`：待办清单，支持任务分类、搜索、完成状态筛选、编辑、本地保存及撤销删除。
- `images/creative-hero-*.webp`：原创男生 3D 概念主视觉，提供多个宽度。
- `images/portfolio-preview-*.webp`、`images/todo-preview-*.webp`：页面截图的 WebP 预览；待办预览使用演示任务。
- `images/portfolio-social.png`：分享预览图。
- `robots.txt`、`sitemap.xml`：爬取规则与 XML 站点地图。
- `ASSETS.md`：视觉素材说明及生成提示词。

## 本地预览

在项目目录运行已安装的 Python：

```sh
python -m http.server 4174 --bind 127.0.0.1
```

然后访问 http://127.0.0.1:4174/ 。也可以使用 VS Code 的 Live Server / Live Preview。

## 修改与发布

修改 `index.html` 中的文字、作品入口和联系链接；完整项目介绍位于 `projects/`，实践笔记位于 `notes/`；它们是无需 JavaScript 的静态 HTML。`content.css` 提供详情页样式。修改 `myScript.js` 中的 `cases` 对象可调整画廊快速预览。公开内容发生实际更新时，同步修改 `sitemap.xml` 的 `lastmod` 日期。

将相关文件提交到本仓库 `main` 分支，沿用现有 GitHub Pages 发布配置。请勿删除 Google 验证 HTML 文件。

## 交互与数据

首页可暂停动态，并跟随系统的“减少动态效果”设置；手机作品墙改为横向滑动。所有作品入口、弹窗与技能选项均可用键盘操作。

待办任务只保存在当前浏览器的 `localStorage` 中（键名 `sulin.tasks.v2`），没有上传服务器，也不提供跨设备同步。删除任务或清理已完成任务后，12 秒内可以撤销。

## 验证

改版发布前检查了桌面与手机布局、作品筛选、弹窗焦点、技能键盘操作、动效偏好保存、任务增删改查、筛选、本地持久化与输入文本安全。预览图中的任务是演示内容，访客首次使用时从空清单开始。

## 作品详情与实践笔记

- `projects/personal-website.html`：响应式个人作品集网站案例。
- `projects/javascript-todo.html`：原生 JavaScript 待办清单案例，工具地址仍为 `1.html`。
- `projects/visual-experiments.html`：视觉、环形画廊与素材说明。
- `notes/localstorage-todo.html`：任务本地存储实践。
- `notes/responsive-grid.html`：响应式作品列表实践。
- `notes/orbit-gallery.html`：环形画廊与暂停控制实践。

首页使用中文可见主标题、案例摘要、直接详情链接与实践笔记入口。每个详情页有独立标题、描述、canonical 和结构化数据；首页以 WebSite 与 Person/ProfilePage 统一站点名称。技能正文直接保存在 HTML 中，无脚本时仍可阅读。

图片的多尺寸 WebP 副本按文件名宽度命名，例如 `creative-hero-640.webp`、`creative-hero-1100.webp` 和 `creative-hero-1672.webp`。首页通过 srcset/sizes 选择尺寸，首屏 preload 使用同一组候选；当前发布目录只保留页面引用的图片；源 PNG 与停用素材可从[清理前的版本](https://github.com/sulin1122/sulin1122.github.io/tree/ab8c934c78bf0dd6373149a35ef7daa3f8cdcd5d/images)恢复。新增页面时更新 `sitemap.xml`。
