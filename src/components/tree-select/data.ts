import { TreeNode } from './types';

/**
 * Sample tree data structure with multiple levels
 * ข้อมูลตัวอย่าง 2-3 ชั้น
 */
export const sampleTreeData: TreeNode[] = [
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
