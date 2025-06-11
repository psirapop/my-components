import { Icon } from '@iconify/react';
import React, { useRef, useState, useEffect } from 'react';

import {
  Box,
  List,
  Button,
  ListItem,
  TextField,
  Typography,
  ListItemText,
  ListItemButton,
  InputAdornment,
  Paper,
  Popper,
  ClickAwayListener,
  IconButton
} from '@mui/material';

import { sampleTreeData } from './data';

import type { TreeNode, PathItem, TreeSelectProps, TreeNodeWithParent } from './types';

/**
 * TreeSelect component with breadcrumb navigation
 * A hierarchical selection component that allows users to navigate through nested categories
 */
const TreeSelect: React.FC<TreeSelectProps> = ({
  data = sampleTreeData,
  value = '',
  onChange,
  placeholder = 'Select category',
  popperProps
}) => {
  // States
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<PathItem[]>([]);
  const [currentLevel, setCurrentLevel] = useState<TreeNode[]>(data);

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null);

  // Update selected value when prop changes
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  // Find and set label for the selected value
  useEffect(() => {
    // Only search for label if we have a value and data
    if (selectedValue) {
      const findLabelForValue = (nodes: TreeNode[]): string | null => {
        for (const node of nodes) {
          if (node.value === selectedValue) {
            return node.label;
          }
          if (node.children) {
            const label = findLabelForValue(node.children);
            if (label) return label;
          }
        }
        return null;
      };

      const label = findLabelForValue(data);
      if (label) setSelectedLabel(label);
    }
  }, [selectedValue, data]);



  // Filter tree data with global search and show parent info
  const globalSearchResults = (nodes: TreeNode[], searchTerm: string): TreeNodeWithParent[] => {
    if (!searchTerm) return [];

    const results: TreeNodeWithParent[] = [];
    const searchTermLower = searchTerm.toLowerCase();

    const searchRecursive = (items: TreeNode[], parent: { id: number; label: string; value: string } | null = null) => {
      items.forEach(item => {
        const itemMatches = item.label.toLowerCase().includes(searchTermLower);

        if (itemMatches) {
          results.push({
            ...item,
            parentInfo: parent || undefined
          });
        }

        // Search in children
        if (item.children && item.children.length > 0) {
          searchRecursive(item.children, {
            id: item.id,
            label: item.label,
            value: item.value
          });
        }
      });
    };

    searchRecursive(nodes);
    return results;
  };

  // Filter current level data based on search
  const filterCurrentLevel = (items: TreeNode[], searchTerm: string): TreeNode[] => {
    if (!searchTerm) return items;
    const searchTermLower = searchTerm.toLowerCase();
    return items.filter(item =>
      item.label.toLowerCase().includes(searchTermLower)
    );
  };

  // Navigate to children level
  const navigateToChildren = (parentNode: TreeNode) => {
    if (parentNode.children && parentNode.children.length > 0) {
      setCurrentPath([...currentPath, { id: parentNode.id, label: parentNode.label }]);
      setCurrentLevel(parentNode.children);
      setSearchTerm('');
    }
  };

  // Navigate back to parent level
  const navigateBack = () => {
    if (currentPath.length > 0) {
      const newPath = [...currentPath];
      newPath.pop();
      setCurrentPath(newPath);

      if (newPath.length === 0) {
        setCurrentLevel(data);
      } else {
        // หา parent node จาก path
        let levelData = data;
        for (const pathItem of newPath) {
          const parent = levelData.find(item => item.id === pathItem.id);
          if (parent && parent.children) {
            levelData = parent.children;
          }
        }
        setCurrentLevel(levelData);
      }
      setSearchTerm('');
    }
  };

  // Navigate to specific breadcrumb level
  const navigateToBreadcrumb = (targetIndex: number) => {
    // สร้าง path ใหม่โดยตัดจาก index ที่กด
    const newPath = currentPath.slice(0, targetIndex + 1);
    setCurrentPath(newPath);

    // หา level data ที่ตรงกับ path ใหม่
    if (newPath.length === 0) {
      setCurrentLevel(data);
    } else {
      let levelData = data;
      for (const pathItem of newPath) {
        const parent = levelData.find(item => item.id === pathItem.id);
        if (parent && parent.children) {
          levelData = parent.children;
        }
      }
      setCurrentLevel(levelData);
    }
    setSearchTerm('');
  };

  // Handle item selection
  const handleItemSelect = (item: TreeNode | TreeNodeWithParent) => {
    setSelectedValue(item.value);
    setSelectedLabel(item.label);
    setIsOpen(false);
    setSearchTerm('');

    // Call onChange callback if provided
    if (onChange) {
      onChange(item.value, item.label);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedValue('');
    setSelectedLabel('');

    // Call onChange callback if provided
    if (onChange) {
      onChange('', '');
    }
  };

  // Navigate to selected item's position when opening
  const openDropdown = () => {
    setIsOpen(true);
    setSearchTerm('');

    if (selectedValue) {
      // Find the selected item and navigate to its position
      const pathToSelected = findPathToSelectedItem(data, selectedValue);
      if (pathToSelected) {
        setCurrentPath(pathToSelected.path);
        setCurrentLevel(pathToSelected.level);
      }
    } else {
      // If no selection, start at root
      setCurrentPath([]);
      setCurrentLevel(data);
    }
  };

  // Handle close
  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  // Find path to selected item
  const findPathToSelectedItem = (nodes: TreeNode[], targetValue: string): { path: PathItem[], level: TreeNode[] } | null => {
    const findRecursive = (items: TreeNode[], currentPath: PathItem[]): { path: PathItem[], level: TreeNode[] } | null => {
      for (const item of items) {
        // If this is the selected item, return the current path and its parent level
        if (item.value === targetValue) {
          return { path: currentPath, level: items };
        }

        // If item has children, search in them
        if (item.children) {
          const result = findRecursive(item.children, [...currentPath, { id: item.id, label: item.label }]);
          if (result) return result;
        }
      }
      return null;
    };

    return findRecursive(nodes, []);
  };

  // Calculate filtered data with proper type handling
  const filteredData = React.useMemo(() => {
    if (searchTerm) {
      return globalSearchResults(data, searchTerm);
    } else {
      return filterCurrentLevel(currentLevel, searchTerm);
    }
  }, [searchTerm, data, currentLevel]);



  return (
    <Box width="100%">
      <Paper
        ref={anchorRef}
        onClick={openDropdown}
        elevation={2}
        sx={{
          p: 1,
          cursor: 'pointer',
          border: 1,
          borderColor: 'rgba(var(--palette-grey-500Channel) / 1)',
          borderRadius: 'shape.borderRadius',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
          boxShadow: 'none',
          '&:hover': {
            borderColor: 'text.primary',
            '& .clear-button': {
              opacity: 1,
              visibility: 'visible',
              transform: 'scale(1)'
            }
          }
        }}
      >
        <Typography
          color={selectedLabel ? 'text.primary' : 'text.disabled'}
          fontWeight="normal"
          variant="body2"
          pl={1}
        >
          {selectedLabel || placeholder}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {selectedValue && (
            <IconButton
              size="small"
              className="clear-button"
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              sx={{
                opacity: 0,
                visibility: 'hidden',
                transform: 'scale(0.8)',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <Icon icon="eva:close-fill" width={20} height={20} />
            </IconButton>
          )}
          <IconButton
            size="small"
          >
            <Icon
              icon={isOpen ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
              width={20}
              height={20}
              style={{
                transition: 'transform 0.2s ease',
              }}
            />
          </IconButton>
        </Box>
      </Paper>

      {/* Popper Dropdown */}
      <Popper
        open={isOpen}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        sx={{
          zIndex: 1030,
          width: anchorRef.current?.offsetWidth || '100%',
          '& .MuiPaper-root': {
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            backgroundColor: 'transparent'
          },
          borderRadius: '10px',
          backgroundColor: 'white',
          ...popperProps?.sx
        }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              maxHeight: 400,
              overflow: 'hidden'
            }}
          >
            {/* Search Input */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon="solar:magnifer-linear" width={20} height={20} />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            {/* Breadcrumb Navigation with Clickable Items */}
            {!searchTerm && currentPath.length > 0 && (
              <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Button
                    onClick={navigateBack}
                    variant="outlined"
                    size="small"
                    sx={{
                      minWidth: 'auto',
                      width: 24,
                      height: 24,
                      p: 0,
                      '&:hover': {
                        bgcolor: 'primary.50'
                      }
                    }}
                  >
                    <Icon icon="eva:arrow-ios-back-fill" width={16} height={16} />
                  </Button>

                  {/* Custom Breadcrumb with clickable items */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1,
                    ml: 1,
                    gap: '2px'
                  }}>
                    {currentPath.map((pathItem, index) => (
                      <React.Fragment key={pathItem.id}>
                        {index === currentPath.length - 1 ? (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: '0.875rem',
                              px: 0.5
                            }}
                          >
                            {pathItem.label}
                          </Typography>
                        ) : (
                          <Button
                            onClick={() => navigateToBreadcrumb(index)}
                            variant="text"
                            size="small"
                            sx={{
                              minWidth: 'auto',
                              padding: '2px 4px',
                              textTransform: 'none',
                              fontSize: '0.875rem',
                              fontWeight: 'normal',
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.50'
                              }
                            }}
                          >
                            {pathItem.label}
                          </Button>
                        )}
                        {index < currentPath.length - 1 && (
                          <Icon
                            icon="eva:arrow-ios-forward-fill"
                            width={12}
                            height={12}
                            style={{ color: '#9e9e9e' }}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Items List */}
            <Box sx={{ maxHeight: 240, overflow: 'auto' }}>
              {filteredData.length > 0 ? (
                <List disablePadding>
                  {searchTerm ? (
                    // Global search results with parent info
                    filteredData.map((item, index) => {
                      const searchItem = item as TreeNodeWithParent;
                      return (
                        <ListItem key={`search-${searchItem.id}-${searchItem.parentInfo?.id || 'root'}-${index}`} disablePadding>
                          <ListItemButton
                            onClick={() => handleItemSelect(searchItem)}
                            sx={{
                              '&:hover': { bgcolor: 'primary.50' },
                              m: .5,
                              borderRadius: 1,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 'medium',
                                color: 'text.primary',
                                fontSize: '0.875rem',
                                flex: 1
                              }}
                            >
                              {searchItem.label}
                            </Typography>

                            {searchItem.parentInfo && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                  fontSize: '0.75rem',
                                  fontStyle: 'italic',
                                  ml: 2
                                }}
                              >
                                {searchItem.parentInfo.label}
                              </Typography>
                            )}
                          </ListItemButton>
                        </ListItem>
                      );
                    })
                  ) : (
                    // Normal navigation view
                    (filteredData as TreeNode[]).map((item) => {
                      const hasChildren = item.children && item.children.length > 0;
                      const isSelected = item.value === selectedValue;

                      return (
                        <ListItem key={item.id} disablePadding>
                          <Box sx={{ display: 'flex', width: '100%' }}>
                            {hasChildren ? (
                              // For items with children - horizontal layout
                              <ListItemButton
                                onClick={() => navigateToChildren(item)}
                                sx={{
                                  flex: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  p: 0,
                                  m: .5,
                                  borderRadius: 1,
                                  '&:hover': { bgcolor: 'success.50' },
                                  bgcolor: isSelected ? 'primary.50' : 'transparent'
                                }}
                              >
                                {/* Select Parent Button */}
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleItemSelect(item);
                                  }}
                                  variant="text"
                                  sx={{
                                    justifyContent: 'flex-start',
                                    textTransform: 'none',
                                    fontWeight: isSelected ? 'bold' : 'medium',
                                    color: isSelected ? 'primary.main' : 'text.primary',
                                    px: 2,
                                    py: 1.5,
                                    minWidth: 'fit-content',
                                    maxWidth: '70%',
                                    borderRadius: 0,
                                    '&:hover': {
                                      bgcolor: 'primary.50',
                                      color: 'primary.main'
                                    }
                                  }}
                                >
                                  {item.label}
                                </Button>

                                {/* Navigate area */}
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                  px: 2,
                                  py: 1.5,
                                  flex: 1,
                                }}>
                                  <Icon icon="eva:arrow-ios-forward-fill" width={20} height={20} />
                                </Box>
                              </ListItemButton>
                            ) : (
                              // For items without children - simple selection
                              <ListItemButton
                                onClick={() => handleItemSelect(item)}
                                sx={{
                                  flex: 1,
                                  m: .5,
                                  borderRadius: 1,
                                  py: 1.5,
                                  '&:hover': { bgcolor: 'success.50' },
                                  bgcolor: isSelected ? 'primary.50' : 'transparent'
                                }}
                              >
                                <ListItemText
                                  primary={item.label}
                                  primaryTypographyProps={{
                                    color: isSelected ? 'primary.main' : 'text.primary',
                                    fontSize: '0.875rem'
                                  }}
                                />
                                {isSelected && (
                                  <Icon
                                    icon="eva:checkmark-circle-2-fill"
                                    width={20}
                                    height={20}
                                  />
                                )}
                              </ListItemButton>
                            )}
                          </Box>
                        </ListItem>
                      );
                    })
                  )}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Icon icon="eva:search-outline" width={48} height={48} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    No items found
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default TreeSelect;