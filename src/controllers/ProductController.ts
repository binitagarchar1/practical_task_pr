import { Request, Response } from 'express';
import ProductModel, { Product } from '../models/ProductModel';

class ProductController {
  public async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { category, priceBand, name, page, limit } = req.query;
      const filter: any = {};

      if (category) {
        filter.category = category;
      }

      if (priceBand) {
        switch (priceBand) {
          case 'low':
            filter.price = { $lt: 50 };
            break;
          case 'medium':
            filter.price = { $gte: 50, $lte: 100 };
            break;
          case 'high':
            filter.price = { $gt: 100 };
            break;
          default:
            break;
        }
      }


    if (name) {
        const nameString = Array.isArray(name) ? name[0] : name;
        filter.name = { $regex: new RegExp(String(nameString), 'i') };
      }
      
      
      

      const pageNumber = parseInt(page as string) || 1;
      const pageSize = parseInt(limit as string) || 10;
      const skip = (pageNumber - 1) * pageSize;

      const totalCount = await ProductModel.countDocuments(filter);
      const totalPages = Math.ceil(totalCount / pageSize);

      const products = await ProductModel.find(filter)
        .skip(skip)
        .limit(pageSize);

      res.json({ products, totalPages });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  public async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params; 
      const product = await ProductModel.findById(id);
      res.json(product);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  public async createProduct(req: Request, res: Response): Promise<void> {
    try {
        console.log("req.vodyh",req.body);
        
        const { name, category, price } = req.body;
        const product: Product = await ProductModel.create({
          name,
          category,
          price
        });
        res.send({"msg":"created"});
      } catch (error) {
        console.error(error);
        res.sendStatus(500);
      }
  }

  public async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, category, price } = req.body;

      await ProductModel.findByIdAndUpdate(id, {
        name,
        category,
        price,
      });

      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await ProductModel.findByIdAndDelete(id);
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
}

export default new ProductController();
