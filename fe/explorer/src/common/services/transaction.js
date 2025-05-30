import { apiService } from "./api";
import { TxnTypes } from "common/constants";

export const transactionsService = {
  getOneTransactionByUuid(uuid) {
    if (!uuid) {
      throw Error("Missing argument");
    }
    return apiService.get(`transaction/${uuid}`, {});
  },

  getTopTransactions() {
    return apiService.get(`transactions/range`, {
      params: { pageNumber: 0, limit: 10 },
    });
  },

  getTransactionsByPage(pageNumber, limit = 10) {
    return apiService.get("transactions/range", {
      params: { pageNumber, limit },
    });
  },
  getTotalTransactionNumber(hour) {
    return apiService.get(`transactions/number/${hour}`);
  },
  getTransactionsByAddress(
    address,
    pageNumber = 1,
    limitNumber = 50,
    includeService = true
  ) {
    let isEqualType = false;
    let type = -1; //Return all types
    if (!includeService) {
      type = TxnTypes.SERVICE_PAYMENT; //Exclude this
    }
    return apiService.get(`accounttx/${address}`, {
      params: { type, pageNumber, limitNumber, isEqualType },
    });
  },
  getTransactionHistory() {
    return apiService.get(`transactions/history`);
  },
  getTransactionHistoryByHour() {
    return apiService.get(`transactions/historyByHr`);
  },
  getTransactionHistoryByFilter(filterOption) {
    return apiService.get(
      `transactions/historyByFilter?filterBy=${filterOption}`
    );
  },
};
