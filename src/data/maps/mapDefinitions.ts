import { Floor, Area } from '../type';

/**
 * 第一層樓的區域定義
 */
const f1Areas: Area[] = [
  {
    id: 'f1-town',
    name: '新手村',
    type: 'town',
    position: { x: 50, y: 30 },  // 位於地圖中上方
    description: '初心者的起點，這裡有完善的設施和友善的居民',
    connections: ['f1-wild-east', 'f1-wild-west'],
    maxExploration: 100
  },
  {
    id: 'f1-wild-east',
    name: '東部草原',
    type: 'wild',
    position: { x: 75, y: 50 },  // 位於右側
    description: '一望無際的草原，適合新手冒險者練習',
    connections: ['f1-town', 'f1-dungeon'],
    maxExploration: 200
  },
  {
    id: 'f1-wild-west',
    name: '西部森林',
    type: 'wild',
    position: { x: 25, y: 50 },  // 位於左側
    description: '茂密的森林，蘊藏著豐富的資源',
    connections: ['f1-town'],
    maxExploration: 200
  },
  {
    id: 'f1-dungeon',
    name: '古代遺跡',
    type: 'dungeon',
    position: { x: 85, y: 70 },  // 位於右下角
    description: '神秘的遺跡，傳說中藏有強大的守護者',
    connections: ['f1-wild-east'],
    requiredExploration: 150,    // 需要在野外累積足夠探索度
    maxExploration: 300,
    maxDungeonExploration: 100   // 單次探索上限
  }
];

/**
 * 第二層樓的區域定義
 */
const f2Areas: Area[] = [
  {
    id: 'f2-town',
    name: '迷霧之村',
    type: 'town',
    position: { x: 50, y: 30 },
    description: '被迷霧環繞的神秘村落，村民性格較為冷漠',
    connections: ['f2-wild'],
    maxExploration: 100
  },
  {
    id: 'f2-wild',
    name: '迷霧森林',
    type: 'wild',
    position: { x: 50, y: 60 },
    description: '充滿迷霧的詭異森林，很容易迷失方向',
    connections: ['f2-town', 'f2-dungeon'],
    maxExploration: 300
  },
  {
    id: 'f2-dungeon',
    name: '失落神殿',
    type: 'dungeon',
    position: { x: 50, y: 90 },
    description: '古老的神殿遺跡，據說是上古時代的祭祀場所',
    connections: ['f2-wild'],
    requiredExploration: 200,
    maxExploration: 400,
    maxDungeonExploration: 150
  }
];

/**
 * 樓層定義
 */
const floors: Floor[] = [
  {
    id: 1,
    name: '初心者平原',
    description: '適合初學者的寧靣地帶，這裡的怪物相對和善',
    areas: f1Areas,
    backgroundImage: 'map-bg-1f.png'  // 之後再處理圖片資源
  },
  {
    id: 2,
    name: '迷霧之境',
    description: '被迷霧籠罩的神秘地帶，充滿未知的危險',
    requiredBoss: 'f1-dungeon-boss',  // 需要打敗1F的BOSS
    areas: f2Areas,
    backgroundImage: 'map-bg-2f.png'
  }
];

/**
 * 基礎移動速度（每單位距離所需秒數）
 */
const BASE_MOVEMENT_SPEED = 0.5;

/**
 * 根據區域類型取得速度修正值
 */
const getSpeedModifier = (fromType: Area['type'], toType: Area['type']): number => {
  // 從城鎮出發比較快
  if (fromType === 'town') return 0.8;
  // 從迷宮返回比較慢
  if (fromType === 'dungeon') return 1.2;
  // 其他情況正常速度
  return 1;
};

/**
 * 驗證區域連接的一致性
 * @returns 錯誤訊息陣列，如果為空表示驗證通過
 */
const validateConnections = (floor: Floor): string[] => {
    const errors: string[] = [];
    
    floor.areas.forEach(area => {
      area.connections.forEach(targetId => {
        // 檢查目標區域是否存在
        const targetArea = floor.areas.find(a => a.id === targetId);
        if (!targetArea) {
          errors.push(`${area.id} 連接到不存在的區域 ${targetId}`);
          return;
        }
        
        // 檢查雙向連接
        if (!targetArea.connections.includes(area.id)) {
          errors.push(`${area.id} 到 ${targetId} 的連接不是雙向的`);
        }
      });
    });
  
    return errors;
  };
  
  /**
   * 驗證所有樓層的區域連接
   */
  const validateAllFloors = (): void => {
    floors.forEach(floor => {
      const errors = validateConnections(floor);
      if (errors.length > 0) {
        console.error(`樓層 ${floor.id} 的連接驗證錯誤：`);
        errors.forEach(err => console.error(err));
        throw new Error('地圖定義錯誤：區域連接不一致');
      }
    });
  };
  
  // 在匯出前進行驗證
  validateAllFloors();
  
  export { floors, BASE_MOVEMENT_SPEED, getSpeedModifier };