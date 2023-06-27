"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
class ProductController {
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category, priceBand, name, page, limit } = req.query;
                const filter = {};
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
                const pageNumber = parseInt(page) || 1;
                const pageSize = parseInt(limit) || 10;
                const skip = (pageNumber - 1) * pageSize;
                const totalCount = yield ProductModel_1.default.countDocuments(filter);
                const totalPages = Math.ceil(totalCount / pageSize);
                const products = yield ProductModel_1.default.find(filter)
                    .skip(skip)
                    .limit(pageSize);
                res.json({ products, totalPages });
            }
            catch (error) {
                console.error(error);
                res.sendStatus(500);
            }
        });
    }
    getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const product = yield ProductModel_1.default.findById(id);
                res.json(product);
            }
            catch (error) {
                console.error(error);
                res.sendStatus(500);
            }
        });
    }
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("req.vodyh", req.body);
                const { name, category, price } = req.body;
                const product = yield ProductModel_1.default.create({
                    name,
                    category,
                    price
                });
                res.send({ "msg": "created" });
            }
            catch (error) {
                console.error(error);
                res.sendStatus(500);
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, category, price } = req.body;
                yield ProductModel_1.default.findByIdAndUpdate(id, {
                    name,
                    category,
                    price,
                });
                res.sendStatus(200);
            }
            catch (error) {
                console.error(error);
                res.sendStatus(500);
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield ProductModel_1.default.findByIdAndDelete(id);
                res.sendStatus(200);
            }
            catch (error) {
                console.error(error);
                res.sendStatus(500);
            }
        });
    }
}
exports.default = new ProductController();
