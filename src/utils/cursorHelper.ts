/**
 * Inserts text at the current cursor index of an input/textarea and restores focus seamlessly.
 *
 * @param element The HTMLInputElement or HTMLTextAreaElement reference
 * @param textToInsert The string value to be inserted
 * @param currentValue The current value of the element
 * @returns The new string value and the index where the cursor should be positioned next
 */
export function insertTextAtCursor(
  element: HTMLInputElement | HTMLTextAreaElement,
  textToInsert: string,
  currentValue: string
): { newValue: string; nextCursorPos: number } {
  const start = element.selectionStart ?? currentValue.length;
  const end = element.selectionEnd ?? currentValue.length;

  const before = currentValue.substring(0, start);
  const after = currentValue.substring(end);

  // If there's already some text, handle spaces around the inserted text gracefully
  let preparedText = textToInsert;
  if (before.length > 0 && !before.endsWith(' ') && !preparedText.startsWith(' ')) {
    preparedText = ' ' + preparedText;
  }
  if (after.length > 0 && !after.startsWith(' ') && !preparedText.endsWith(' ')) {
    preparedText = preparedText + ' ';
  }

  const newValue = before + preparedText + after;
  const nextCursorPos = start + preparedText.length;

  return {
    newValue,
    nextCursorPos
  };
}
