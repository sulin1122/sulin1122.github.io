'use strict';
const byId = id => document.getElementById(id);
const categoryNames = { learning:'学习', project:'项目', life:'生活' };
const storageKey = 'sulin.tasks.v2';
let tasks = [], stateFilter = 'all', categoryFilter = 'all', search = '', editingId = null, undoItems = null, toastTimeout;
let storageOK = true;
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(stored)) {
    const seen = new Set();
    tasks = stored.filter(task => task && typeof task.id === 'string' && task.id.length < 100 && typeof task.text === 'string' && task.text.trim() && task.text.length <= 120 && !seen.has(task.id) && seen.add(task.id)).slice(0,500).map(task => ({id:task.id,text:task.text.trim(),done:task.done === true,category:categoryNames[task.category] ? task.category : 'learning'}));
  }
} catch { storageOK = false; }
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(tasks)); storageOK = true; } catch { storageOK = false; }
  byId('storage-state').textContent = storageOK ? '自动保存在当前浏览器' : '当前无法保存，刷新后任务会清空';
}
function announce(text, undo = false) {
  clearTimeout(toastTimeout);
  byId('toast-text').textContent = text;
  byId('undo-delete').hidden = !undo;
  byId('task-toast').classList.add('is-visible');
  toastTimeout = setTimeout(() => { byId('task-toast').classList.remove('is-visible'); undoItems = null; }, undo ? 12000 : 3500);
}
function removeTasks(ids) {
  undoItems = tasks.map((task,index) => ({task:{...task},index})).filter(entry => ids.includes(entry.task.id));
  tasks = tasks.filter(task => !ids.includes(task.id));
  save(); render(); announce(ids.length === 1 ? '任务已移除。' : `已清理 ${ids.length} 项完成任务。`, true);
}
byId('undo-delete').addEventListener('click', () => {
  if (!undoItems) return;
  undoItems.forEach(entry => { if (!tasks.some(task => task.id === entry.task.id)) tasks.splice(Math.min(entry.index,tasks.length),0,entry.task); });
  undoItems = null; save(); render(); announce('已恢复任务。');
});
function beginEdit(task) { editingId = task.id; render(); const input = byId('edit-task'); input?.focus(); input?.select(); }
function render() {
  const complete = tasks.filter(task => task.done).length;
  const remaining = tasks.length - complete;
  byId('task-total').textContent = String(tasks.length).padStart(2,'0');
  byId('all-count').textContent = String(tasks.length);
  byId('active-count').textContent = String(remaining);
  byId('done-count').textContent = String(complete);
  const percent = tasks.length ? Math.round(complete / tasks.length * 100) : 0;
  document.querySelector('.progress-ring').style.setProperty('--progress', `${percent * 3.6}deg`);
  document.querySelector('.progress-ring').setAttribute('aria-label', `任务完成进度 ${percent}%`);
  byId('progress-number').replaceChildren(document.createTextNode(String(percent)), Object.assign(document.createElement('span'),{textContent:'%'}));
  byId('progress-caption').textContent = tasks.length ? `已完成 ${complete} / ${tasks.length} 个小目标。` : '今天的清单，由你开始。';
  byId('todoCount').textContent = tasks.length && !remaining ? '太好了，清单上的事情都完成了。' : `剩余 ${remaining} 项待完成`;
  byId('clear-completed').disabled = complete === 0;
  const visible = tasks.filter(task => (stateFilter === 'all' || (stateFilter === 'done' ? task.done : !task.done)) && (categoryFilter === 'all' || task.category === categoryFilter) && task.text.toLocaleLowerCase().includes(search));
  byId('todoList').replaceChildren();
  for (const task of visible) {
    const row = document.createElement('li'); row.className = `todo-item${task.done ? ' completed' : ''}`; row.dataset.id = task.id;
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'todo-checkbox'; checkbox.checked = task.done; checkbox.setAttribute('aria-label', `${task.done ? '标记未完成' : '标记完成'}：${task.text}`);
    checkbox.addEventListener('change', () => { task.done = checkbox.checked; save(); render(); const replacement = [...document.querySelectorAll('.todo-item')].find(item => item.dataset.id === task.id); replacement?.querySelector('input')?.focus(); });
    const body = document.createElement('div'); body.className = 'todo-body';
    if (editingId === task.id) {
      const input = document.createElement('input'); input.id = 'edit-task'; input.className = 'edit-input'; input.value = task.text; input.maxLength = 120; input.setAttribute('aria-label','编辑任务'); let finished = false;
      const finish = commit => {
        if (finished) return; finished = true;
        const value = input.value.trim(); if (commit && value) task.text = value;
        editingId = null; save(); render();
      };
      input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); finish(true); } if (event.key === 'Escape') { event.preventDefault(); finish(false); } });
      input.addEventListener('blur', () => finish(true)); body.append(input);
    } else { const text = document.createElement('span'); text.className = 'todo-text'; text.textContent = task.text; text.addEventListener('dblclick', () => beginEdit(task)); body.append(text); }
    body.append(document.createElement('br'));
    const tag = document.createElement('span'); tag.className = 'todo-category'; tag.dataset.category = task.category; tag.textContent = categoryNames[task.category]; body.append(tag);
    const actions = document.createElement('div'); actions.className = 'todo-tools';
    const edit = document.createElement('button'); edit.type = 'button'; edit.textContent = '编辑'; edit.setAttribute('aria-label',`编辑任务：${task.text}`); edit.addEventListener('click', () => beginEdit(task));
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'delete-button'; remove.textContent = '×'; remove.setAttribute('aria-label',`删除任务：${task.text}`); remove.addEventListener('click', () => removeTasks([task.id]));
    actions.append(edit,remove); row.append(checkbox,body,actions); byId('todoList').append(row);
  }
  const empty = byId('emptyMessage'); empty.hidden = visible.length > 0;
  empty.querySelector('h3').textContent = !tasks.length ? '留白，也是一种开始。' : stateFilter === 'done' && !search && categoryFilter === 'all' ? '每一次完成，都值得被看见。' : '这里暂时没有符合的任务。';
  empty.querySelector('p').textContent = !tasks.length ? '写下第一件想做的事，让今天慢慢充实起来。' : '试试切换筛选条件，或继续完成下一个小目标。';
}
byId('task-form').addEventListener('submit', event => {
  event.preventDefault(); const text = byId('todoInput').value.trim(); if (!text) { byId('todoInput').focus(); announce('先写下一件想做的事吧。'); return; }
  if (tasks.length >= 500) { announce('清单已经很长了，先完成或整理一些任务吧。'); return; }
  const id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  tasks.unshift({id,text:text.slice(0,120),category:byId('new-category').value,done:false});
  stateFilter = 'all'; categoryFilter = 'all'; search = ''; byId('category-filter').value = 'all'; byId('task-search').value = '';
  document.querySelectorAll('[data-state]').forEach(button => { const active = button.dataset.state === 'all'; button.classList.toggle('is-active',active); button.setAttribute('aria-pressed',String(active)); });
  byId('todoInput').value = ''; save(); render(); byId('todoInput').focus();
});
byId('todoInput').addEventListener('keydown', event => { if (event.isComposing && event.key === 'Enter') event.preventDefault(); });
document.querySelectorAll('[data-state]').forEach(button => button.addEventListener('click', () => {
  stateFilter = button.dataset.state;
  document.querySelectorAll('[data-state]').forEach(item => { const active = item === button; item.classList.toggle('is-active',active); item.setAttribute('aria-pressed',String(active)); }); render();
}));
byId('category-filter').addEventListener('change', event => { categoryFilter = event.target.value; render(); });
byId('task-search').addEventListener('input', event => { search = event.target.value.toLocaleLowerCase().trim(); render(); });
byId('clear-completed').addEventListener('click', () => { const ids = tasks.filter(task => task.done).map(task => task.id); if (ids.length) removeTasks(ids); });
window.addEventListener('storage', event => {
  if (event.key === storageKey) { announce('其他标签页更新了清单，刷新后可查看最新内容。'); }
});
byId('today-label').textContent = new Intl.DateTimeFormat('zh-CN',{month:'long',day:'numeric',weekday:'long'}).format(new Date());
byId('storage-state').textContent = storageOK ? '自动保存在当前浏览器' : '当前无法读取保存内容，新任务仍可尝试保存';
render();
