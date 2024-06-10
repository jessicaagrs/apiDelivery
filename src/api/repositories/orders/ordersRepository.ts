import prismaClient from "../../../db/prisma";

class OrdersRepository {
	async getAllOrders() {
		return await prismaClient.orders.findMany();
	}

	async getOrdersByStatus(status: string) {
		return await prismaClient.orders.findMany({
			where: {
				status,
			},
		});
	}

	async getOrderById(id: string) {
		return await prismaClient.orders.findUnique({
			where: {
				id,
			},
		});
	}

	async getOrderByShopman(id: string) {
		return await prismaClient.orders.findFirst({
			where: {
				shopmanId: id,
			},
		});
	}

	async getOrderByCustomer(id: string) {
		return await prismaClient.orders.findFirst({
			where: {
				customerId: id,
			},
		});
	}

	async getOrderByPaymentMethod(id: string) {
		return await prismaClient.orders.findFirst({
			where: {
				paymentMethodId: id,
			},
		});
	}

	async getOrderByStore(id: string) {
		return await prismaClient.orders.findFirst({
			where: {
				storeId: id,
			},
		});
	}

	async createOrder(customerId: string, paymentMethodId: string, status: string, value: number) {
		return await prismaClient.orders.create({
			data: {
				customerId: customerId,
				shopmanId: "",
				paymentMethodId: paymentMethodId,
				status,
				value,
			},
		});
	}

	async updateOrderStatus(id: string, paymentMethodId: string, status: string, value: number, shopmanId: string) {
		return await prismaClient.orders.update({
			where: {
				id,
			},
			data: {
				shopmanId,
				paymentMethodId,
				status,
				value,
				updateAt: new Date(),
			},
		});
	}

	async deleteOrder(id: string, status: string) {
		await prismaClient.orders.update({
			where: {
				id,
			},
			data: {
				status,
			},
		});
	}
}

export default OrdersRepository;
