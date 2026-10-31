# 视觉素材说明

网站主视觉：`images/creative-hero-1672.webp`，同时提供 640px 和 1100px 宽度版本。使用内置 `image_gen` 工具生成，再以生成结果为输入将人物修改为男生。该人物为原创 AI 辅助概念角色，不是网站作者的真实肖像。

`images/portfolio-preview-*.webp`、`images/todo-preview-*.webp` 为浏览器页面截图的多尺寸 WebP 版本；`images/portfolio-social.jpg` 用于社交分享（旧 PNG 保留兼容已有链接）。待办预览图中的任务仅用于演示。

`images/brochure-reference.webp` 和 `images/portfolio-reference.webp` 为网站原有的排版学习参考素材，画廊中明确标为参考资料，不作为原创项目署名。

字标、字体海报、星形装饰、任务缩略图和环绕动画以 HTML/CSS/JavaScript 实现。

## 初始生成提示词

Use case: stylized-concept. Asset type: cinematic widescreen hero image for Su Lin's personal creative-coding portfolio, inspired by the visual mood of a high-end editorial 3D designer portfolio. Create an original collectible 3D young-adult character with exuberant sculpted copper-red curly hair, dark translucent round glasses, a cobalt-blue ribbed turtleneck and olive oversized jacket. Medium close-up, three-quarter head angle, expressive thoughtful confident gaze, intricate tactile hair and woven fabric, warm skin. Composition: wide 16:9 panoramic frame, character dramatically cropped on the RIGHT HALF, face at x=72%, sculptural curls extending high. LEFT 45% is clean almost black negative space for HTML headline text. Backdrop charcoal black studio, directional red-orange rim light and subtle warm key light, deep shadows, restrained editorial art direction. Premium sophisticated rendered vinyl and lifelike textures, strong silhouette, no scenery, no props, no logos, no text, no typography, no watermark. This is original visual artwork, not a portrait of the website owner and not a named fictional character.

## 最终男生版本编辑提示词

Edit this website hero image: replace the female-looking character with a clearly MALE young-adult 3D character, around 24 years old. Masculine angular facial structure, broad defined jaw, strong eyebrows, slightly broader nose, no makeup, no feminine eyelashes, subtly confident friendly gaze. Keep copper-red curly hair but give him a shorter sculptural curly hairstyle with some volume on top. Keep the dark round glasses, cobalt-blue ribbed turtleneck, olive oversized jacket, premium stylized 3D collectible figure material, orange rim light and black studio backdrop. Preserve the exact widescreen editorial composition with the male character on the RIGHT HALF and the LEFT 45% clean almost-black negative space. Preserve lighting quality, texture detail, overall visual mood, camera angle and all other elements. No typography, logos, watermarks or extra objects. Make gender clearly read as male.

## 网页图片派生文件

2026-10-30 从现有 PNG 生成多尺寸 WebP，用于首屏、作品封面与详情页。派生文件保留原有构图，文件名中的数字表示像素宽度。当前发布目录只保留使用中的版本；原始 PNG 与停用素材可从[清理前的版本](https://github.com/sulin1122/sulin1122.github.io/tree/ab8c934c78bf0dd6373149a35ef7daa3f8cdcd5d/images)恢复。`portfolio-preview` 的截图表现改版前的页面，详情页将其标为页面预览，不作为当前性能或搜索结果的证明。


2026-10-31 从原始 PNG 重新编码已有多尺寸 WebP（质量 78、method 6），不改变构图或像素尺寸；分享预览图另生成 1200×630 渐进式 JPEG（质量 86），当前页面使用 JPEG，旧 PNG 仅作旧分享地址兼容。
