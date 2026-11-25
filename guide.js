const activity = document.querySelector('[data-case]');
const tabList = activity.querySelector('.case-tabs');
const tabs = Array.from(tabList.querySelectorAll('a'));
const panels = tabs.map((tab) => document.getElementById(tab.hash.slice(1)));

function selectTab(selectedIndex, moveFocus = false) {
  tabs.forEach((tab, index) => {
    const selected = index === selectedIndex;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panels[index].hidden = !selected;
  });
  if (moveFocus) tabs[selectedIndex].focus();
}

tabList.setAttribute('role', 'tablist');
tabs.forEach((tab, index) => {
  const panel = panels[index];
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', panel.id);
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', tab.id);
  panel.tabIndex = 0;
  tab.addEventListener('click', (event) => {
    event.preventDefault();
    selectTab(index);
  });
});

tabList.addEventListener('keydown', (event) => {
  const index = tabs.indexOf(event.target);
  const direction = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
  let nextIndex;
  if (direction) nextIndex = (index + direction + tabs.length) % tabs.length;
  else if (event.key === 'Home') nextIndex = 0;
  else if (event.key === 'End') nextIndex = tabs.length - 1;
  else if (event.key === ' ') nextIndex = index;
  else return;
  event.preventDefault();
  selectTab(nextIndex, true);
});

function selectLinkedTab() {
  const index = tabs.findIndex((tab) => tab.hash === window.location.hash);
  if (index >= 0) selectTab(index);
}

selectTab(0);
selectLinkedTab();
window.addEventListener('hashchange', selectLinkedTab);
