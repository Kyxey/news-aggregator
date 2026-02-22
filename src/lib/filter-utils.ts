export const toggleArraySelection = <T>(currentSelection: T[], allItems: T[]): T[] => {
  if (currentSelection.length === 0 || currentSelection.length === allItems.length) {
    return [];
  }
  return [...allItems];
};

export const toggleItemInArray = <T>(currentSelection: T[], item: T): T[] => {
  if (currentSelection.includes(item)) {
    return currentSelection.filter(i => i !== item);
  }
  return [...currentSelection, item];
};
