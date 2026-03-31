export function initTextSplit() {
  const elements = document.querySelectorAll('[js-text-split]');
  elements.forEach((el) => splitIntoLines(el));
}

function splitIntoLines(element) {
  const text = element.textContent;
  const words = text.trim().split(/\s+/);

  // Create a temporary container to measure line breaks
  const temp = document.createElement('div');
  const computedStyle = window.getComputedStyle(element);
  temp.style.cssText = `
    position: absolute;
    visibility: hidden;
    width: ${element.offsetWidth}px;
    font-family: ${computedStyle.fontFamily};
    font-size: ${computedStyle.fontSize};
    font-weight: ${computedStyle.fontWeight};
    line-height: ${computedStyle.lineHeight};
    letter-spacing: ${computedStyle.letterSpacing};
    text-transform: ${computedStyle.textTransform};
    white-space: normal;
    word-break: ${computedStyle.wordBreak};
  `;
  document.body.appendChild(temp);

  const lines = [];
  let currentLineWords = [];
  let lastTop = -1;

  words.forEach((word) => {
    currentLineWords.push(word);

    // Clear and rebuild temp with all current words as spans
    while (temp.firstChild) temp.removeChild(temp.firstChild);

    currentLineWords.forEach((w, i) => {
      if (i > 0) temp.appendChild(document.createTextNode(' '));
      const span = document.createElement('span');
      span.textContent = w;
      temp.appendChild(span);
    });

    const lastSpan = temp.lastElementChild;
    const top = lastSpan.offsetTop;

    if (lastTop !== -1 && top > lastTop) {
      // This word caused a new line — save previous line, start new one
      currentLineWords.pop();
      lines.push(currentLineWords.join(' '));
      currentLineWords = [word];
    }

    // Re-measure with just the current line words
    while (temp.firstChild) temp.removeChild(temp.firstChild);
    currentLineWords.forEach((w, i) => {
      if (i > 0) temp.appendChild(document.createTextNode(' '));
      const span = document.createElement('span');
      span.textContent = w;
      temp.appendChild(span);
    });

    lastTop = temp.lastElementChild.offsetTop;
  });

  if (currentLineWords.length) lines.push(currentLineWords.join(' '));

  document.body.removeChild(temp);

  // Replace content with line wrappers using DOM methods
  while (element.firstChild) element.removeChild(element.firstChild);

  lines.forEach((line) => {
    const outer = document.createElement('span');
    outer.className = 'njs-line';

    const inner = document.createElement('span');
    inner.className = 'njs-line__inner';
    inner.textContent = line;

    outer.appendChild(inner);
    element.appendChild(outer);
  });
}
