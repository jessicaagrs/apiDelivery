import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ApiError } from "../../../error/apiError";
import StoresService from "../../services/stores/storesService";

const service = new StoresService();

const paramsSchema = z.object({
	id: z
		.string({
			required_error: "O id do método de pagamento é obrigatório",
			invalid_type_error: "O id do método de pagamento deve ser uma string",
		})
		.min(1, {
			message: "O id do método de pagamento não pode ser vazio",
		}),
	cnpj: z
		.string({
			required_error: "O CNPJ  da loja é obrigatório",
			invalid_type_error: "O CNPJ  da loja deve ser uma string",
		})
		.length(14, {
			message: "O cnpj deve ter 14 caracteres, sem pontuação ou caracteres especiais.",
		}),
	corporateReason: z.string({
		required_error: "O id da loja é obrigatório",
		invalid_type_error: "O id da loja deve ser uma string",
	}),
});

type ParamsType = z.infer<typeof paramsSchema>;

class StoresController {
	async getAllStores(request: FastifyRequest, reply: FastifyReply) {
		try {
			const stores = await service.getAllStores();
			return reply.send(stores);
		} catch (error: any) {
			const statusCode = reply.statusCode || 500;
			const err = new ApiError(statusCode, error.message);
			reply.status(err.statusCode).send(err);
		}
	}

	async getStoreById(request: FastifyRequest<{ Params: Partial<ParamsType> }>, reply: FastifyReply) {
		try {
			const id = paramsSchema.partial().parse(request.params).id;
			const store = await service.getStoreById(id);
			return reply.send(store);
		} catch (error: any) {
			const statusCode = reply.statusCode || 500;
			const err = new ApiError(statusCode, error.message);
			reply.status(err.statusCode).send(err);
		}
	}

	async createStore(request: FastifyRequest<{ Params: Partial<ParamsType> }>, reply: FastifyReply) {
		try {
			const { cnpj, corporateReason } = paramsSchema.partial().parse(request.body);
			await service.createStore(cnpj, corporateReason);
			return reply.status(201).send("Loja criada com sucesso.");
		} catch (error: any) {
			const statusCode = reply.statusCode || 500;
			const err = new ApiError(statusCode, error.message);
			reply.status(err.statusCode).send(err);
		}
	}

	async updateStore(request: FastifyRequest<{ Params: Partial<ParamsType> }>, reply: FastifyReply) {
		try {
			const { id, cnpj, corporateReason } = paramsSchema.partial().parse(request.body);
			await service.updateStore(id, cnpj, corporateReason);
			return reply.status(200).send("Dados da loja atualizados com sucesso.");
		} catch (error: any) {
			const statusCode = reply.statusCode || 500;
			const err = new ApiError(statusCode, error.message);
			reply.status(err.statusCode).send(err);
		}
	}

	async deleteStore(request: FastifyRequest<{ Params: Partial<ParamsType> }>, reply: FastifyReply) {
		try {
			const id = paramsSchema.partial().parse(request.params).id;
			await service.deleteStore(id);
			return reply.status(200).send(`Loja [${id}] excluída com sucesso.`);
		} catch (error: any) {
			const statusCode = reply.statusCode || 500;
			const err = new ApiError(statusCode, error.message);
			reply.status(err.statusCode).send(err);
		}
	}
}

export default StoresController;
