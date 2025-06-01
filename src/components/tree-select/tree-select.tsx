import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputAdornment,
  Breadcrumbs,
  Card,
  CardContent
} from '@mui/material';
import { Icon } from '@iconify/react';
import { TreeNode, TreeNodeWithParent, PathItem, TreeSelectProps } from './types';
import { sampleTreeData } from './data';

/**
 * TreeSelect component with breadcrumb navigation
 * A hierarchical selection component that allows users to navigate through nested categories
 */
const TreeSelect: React.FC<TreeSelectProps> = ({
  data = sampleTreeData,
  value = '',
  onChange,
  placeholder = 'เลือกหมวดหมู่สินค้า',
  title = 'หมวดหมู่'
}) => {
  // States
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<PathItem[]>([]);
  const [currentLevel, setCurrentLevel] = useState<TreeNode[]>(data);

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter tree data with global search and show parent info
  const globalSearchResults = (nodes: TreeNode[], searchTerm: string): TreeNodeWithParent[] => {
    if (!searchTerm) return [];

    const results: TreeNodeWithParent[] = [];
    
    const searchRecursive = (items: TreeNode[], parent: { id: number; label: string; value: string } | null = null) => {
      items.forEach(item => {
        const itemMatches = item.label.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (itemMatches) {
          results.push({
            ...item,
            parentInfo: parent || undefined
          });
        }
        
        // Search in children
        if (item.children) {
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
    return items.filter(item => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
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

  const filteredData = searchTerm 
    ? globalSearchResults(data, searchTerm)
    : filterCurrentLevel(currentLevel, searchTerm);

  return (
    <Box maxWidth="sm" sx={{ py: 4, mx: 'auto', px: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        {title}
      </Typography>
      
      {/* Dropdown Container */}
      <Box ref={dropdownRef} sx={{ position: 'relative' }}>
        
        {/* Selected Value Display / Trigger */}
        <Paper
          onClick={openDropdown}
          elevation={2}
          sx={{
            p: 2,
            cursor: 'pointer',
            border: 2,
            borderColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'primary.50',
              borderColor: 'primary.dark',
              transform: 'translateY(-1px)',
              boxShadow: 4
            },
            '&:active': {
              transform: 'translateY(0)',
              boxShadow: 2
            }
          }}
        >
          <Typography 
            color={selectedLabel ? 'text.primary' : 'text.secondary'}
            fontWeight={selectedLabel ? 'medium' : 'normal'}
          >
            {selectedLabel || placeholder}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedValue && (
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                sx={{
                  minWidth: 'auto',
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'error.light',
                    color: 'error.dark'
                  }
                }}
              >
                <Icon icon="eva:close-fill" width={16} height={16} />
              </Button>
            )}
            <Icon 
              icon="eva:arrow-ios-forward-fill" 
              width={20} 
              height={20} 
              color="primary.main"
            />
          </Box>
        </Paper>

        {/* Dropdown Menu */}
        {isOpen && (
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 1,
              zIndex: 1300,
              overflow: 'hidden',
              maxHeight: 400
            }}
          >
            
            {/* Search Input */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="ค้นหา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon="solar:magnifer-linear" width={20} height={20} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main'
                    }
                  }
                }}
              />
            </Box>

            {/* Breadcrumb Navigation */}
            {currentPath.length > 0 && (
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Button
                    onClick={navigateBack}
                    variant="outlined"
                    size="small"
                    sx={{
                      minWidth: 'auto',
                      width: 40,
                      height: 40,
                      p: 0,
                      '&:hover': {
                        bgcolor: 'primary.50'
                      }
                    }}
                  >
                    <Icon icon="eva:arrow-back-fill" width={20} height={20} />
                  </Button>
                  
                  <Breadcrumbs separator={<Icon icon="eva:arrow-ios-forward-fill" width={16} />} sx={{ flex: 1, ml: 2 }}>
                    {currentPath.map((pathItem) => (
                      <Typography key={pathItem.id} variant="body2" color="text.secondary">
                        {pathItem.label}
                      </Typography>
                    ))}
                  </Breadcrumbs>
                </Box>
              </Box>
            )}

            {/* Items List */}
            <Box sx={{ maxHeight: 240, overflow: 'auto' }}>
              {filteredData.length > 0 ? (
                <List disablePadding>
                  {searchTerm ? (
                    // Global search results with parent info
                    (filteredData as TreeNodeWithParent[]).map((item) => (
                      <ListItem key={`search-${item.id}`} disablePadding>
                        <ListItemButton
                          onClick={() => handleItemSelect(item)}
                          sx={{
                            '&:hover': { bgcolor: 'primary.50' }
                          }}
                        >
                          <ListItemText 
                            primary={item.label}
                            secondary={item.parentInfo ? item.parentInfo.label : null}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))
                  ) : (
                    // Normal navigation view
                    (filteredData as TreeNode[]).map((item) => {
                      const hasChildren = item.children && item.children.length > 0;
                      
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
                                  '&:hover': { bgcolor: 'success.50' }
                                }}
                              >
                                {/* Select Parent Button - narrower width */}
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleItemSelect(item);
                                  }}
                                  variant="text"
                                  sx={{
                                    justifyContent: 'flex-start',
                                    textTransform: 'none',
                                    fontWeight: 'medium',
                                    fontSize: '1rem',
                                    color: 'text.primary',
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

                                {/* Navigate area - takes remaining space */}
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                  px: 2,
                                  py: 1.5,
                                  flex: 1,
                                  color: 'success.main'
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
                                  '&:hover': { bgcolor: 'grey.100' }
                                }}
                              >
                                <ListItemText 
                                  primary={item.label}
                                  primaryTypographyProps={{ fontWeight: 'medium' }}
                                />
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
                  <Icon icon="eva:search-outline" width={48} height={48} color="grey.400" />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    ไม่พบรายการที่ค้นหา
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        )}
      </Box>

      {/* Selected Value Info - Only show if debugging is needed */}
      {process.env.NODE_ENV === 'development' && (
        <Card sx={{ mt: 3 }} elevation={1}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Selected Value:
            </Typography>
            <Typography variant="h6" color="primary.main" gutterBottom>
              {selectedValue || 'ยังไม่ได้เลือก'}
            </Typography>
            {selectedLabel && (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Label: {selectedLabel}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TreeSelect;
