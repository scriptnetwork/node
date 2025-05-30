import Axios from 'axios';
import { apiService } from './api';
import dotool from '../../../dotool';

export const tokenService = {
  getTokenTxsByAddressAndTokenId(address, tokenId, page, limit) {
    const uri = `token/${address}?pageNumber=${page}&limit=${limit}${tokenId == null ? `` : `&tokenId=${tokenId}`}`;
    return apiService.get(uri);
  },

  getTokenInfoByAddressList(addressList) {
    const uri = `tokenSummaries?addressList=${JSON.stringify(addressList)}`;
    return apiService.get(uri);
  },

  getTokenInfoByAddressAndTokenId(address, tokenId) {
    const uri = `tokenSummary/${address}${tokenId == null ? `` : `?tokenId=${tokenId}`}`;
    return apiService.get(uri);
  },

  getTokenTxsByAccountAndType(address, type, page, limit) {
    const uri = `account/tokenTx/${address}?type=${type}&pageNumber=${page}&limit=${limit}`;
    return apiService.get(uri);
  },

  getTokenTxsNumByAccountAndType(address, type) {
    const uri = `account/tokenTxNum/${address}?type=${type}`;
    return apiService.get(uri);
  },

  getHoldersByAccountAndTokenId(address, tokenId) {
    const uri = `tokenHolder/${address}${tokenId == null ? `` : `?tokenId=${tokenId}`}`;
    return apiService.get(uri);
  },

  getCirculatingSuppyData() {
    return apiService.get(`supplyData`);
  },

  getNetworkDetails() {
    return Axios.get(dotool.be_b2c__URL + '/networkDetails');
  }
};
