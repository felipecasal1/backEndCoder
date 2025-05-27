import CartModel from "../models/cart.model.js";

export class CartDAO {
  static async getCartById(cid) {
    return await CartModel.findById(cid).populate("products.product").lean();
  }

  static async addProductToCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const item = cart.products.find(p => p.product.toString() === pid);
    if (item) {
      
      item.quantity++;
    } else {
      cart.products.push({ product: pid });
    }

    return await cart.save();
  }

  static async removeProduct(cid, pid) {
    const cart = await CartModel.findById(cid);
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    return await cart.save();
  }

  static async updateProducts(cid, newProducts) {
    const cart = await CartModel.findById(cid);
    cart.products = newProducts;
    return await cart.save();
  }

  static async updateQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    const item = cart.products.find(p => p.product.toString() === pid);
    if (item) {
      item.quantity = quantity;
    }
    return await cart.save();
  }

  static async clearCart(cid) {
    const cart = await CartModel.findById(cid);
    cart.products = [];
    return await cart.save();
  }
}
