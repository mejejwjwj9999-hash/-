// Virtualization utilities for better performance with large datasets

export const VIRTUALIZATION_CONSTANTS = {
  // Default item heights for different screen sizes
  DESKTOP_ITEM_HEIGHT: 80,
  MOBILE_ITEM_HEIGHT: 100,
  
  // Overscan count for react-window
  OVERSCAN_COUNT: 5,
  
  // Threshold for enabling virtualization
  VIRTUALIZATION_THRESHOLD: 50,
  
  // Container heights
  DEFAULT_CONTAINER_HEIGHT: 400,
  MOBILE_CONTAINER_HEIGHT: 300,
} as const;

export const getItemHeight = (isMobile: boolean = false): number => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768 
      ? VIRTUALIZATION_CONSTANTS.MOBILE_ITEM_HEIGHT 
      : VIRTUALIZATION_CONSTANTS.DESKTOP_ITEM_HEIGHT;
  }
  return isMobile 
    ? VIRTUALIZATION_CONSTANTS.MOBILE_ITEM_HEIGHT 
    : VIRTUALIZATION_CONSTANTS.DESKTOP_ITEM_HEIGHT;
};

export const getContainerHeight = (itemCount: number, isMobile: boolean = false): number => {
  const itemHeight = getItemHeight(isMobile);
  const maxHeight = isMobile 
    ? VIRTUALIZATION_CONSTANTS.MOBILE_CONTAINER_HEIGHT 
    : VIRTUALIZATION_CONSTANTS.DEFAULT_CONTAINER_HEIGHT;
  
  // Calculate natural height based on item count
  const naturalHeight = itemCount * itemHeight;
  
  // Return the minimum of natural height and max height
  return Math.min(naturalHeight, maxHeight);
};

export const shouldVirtualize = (itemCount: number): boolean => {
  return itemCount > VIRTUALIZATION_CONSTANTS.VIRTUALIZATION_THRESHOLD;
};

// Memoization helper for virtualized list item data
export const createVirtualizedListData = <T>(
  items: T[],
  callbacks: Record<string, (...args: any[]) => void>
) => ({
  items,
  ...callbacks,
});

// Performance optimization for large lists
export const optimizeListForPerformance = <T>(
  items: T[],
  searchQuery: string = '',
  filters: Record<string, any> = {}
): T[] => {
  // Early return if no filters applied
  if (!searchQuery && Object.keys(filters).length === 0) {
    return items;
  }
  
  // Apply filters and search in a single pass for better performance
  return items.filter((item: any) => {
    // Search query filter
    if (searchQuery) {
      const searchableFields = ['file_name', 'description', 'category'];
      const matchesSearch = searchableFields.some(field => 
        item[field]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (!matchesSearch) return false;
    }
    
    // Apply additional filters
    for (const [key, value] of Object.entries(filters)) {
      if (value && item[key] !== value) {
        return false;
      }
    }
    
    return true;
  });
};