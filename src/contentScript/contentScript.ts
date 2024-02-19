setInterval(() => {
  const distribution = document.getElementsByClassName('ciq-menu ciq-period')[0];
  if (!distribution) return;
  const target = distribution.getElementsByTagName('span')[0];
  if (!target) return;

  console.log((target as HTMLElement).innerText);
}, 1000);
