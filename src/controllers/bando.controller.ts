import express, { Request, Response } from 'express';
import {DTTich} from '../models/ditich.model';
import {PhongTuc} from '../models/phongtuc.model';
import {SuKien} from '../models/sukien.model';

export const getBanDoVanHoa = async (req: Request, res: Response) => { 
    try {

        const leHoiData = await PhongTuc.find({ loai: 'Lễ hội' }, '_id ten diaDiem camNang luotXem moTa');
        const leHoiMapped = leHoiData.map(item => ({
          _id: item._id,
          ten: item.ten,
          camNang: item.camNang || '',
          loai: 'Lễ hội',
          viTri: item.diaDiem ,
          luotXem: item.luotXem || 0,
          moTa: item.moTa || '',
        }));

        const ditichData = await DTTich.find({}, '_id ten viTri camNang luotXem moTa ');

        const ditichMapped = ditichData.map(item => ({
          _id: item._id,
          ten: item.ten,
          camNang: item.camNang || '',
          loai: 'Di tích',
          viTri: item.viTri ,
          luotXem: item.luotXem || 0,
          moTa: item.moTa || '',
        }));
    
        const suKienData = await SuKien.find({}, 'ten diaDiem camNang luotXem moTa thoiGianBatDau');
        const suKienMapped = suKienData.map(item => ({
          _id: item._id,
          ten: item.ten,
          camNang: item.camNang || '',
          loai: 'Sự kiện',
          viTri: item.diaDiem ,
          luotXem: item.luotXem || 0,
          moTa: item.moTa || '',
          thoiGianBatDau: item.thoiGianBatDau || '',
        }));
    
        const allData = [...ditichMapped, ...leHoiMapped, ...suKienMapped];
    
        res.json(allData);
      } catch (error) {
        console.error('Lỗi khi truy vấn dữ liệu bản đồ:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo dữ liệu bản đồ.' });
      }
}