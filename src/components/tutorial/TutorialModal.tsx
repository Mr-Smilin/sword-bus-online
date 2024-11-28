import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  LinearProgress
} from '@mui/material';
import { classes } from '../../data/classes';

interface TutorialModalProps {
  onComplete: (name: string, classId: string) => void;
}

/**
 * 新手引導對話框組件
 */
const TutorialModal = ({ onComplete }: TutorialModalProps) => {
  // 步驟狀態
  const [step, setStep] = useState(0);
  // 表單資料
  const [formData, setFormData] = useState({
    name: '',
    classId: ''
  });

  // 基礎職業列表
  const baseClasses = Object.values(classes).filter(c => c.type === 'beginner');

  /**
   * 處理名稱提交
   */
  const handleNameSubmit = () => {
    if (formData.name.trim().length >= 2) {
      setStep(1);
    }
  };

  /**
   * 處理職業選擇
   */
  const handleClassSelect = (classId: string) => {
    setFormData(prev => ({ ...prev, classId }));
  };

  /**
   * 處理完成創建
   */
  const handleComplete = () => {
    if (formData.name && formData.classId) {
      onComplete(formData.name, formData.classId);
    }
  };

  return (
    <Dialog open fullScreen>
      <DialogTitle>
        <Box sx={{ mb: 1 }}>
          <Typography variant="h5">歡迎來到Sword Art Offline</Typography>
          <LinearProgress 
            variant="determinate" 
            value={(step + 1) * 50} 
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        {step === 0 ? (
          <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              告訴我你的名字
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              這個名字將會成為你在這個世界的代號
            </Typography>
            <TextField
              fullWidth
              label="名稱"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              helperText={
                formData.name.trim().length < 2 
                  ? "名稱至少需要2個字元" 
                  : " "
              }
              error={formData.name.trim().length < 2}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleNameSubmit}
              disabled={formData.name.trim().length < 2}
              sx={{ mt: 3 }}
            >
              下一步
            </Button>
          </Box>
        ) : (
          <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              選擇你的職業
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              每個職業都有其獨特的特性和技能
            </Typography>
            <Grid container spacing={2}>
              {baseClasses.map(classData => (
                <Grid item xs={12} sm={6} key={classData.id}>
                  <Card 
                    elevation={formData.classId === classData.id ? 8 : 1}
                    sx={{
                      transition: 'all 0.2s',
                      transform: formData.classId === classData.id 
                        ? 'scale(1.02)' 
                        : 'scale(1)'
                    }}
                  >
                    <CardActionArea 
                      onClick={() => handleClassSelect(classData.id)}
                      sx={{ p: 2 }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {classData.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {classData.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        {step === 1 && (
          <>
            <Button onClick={() => setStep(0)}>
              返回
            </Button>
            <Button
              variant="contained"
              onClick={handleComplete}
              disabled={!formData.classId}
            >
              開始冒險
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TutorialModal;