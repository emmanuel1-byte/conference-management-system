import multer from 'multer'
import { Service } from '../../service/service'
const parser = multer({ storage: Service.upload()})