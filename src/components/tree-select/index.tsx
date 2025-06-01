import React, { useState, useRef, useEffect } from 'react';
import {
 Box,
 Paper,
 TextField,
 Typography,
 Button,
 Chip,
 List,
 ListItem,
 ListItemButton,
 ListItemText,
 InputAdornment,
 Breadcrumbs,
 Card,
 CardContent,
 Container
} from '@mui/material';
import { Icon } from '@iconify/react';

interface TreeNode {
 id: number;
 label: string;
 value: string;
 children?: TreeNode[];
}

interface TreeNodeWithParent extends TreeNode {
 parentInfo?: {
   id: number;
   label: string;
   value: string;
 };
}

interface PathItem {
 id: number;
 label: string;
}

const SelectTreeBreadcrumb: React.FC = () => {
 // Sample data structure - ข้อมูลตัวอย่าง 2-3 ชั้น
 const treeData: TreeNode[] = [
   {
     id: 1,
     label: 'เครื่องใช้ไฟฟ้า',
     value: 'electronics',
     children: [
       {
         id: 11,
         label: 'คอมพิวเตอร์',
         value: 'computers',
         children: [
           { id: 111, label: 'โน้ตบุ๊ค Gaming', value: 'gaming-laptop' },
           { id: 112, label: 'โน้ตบุ๊คสำนักงาน', value: 'office-laptop' },
           { id: 113, label: 'คอมพิวเตอร์ตั้งโต๊ะ', value: 'desktop-pc' },
           { id: 114, label: 'All-in-One PC', value: 'all-in-one-pc' }
         ]
       },
       {
         id: 12,
         label: 'โทรศัพท์มือถือ',
         value: 'smartphones',
         children: [
           { id: 121, label: 'iPhone', value: 'iphone' },
           { id: 122, label: 'Samsung Galaxy', value: 'samsung' },
           { id: 123, label: 'Xiaomi', value: 'xiaomi' },
           { id: 124, label: 'OPPO', value: 'oppo' }
         ]
       },
       {
         id: 13,
         label: 'เครื่องใช้ไฟฟ้าในบ้าน',
         value: 'home-appliances',
         children: [
           { id: 131, label: 'ตู้เย็น', value: 'refrigerator' },
           { id: 132, label: 'เครื่องซักผ้า', value: 'washing-machine' },
           { id: 133, label: 'เครื่องปรับอากาศ', value: 'air-conditioner' }
         ]
       },
       { id: 14, label: 'อุปกรณ์เสริม', value: 'accessories' }
     ]
   },
   {
     id: 2,
     label: 'เสื้อผ้าและแฟชั่น',
     value: 'fashion',
     children: [
       {
         id: 21,
         label: 'เสื้อผ้าผู้ชาย',
         value: 'mens-clothing',
         children: [
           { id: 211, label: 'เสื้อเชิ้ต', value: 'shirts' },
           { id: 212, label: 'เสื้อยืด', value: 't-shirts' },
           { id: 213, label: 'กางเกงยีนส์', value: 'jeans' },
           { id: 214, label: 'กางเกงขาสั้น', value: 'shorts' }
         ]
       },
       {
         id: 22,
         label: 'เสื้อผ้าผู้หญิง',
         value: 'womens-clothing',
         children: [
           { id: 221, label: 'เดรส', value: 'dresses' },
           { id: 222, label: 'เสื้อแขนยาว', value: 'long-sleeve-tops' },
           { id: 223, label: 'กระโปรง', value: 'skirts' }
         ]
       },
       { id: 23, label: 'รองเท้า', value: 'shoes' },
       { id: 24, label: 'กระเป๋า', value: 'bags' }
     ]
   },
   {
     id: 3,
     label: 'บ้านและสวน',
     value: 'home-garden',
     children: [
       {
         id: 31,
         label: 'เฟอร์นิเจอร์',
         value: 'furniture',
         children: [
           { id: 311, label: 'โซฟา', value: 'sofas' },
           { id: 312, label: 'โต๊ะทำงาน', value: 'desk' },
           { id: 313, label: 'เก้าอี้', value: 'chairs' },
           { id: 314, label: 'ตู้เสื้อผ้า', value: 'wardrobe' }
         ]
       },
       {
         id: 32,
         label: 'อุปกรณ์ทำสวน',
         value: 'gardening',
         children: [
           { id: 321, label: 'เครื่องมือทำสวน', value: 'garden-tools' },
           { id: 322, label: 'กระถางต้นไม้', value: 'plant-pots' },
           { id: 323, label: 'ปุ๋ยและดิน', value: 'fertilizer-soil' }
         ]
       },
       { id: 33, label: 'อุปกรณ์ห้องครัว', value: 'kitchen-equipment' }
     ]
   },
   {
     id: 4,
     label: 'หนังสือและสื่อการเรียน',
     value: 'books-education',
     children: [
       { id: 41, label: 'หนังสือเรียน', value: 'textbooks' },
       { id: 42, label: 'นิยาย', value: 'novels' },
       { id: 43, label: 'การ์ตูน', value: 'comics' },
       { id: 44, label: 'หนังสือเด็ก', value: 'children-books' }
     ]
   },
   {
     id: 5,
     label: 'ของเล่นและงานอดิเรก',
     value: 'toys-hobbies'
   },
   {
     id: 6,
     label: 'อาหารและเครื่องดื่ม',
     value: 'food-beverages'
   }
 ];

 // States
 const [isOpen, setIsOpen] = useState<boolean>(false);
 const [selectedValue, setSelectedValue] = useState<string>('');
 const [selectedLabel, setSelectedLabel] = useState<string>('');
 const [searchTerm, setSearchTerm] = useState<string>('');
 const [currentPath, setCurrentPath] = useState<PathItem[]>([]);
 const [currentLevel, setCurrentLevel] = useState<TreeNode[]>(treeData);

 // Refs
 const dropdownRef = useRef<HTMLDivElement>(null);

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
       setCurrentLevel(treeData);
     } else {
       // หา parent node จาก path
       let levelData = treeData;
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
   // Reset to root level
   setCurrentPath([]);
   setCurrentLevel(treeData);
 };

 // Clear selection
 const clearSelection = () => {
   setSelectedValue('');
   setSelectedLabel('');
 };

 // Reset dropdown state when opening
 const openDropdown = () => {
   setIsOpen(true);
   setCurrentPath([]);
   setCurrentLevel(treeData);
   setSearchTerm('');
 };

 const filteredData = searchTerm 
   ? globalSearchResults(treeData, searchTerm)
   : filterCurrentLevel(currentLevel, searchTerm);

 return (
   <Container maxWidth="sm" sx={{ py: 4 }}>
     <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
       หมวดหมู่
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
           {selectedLabel || 'เลือกหมวดหมู่สินค้า'}
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
                 borderRadius: '50%',
                 '&:hover': {
                   bgcolor: 'error.light',
                   color: 'error.dark'
                 }
               }}
             >
               <Icon icon="mdi:close" width={16} height={16} />
             </Button>
           )}
           <Icon 
             icon="mdi:chevron-right" 
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
             borderRadius: 2,
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
                     <Icon icon="mdi:magnify" width={20} height={20} />
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
               <Button
                 startIcon={<Icon icon="mdi:chevron-left" />}
                 onClick={navigateBack}
                 size="small"
                 variant="outlined"
                 sx={{ mb: 1 }}
               >
                 ย้อนกลับ
               </Button>
               
               <Breadcrumbs separator={<Icon icon="mdi:chevron-right" width={16} />}>
                 {currentPath.map((pathItem) => (
                   <Typography key={pathItem.id} variant="body2" color="text.secondary">
                     {pathItem.label}
                   </Typography>
                 ))}
               </Breadcrumbs>
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
                           secondary={
                             item.parentInfo ? (
                               <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <Typography variant="caption" color="text.secondary">
                                   {item.parentInfo.label}
                                 </Typography>
                                 <Chip 
                                   label="หมวดหมู่หลัก" 
                                   size="small" 
                                   variant="outlined"
                                   sx={{ height: 16 }}
                                 />
                               </Box>
                             ) : (
                               <Chip 
                                 label="รายการหลัก" 
                                 size="small" 
                                 color="primary"
                                 variant="outlined"
                                 sx={{ height: 16 }}
                               />
                             )
                           }
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
                           {/* Select Parent Button */}
                           <ListItemButton
                             onClick={() => handleItemSelect(item)}
                             sx={{
                               flex: 1,
                               borderRight: hasChildren ? 1 : 0,
                               borderColor: 'divider',
                               '&:hover': { bgcolor: 'grey.100' }
                             }}
                           >
                             <ListItemText 
                               primary={item.label}
                               primaryTypographyProps={{ fontWeight: 'medium' }}
                             />
                           </ListItemButton>

                           {/* Navigate to Children Button */}
                           {hasChildren && (
                             <Button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 navigateToChildren(item);
                               }}
                               variant="text"
                               color="success"
                               endIcon={<Icon icon="mdi:chevron-right" />}
                               sx={{
                                 minWidth: 140,
                                 flexDirection: 'column',
                                 py: 1.5,
                                 '&:hover': {
                                   bgcolor: 'success.50'
                                 }
                               }}
                             >
                               <Typography variant="body2" fontWeight="medium">
                                 ดูหมวดย่อย
                               </Typography>
                               <Typography variant="caption" color="text.secondary">
                                 ({item.children?.length || 0} รายการ)
                               </Typography>
                             </Button>
                           )}
                           
                           {/* ถ้าไม่มี children ให้แสดง indicator */}
                           {!hasChildren && (
                             <Box sx={{ 
                               minWidth: 140, 
                               display: 'flex', 
                               alignItems: 'center', 
                               justifyContent: 'center',
                               bgcolor: 'grey.50'
                             }}>
                               <Chip 
                                 label="รายการสุดท้าย" 
                                 size="small" 
                                 variant="outlined"
                                 color="default"
                               />
                             </Box>
                           )}
                         </Box>
                       </ListItem>
                     );
                   })
                 )}
               </List>
             ) : (
               <Box sx={{ p: 3, textAlign: 'center' }}>
                 <Icon icon="mdi:magnify-remove-outline" width={48} height={48} color="grey.400" />
                 <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                   ไม่พบรายการที่ค้นหา
                 </Typography>
               </Box>
             )}
           </Box>
         </Paper>
       )}
     </Box>

     {/* Selected Value Info */}
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
   </Container>
 );
};

export default SelectTreeBreadcrumb;